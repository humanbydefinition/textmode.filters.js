---
title: ScanlinesOptions
description: Configuration options for the 'scanlines' filter.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-02-06
isInterface: true
---

[textmode.filters.js](../index.md) / ScanlinesOptions

# Interface: ScanlinesOptions

Configuration options for the `'scanlines'` filter.

A standalone scanline effect that adds horizontal lines to the image
to simulate a CRT display or old monitor. More customizable than
the scanlines in crtMattias.

## Example

```javascript
// Classic scanlines
let time = 0;
t.draw(() => {
  t.layers.base.filter('scanlines', {
    count: 300,
    lineWidth: 0.5,
    intensity: 0.75,
    speed: 1.0,
    time: time
  });
  time += 0.016;
});

// Thick, slow-moving lines
t.layers.base.filter('scanlines', {
  count: 50,
  lineWidth: 0.8,
  intensity: 0.5,
  speed: 0.2,
  time: time
});
```

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="count"></a> `count` | `number` | Number of scanlines across the image height. Higher values create finer, more dense lines. Minimum value: `10.0` **Default** `300.0` |
| <a id="linewidth"></a> `lineWidth` | `number` | Width of the lines relative to the spacing. - `0.0` = very thin lines (mostly transparent) - `0.5` = equal line and gap width - `1.0` = solid (no gaps) **Default** `0.5` |
| <a id="intensity"></a> `intensity` | `number` | Opacity/darkness of the scanlines. - `0.0` = invisible lines - `0.75` = clearly visible (default) - `1.0` = maximum darkness (solid black lines) **Default** `0.75` |
| <a id="speed"></a> `speed` | `number` | Scrolling speed of the lines. - `0.0` = static lines - `1.0` = normal scrolling speed - Higher values = faster scrolling **Default** `1.0` |
| <a id="time"></a> `time` | `number` | Animation time parameter. Increment this value each frame to animate the scrolling effect. **Default** `0.0` |
