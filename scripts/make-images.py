#!/usr/bin/env python3
"""Generate on-brand favicon + OG images for justincase.scot.

Text-free cupboard pictogram (mirrors the site's TierPictogram motif) from the
house palette tokens in src/app/globals.css:
  cream bg     #F7F1E3  (--background)
  brand brown  #8A4B2E  (--brand, filled shelves)
  stroke       #5C4630  (--cupboard-stroke / --brand-dark)
  empty shelf  #E9DFC8  (--cupboard-empty)
  card         #FFFDF6  (--card)

Rendered at 4x supersample, LANCZOS downsampled. No font dependency
(text-free mark, per "Fraunces if any text is used" — we use none).

Outputs (Next.js App Router conventions):
  src/app/favicon.ico    (16/32/48)
  src/app/icon.png       (512x512, auto-served)
  src/app/apple-icon.png (180x180, auto-served)
  public/og-image.png    (1200x630, wired into layout metadata)
"""
import os
from PIL import Image, ImageDraw

CREAM  = (247, 241, 227, 255)   # --background
BRAND  = (138,  75,  46, 255)   # --brand
STROKE = (92,  70,  48, 255)    # --cupboard-stroke
EMPTY  = (233, 223, 200, 255)   # --cupboard-empty
CARD   = (255, 253, 246, 255)   # --card

HERE = os.path.dirname(os.path.abspath(__file__))
APP_DIR = os.path.normpath(os.path.join(HERE, "..", "src", "app"))
PUBLIC_DIR = os.path.normpath(os.path.join(HERE, "..", "public"))

# Shelf rows, y from top of the 52x64 viewBox (bottom-most = pick the last).
SHELF_Y = [53, 42, 31, 20, 9]
NSHELVES = len(SHELF_Y)


def draw_cupboard(d, ox, oy, kx, ky, fill_count, ss):
    """Draw the cupboard at 4x scale inside the draw context.

    ox/oy = origin offset in supersampled px; kx/ky = px per viewBox unit.
    Mirrors TierPictogram: cabinet rect (2,2)-(50,62), stroke #5C4630 2px,
    fill cream; 5 shelves at SHELF_Y from the bottom up, filled #8A4B2E.
    """
    d.rectangle(
        [int(ox + 2 * kx), int(oy + 2 * ky), int(ox + 50 * kx), int(oy + 62 * ky)],
        fill=CREAM, outline=STROKE, width=2 * ss)
    # Fill from the bottom shelf upward (bottom = largest SHELF_Y)
    for i, y in enumerate(SHELF_Y):
        filled = i < fill_count
        c = BRAND if filled else EMPTY
        d.rectangle(
            [int(ox + 6 * kx), int(oy + y * ky), int(ox + 46 * kx), int(oy + (y + 7) * ky)],
            fill=c, outline=None,
        )


def render_icon(size, bg):
    """Square icon: cupboard filling most of the canvas on a card background."""
    ss = 4
    S = size * ss
    img = Image.new("RGBA", (S, S), bg)
    d = ImageDraw.Draw(img)
    # Padding ~14% each side within the square.
    pad = 0.14
    box = S * (1 - 2 * pad)
    kx = box / 52.0
    ky = box / 64.0
    ox = (S - kx * 52.0) / 2
    oy = (S - ky * 64.0) / 2
    draw_cupboard(d, ox, oy, kx, ky, fill_count=3, ss=ss)
    return img.resize((size, size), Image.LANCZOS)


def render_og():
    """1200x630 OG image: card field, slim brand band bottom, cupboard centre."""
    W, H = 1200, 630
    ss = 4
    S = (W * ss, H * ss)
    img = Image.new("RGBA", S, CARD)
    d = ImageDraw.Draw(img)
    # slim brand band at the bottom
    band_h = 14 * ss
    d.rectangle([0, H * ss - band_h, W * ss, H * ss], fill=BRAND)
    # cupboard ~ 340 tall, centred, nudged up ~28px
    cw = 340
    kx = (cw * ss) / 52.0
    ky = kx  # square-ish consistent scale
    ch = ky * 64.0
    ox = (W * ss - kx * 52.0) / 2
    oy = (H * ss - ch) / 2 - 28 * ss
    draw_cupboard(d, ox, oy, kx, ky, fill_count=3, ss=ss)
    return img.resize((W, H), Image.LANCZOS)


def main():
    os.makedirs(APP_DIR, exist_ok=True)
    os.makedirs(PUBLIC_DIR, exist_ok=True)
    print("Generating justincase.scot images...")

    # favicon.ico multi-size
    ico = render_icon(64, CARD)
    ico.save(os.path.join(APP_DIR, "favicon.ico"), "ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    print("  src/app/favicon.ico     16/32/48")

    render_icon(512, CARD).save(os.path.join(APP_DIR, "icon.png"), "PNG")
    print("  src/app/icon.png        512x512 (auto-served)")

    render_icon(180, CARD).save(os.path.join(APP_DIR, "apple-icon.png"), "PNG")
    print("  src/app/apple-icon.png  180x180 (auto-served)")

    render_og().save(os.path.join(PUBLIC_DIR, "og-image.png"), "PNG")
    print("  public/og-image.png     1200x630")

    # remove probe helper if left over
    probe = os.path.join(HERE, "probe-imaging.py")
    if os.path.exists(probe):
        os.remove(probe)
    print("DONE")


if __name__ == "__main__":
    main()