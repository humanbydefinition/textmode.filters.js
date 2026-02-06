---
title: createFiltersPlugin
description: createFiltersPlugin function API reference for textmode.js.
category: Functions
api: true
kind: Function
lastModified: 2026-02-06
---

[textmode.filters.js](../index.md) / createFiltersPlugin

# Function: createFiltersPlugin()

```ts
function createFiltersPlugin(): TextmodePlugin;
```

Creates the `textmode.filters.js` plugin for textmode.js.

Included filters:
- `brightness` - Adjust image brightness (amount: 1.0 = normal, >1 = brighter, <1 = darker)
- `contrast` - Adjust image contrast (amount: 1.0 = normal, >1 = more contrast, <1 = less)
- `hueRotate` - Rotate colors around the hue wheel (angle: 0-360 degrees)
- `glitch` - Digital glitch effect (amount: 0.0 = none, higher values = more intense)
- `chromaticAberration` - RGB channel separation effect (amount: offset in pixels, direction: vec2 for offset direction)
- `pixelate` - Pixelation effect (pixelSize: size of pixels in pixels)
- `gridDistortion` - Distort a monospaced grid with custom patterns (widthFactors/heightFactors: arrays of values 0-1)
- `crtMattias` - CRT monitor emulation with curvature, scanlines, blur, and noise (by Mattias)
- `scanlines` - Customizable scanlines effect (count, lineWidth, intensity, speed)
- `vignette` - Darkened edges/corners effect (amount, softness, roundness)
- `bloom` - Glow effect around bright areas (threshold, intensity, radius)
- `filmGrain` - Animated film grain/noise overlay (intensity, size, speed)
- `saturation` - Adjust color intensity (amount: 0 = grayscale, 1 = normal, >1 = vivid)
- `posterize` - Reduce color levels (levels: number of color bands, default 4.0)

## Returns

`TextmodePlugin`

A textmode.js plugin instance.

## Example

```javascript
import { textmode } from 'textmode.js';
import { createFiltersPlugin } from 'textmode.filters.js';

const t = textmode.create({
    plugins: [createFiltersPlugin()]
});

let frame = 0;
t.draw(() => {
    t.layers.base.filter('brightness', 1.2);

    // Grid distortion with custom sine wave pattern
    const widthFactors = [];
    const heightFactors = [];
    for (let i = 0; i < 80; i++) {
        widthFactors.push((Math.sin(i * 0.1 + frame * 0.05) + 1) / 2);
    }
    for (let j = 0; j < 40; j++) {
        heightFactors.push((Math.sin(j * 0.15 + frame * 0.03) + 1) / 2);
    }
    t.layers.base.filter('gridDistortion', {
      gridCellDimensions: [80, 40],
      gridPixelDimensions: [t.grid.cols * t.grid.cellWidth, t.grid.rows * t.grid.cellHeight],
      gridOffsetDimensions: [t.grid.offsetX, t.grid.offsetY],
      widthFactors,
      heightFactors,
      widthVariationScale: 0.5,
      heightVariationScale: 0.5
    });

    t.background(0);
    frame++;
});
```
