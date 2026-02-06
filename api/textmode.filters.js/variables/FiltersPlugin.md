---
title: FiltersPlugin
description: GPU-accelerated image filters plugin for textmode.js.
category: Variables
api: true
kind: Variable
lastModified: 2026-02-06
---

[textmode.filters.js](../index.md) / FiltersPlugin

# Variable: FiltersPlugin

```ts
const FiltersPlugin: TextmodePlugin;
```

GPU-accelerated image filters plugin for textmode.js.

Add this plugin to your textmode.js instance to enable 14 customizable
visual effects that run entirely on the GPU via WebGL2 fragment shaders.

## Included Filters

**Color Adjustment:**
- `brightness` - Adjust image brightness (amount: 1.0 = normal, >1 = brighter, <1 = darker)
- `contrast` - Adjust image contrast (amount: 1.0 = normal, >1 = more contrast, <1 = less)
- `saturation` - Adjust color intensity (amount: 0 = grayscale, 1 = normal, >1 = vivid)
- `hueRotate` - Rotate colors around the hue wheel (angle: 0-360 degrees)
- `posterize` - Reduce color levels (levels: number of color bands, default 4.0)

**Distortion:**
- `chromaticAberration` - RGB channel separation effect (amount: offset in pixels)
- `pixelate` - Pixelation effect (pixelSize: size of pixels in pixels)
- `gridDistortion` - Distort a monospaced grid with custom patterns

**Stylization:**
- `glitch` - Digital glitch effect (amount: 0.0 = none, higher = more intense)
- `crtMattias` - CRT monitor emulation with curvature, scanlines, blur, and noise
- `scanlines` - Customizable scanlines effect (count, lineWidth, intensity, speed)
- `vignette` - Darkened edges/corners effect (amount, softness, roundness)
- `bloom` - Glow effect around bright areas (threshold, intensity, radius)
- `filmGrain` - Animated film grain/noise overlay (intensity, size, speed)

## Example

```javascript
import { textmode } from 'textmode.js';
import { FiltersPlugin } from 'textmode.filters.js';

const t = textmode.create({
    plugins: [FiltersPlugin]
});

let frame = 0;
t.draw(() => {
    // Simple filter with shorthand value
    t.layers.base.filter('brightness', 1.2);

    // Filter with options object
    t.layers.base.filter('bloom', {
        threshold: 0.5,
        intensity: 1.5,
        radius: 8
    });

    // Animated filter
    t.layers.base.filter('filmGrain', {
        intensity: 0.2,
        time: frame * 0.016
    });

    t.background(0);
    frame++;
});
```

## See

 - [BrightnessOptions](../interfaces/BrightnessOptions.md) for brightness filter parameters
 - [BloomOptions](../interfaces/BloomOptions.md) for bloom filter parameters
 - [GridDistortionOptions](../interfaces/GridDistortionOptions.md) for grid distortion parameters
