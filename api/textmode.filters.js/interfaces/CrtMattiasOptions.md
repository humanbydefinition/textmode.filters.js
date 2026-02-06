---
title: CrtMattiasOptions
description: Configuration options for the 'crtMattias' filter.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-02-06
isInterface: true
---

[textmode.filters.js](../index.md) / CrtMattiasOptions

# Interface: CrtMattiasOptions

Configuration options for the `'crtMattias'` filter.

CRT monitor emulation effect with screen curvature, animated scanlines,
blur, vignette, and film grain noise. Based on Mattias Gustavsson's
classic CRT shader.

## Example

```javascript
// Classic CRT look
let time = 0;
t.draw(() => {
  t.layers.base.filter('crtMattias', {
    curvature: 0.5,
    scanSpeed: 1.0,
    time: time
  });
  time += 0.016;
});

// Flat CRT (no curvature)
t.layers.base.filter('crtMattias', { curvature: 0, time: time });
```

## See

[Original shader by Mattias Gustavsson](https://github.com/libretro/glsl-shaders/blob/master/crt/shaders/crt-mattias.glsl)

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="curvature"></a> `curvature` | `number` | Amount of screen curvature/barrel distortion. - `0.0` = flat screen - `0.5` = moderate curvature (default) - `1.0` = maximum curvature **Default** `0.5` |
| <a id="scanspeed"></a> `scanSpeed` | `number` | Speed of the scrolling scanline effect. Higher values make the scanline crawl faster. **Default** `1.0` |
| <a id="time"></a> `time` | `number` | Animation time parameter. Increment this value each frame to animate the effect. Typically use elapsed time in seconds or frame count. **Default** `0.0` |
