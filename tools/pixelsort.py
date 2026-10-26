#!/usr/bin/env python3
"""Pixel-sort glitch for site images: turns any photo or video frame into a "signal" still.

Sorts pixels by brightness inside runs whose luminance falls between --lo and --hi, along columns
(drip look) or rows. Output is upscaled with nearest-neighbour so the pixels stay crisp.

    python3 tools/pixelsort.py in.jpg assets/feed/sig-x.jpg --lo 60 --hi 230 --scale 2
"""
import argparse

import numpy as np
from PIL import Image


def sort_runs(img: np.ndarray, lo: int, hi: int, reverse: bool) -> np.ndarray:
    out = img.copy()
    lum = (0.299 * img[..., 0] + 0.587 * img[..., 1] + 0.114 * img[..., 2])
    mask = (lum >= lo) & (lum <= hi)
    h, w = mask.shape
    for x in range(w):
        col_mask, y = mask[:, x], 0
        while y < h:
            if not col_mask[y]:
                y += 1
                continue
            end = y
            while end < h and col_mask[end]:
                end += 1
            if end - y > 2:
                order = np.argsort(lum[y:end, x], kind="stable")
                if reverse:
                    order = order[::-1]
                out[y:end, x] = img[y:end, x][order]
            y = end
    return out


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("src")
    p.add_argument("dst")
    p.add_argument("--lo", type=int, default=50, help="min luminance of a sorted run (0-255)")
    p.add_argument("--hi", type=int, default=235, help="max luminance of a sorted run (0-255)")
    p.add_argument("--rows", action="store_true", help="sort along rows instead of columns")
    p.add_argument("--reverse", action="store_true", help="bright pixels first")
    p.add_argument("--scale", type=int, default=1, help="nearest-neighbour upscale factor")
    p.add_argument("--max", type=int, default=900, help="downscale longest side before sorting")
    a = p.parse_args()

    im = Image.open(a.src).convert("RGB")
    im.thumbnail((a.max, a.max))
    arr = np.asarray(im)
    if a.rows:
        arr = sort_runs(arr.transpose(1, 0, 2), a.lo, a.hi, a.reverse).transpose(1, 0, 2)
    else:
        arr = sort_runs(arr, a.lo, a.hi, a.reverse)
    out = Image.fromarray(arr)
    if a.scale > 1:
        out = out.resize((out.width * a.scale, out.height * a.scale), Image.NEAREST)
    out.save(a.dst, quality=86)
    print(f"{a.dst}: {out.width}x{out.height}")


if __name__ == "__main__":
    main()
