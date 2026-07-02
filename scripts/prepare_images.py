#!/usr/bin/env python3
"""
Batch AI background removal + resize for Shopify jewelry photos.

Uses the rembg library to cut the subject out of a busy/colored background,
then composites it onto a clean WHITE square canvas at Shopify's recommended
size. Uses a product-focused model + alpha matting for sharp edges, and keeps
only the largest detected region so small background specks are dropped.

SETUP (one time):
    python3 -m venv venv
    source venv/bin/activate          # Windows: venv\\Scripts\\activate
    pip install "rembg[cpu]" pillow onnxruntime numpy

USAGE:
    python scripts/prepare_images.py raw_photos shopify_ready
    # optional flags:
    #   --model isnet-general-use   AI model (default; best for products).
    #                               try 'u2net' or 'birefnet-general' too.
    #   --size 2048                 output square size in px (default 2048)
    #   --pad 0.08                  padding around the subject 0-0.4 (default 0.08)
    #   --format jpg|png            jpg = white bg (default), png = transparent
    #   --quality 92                JPEG quality (default 92)
    #   --no-alpha-matting          disable edge refinement (faster, rougher)

Notes:
  * First run downloads the model (~90-180MB) once.
  * A hand/fingers HOLDING the jewelry are foreground, not background, so the
    AI will keep them. For hand shots, either crop tighter first or retouch
    manually — no background remover can reliably separate a held object from
    the hand. Flat-lay / stand shots give the cleanest automatic results.
"""

import argparse
import sys
from pathlib import Path

try:
    import numpy as np
    from PIL import Image
    from rembg import remove, new_session
except ImportError:
    sys.exit(
        "Missing dependencies. Run:\n"
        '  pip install "rembg[cpu]" pillow onnxruntime numpy'
    )

VALID_EXT = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff"}


def keep_largest_region(rgba: Image.Image) -> Image.Image:
    """Zero out every opaque blob except the biggest one (drops stray specks).

    Pure-numpy flood fill over the binary alpha mask — no scipy needed.
    """
    a = np.array(rgba)
    alpha = a[:, :, 3]
    mask = alpha > 20
    h, w = mask.shape
    labels = np.zeros((h, w), dtype=np.int32)
    current = 0
    best_label, best_size = 0, 0

    # Iterative flood fill (stack-based) to label connected components.
    for sy in range(h):
        for sx in range(w):
            if not mask[sy, sx] or labels[sy, sx]:
                continue
            current += 1
            size = 0
            stack = [(sy, sx)]
            labels[sy, sx] = current
            while stack:
                y, x = stack.pop()
                size += 1
                for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
                    if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not labels[ny, nx]:
                        labels[ny, nx] = current
                        stack.append((ny, nx))
            if size > best_size:
                best_size, best_label = size, current

    if best_label:
        a[:, :, 3] = np.where(labels == best_label, alpha, 0).astype(np.uint8)
    return Image.fromarray(a, "RGBA")


def process(src: Path, dst: Path, session, size: int, pad: float, fmt: str,
            quality: int, alpha_matting: bool) -> None:
    with Image.open(src) as im:
        # 1. AI cutout → RGBA with transparent background. Alpha matting
        #    refines fine edges (chains, prongs) for a clean result.
        cut = remove(
            im.convert("RGBA"),
            session=session,
            alpha_matting=alpha_matting,
            alpha_matting_foreground_threshold=240,
            alpha_matting_background_threshold=15,
            alpha_matting_erode_size=11,
            post_process_mask=True,
        )

    # 2. Focus on the jewelry: keep only the largest cut-out region so
    #    isolated background artifacts are removed.
    cut = keep_largest_region(cut)

    # 3. Trim to the subject's bounding box for consistent padding.
    bbox = cut.getbbox()
    if not bbox:
        raise ValueError("no subject detected after background removal")
    cut = cut.crop(bbox)

    # 4. Scale to fit inside a padded square.
    inner = max(1, int(size * (1 - 2 * pad)))
    cut.thumbnail((inner, inner), Image.LANCZOS)

    # 5. Center on the canvas (white for jpg, transparent for png).
    bg = (255, 255, 255, 0) if fmt == "png" else (255, 255, 255, 255)
    canvas = Image.new("RGBA", (size, size), bg)
    canvas.paste(cut, ((size - cut.width) // 2, (size - cut.height) // 2), cut)

    # 6. Save.
    if fmt == "png":
        canvas.save(dst.with_suffix(".png"), "PNG", optimize=True)
    else:
        canvas.convert("RGB").save(
            dst.with_suffix(".jpg"), "JPEG", quality=quality, optimize=True
        )


def main() -> None:
    ap = argparse.ArgumentParser(description="AI background removal for Shopify photos.")
    ap.add_argument("input", nargs="?", default="raw_photos", help="Folder with raw photos")
    ap.add_argument("output", nargs="?", default="shopify_ready", help="Output folder")
    ap.add_argument("--model", default="isnet-general-use")
    ap.add_argument("--size", type=int, default=2048)
    ap.add_argument("--pad", type=float, default=0.08)
    ap.add_argument("--format", choices=["jpg", "png"], default="jpg")
    ap.add_argument("--quality", type=int, default=92)
    ap.add_argument("--no-alpha-matting", dest="alpha_matting", action="store_false")
    args = ap.parse_args()

    in_dir, out_dir = Path(args.input), Path(args.output)
    if not in_dir.is_dir():
        sys.exit(f"Input folder not found: {in_dir}")
    out_dir.mkdir(parents=True, exist_ok=True)

    files = sorted(p for p in in_dir.iterdir() if p.suffix.lower() in VALID_EXT)
    if not files:
        sys.exit(f"No images found in {in_dir}")

    try:
        session = new_session(args.model)
    except Exception as e:  # noqa: BLE001
        sys.exit(f"Could not load model '{args.model}': {e}")

    print(f"Removing backgrounds from {len(files)} image(s) with '{args.model}' → {out_dir} ...")
    ok = 0
    for i, src in enumerate(files, 1):
        try:
            process(src, out_dir / src.stem, session, args.size, args.pad,
                    args.format, args.quality, args.alpha_matting)
            ok += 1
            print(f"  [{i}/{len(files)}] {src.name} ✓")
        except Exception as e:  # noqa: BLE001 — keep the batch going
            print(f"  [{i}/{len(files)}] {src.name} ✗  ({e})")
    print(f"Done — {ok}/{len(files)} succeeded. Output in: {out_dir}")


if __name__ == "__main__":
    main()
