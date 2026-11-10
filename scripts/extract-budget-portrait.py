"""Extract only the reference portrait from the user-provided budget image.

The source budget is private and must not be committed or published. This
operation extracts existing pixels, resamples them and feathers the perimeter;
it never generates, substitutes, or alters facial features.

Usage: python3 scripts/extract-budget-portrait.py /path/to/budget.png
"""

from pathlib import Path
import sys

from PIL import Image, ImageChops, ImageFilter


SOURCE_BOUNDS = (500, 0, 824, 407)
OUTPUT = Path(__file__).resolve().parent.parent / "assets"


def extract(source_path: Path, mask_path: Path | None = None) -> None:
    source = Image.open(source_path).convert("RGB")
    if source.size != (1024, 1536):
        raise ValueError(f"Unrecognized source dimensions: {source.size}")

    portrait = source.crop(SOURCE_BOUNDS)
    OUTPUT.mkdir(parents=True, exist_ok=True)

    # Documentary crop, preserving the actual pixels of the budget image.
    portrait.save(OUTPUT / "portrait-budget-exact.png", optimize=True)

    # Only high-quality resampling, plus edge transparency for the sunset
    # background; no generative upscaling or face editing.
    portrait = portrait.resize((972, 1221), Image.Resampling.LANCZOS).convert("RGBA")
    w, h = portrait.size
    horizontal = Image.new("L", (w, h))
    for x in range(w):
        # The face and central body stay opaque. Feather both cut edges.
        opacity = max(0, min(255, int(255 * min(1, x / 93, (w - 1 - x) / 93))))
        for y in range(h):
            horizontal.putpixel((x, y), opacity)

    vertical = Image.new("L", (w, h))
    for y in range(h):
        # Fade the cut-off lower torso into the site's gradient.
        opacity = max(0, min(255, int(255 * min(1, (h - 1 - y) / 260))))
        vertical.paste(opacity, (0, y, w, y + 1))

    perimeter = ImageChops.multiply(horizontal, vertical)
    if mask_path is not None:
        # Apple Vision segmentation, in the same 324×407 cropped coordinate
        # space, removes the budget's original pale backdrop without changing
        # any of the subject's features or clothing.
        subject = Image.open(mask_path).convert("L")
        if subject.size != (324, 407):
            raise ValueError(f"Incorrect person mask dimensions: {subject.size}")
        subject = subject.resize((w, h), Image.Resampling.LANCZOS)
        subject = subject.filter(ImageFilter.GaussianBlur(2.3))
        perimeter = ImageChops.multiply(perimeter, subject)

    portrait.putalpha(perimeter)
    portrait.save(OUTPUT / "portrait-budget-hero.webp", "WEBP", quality=92, method=6)

    print("Extracted", OUTPUT / "portrait-budget-exact.png")
    print("Built", OUTPUT / "portrait-budget-hero.webp", portrait.size)


if __name__ == "__main__":
    if len(sys.argv) not in (2, 3):
        raise SystemExit("Usage: extract-budget-portrait.py BUDGET.png [PERSON-MASK.png]")
    extract(Path(sys.argv[1]), Path(sys.argv[2]) if len(sys.argv) == 3 else None)
