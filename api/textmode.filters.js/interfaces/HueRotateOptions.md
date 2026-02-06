---
title: HueRotateOptions
description: Configuration options for the **hueRotate** filter.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-02-06
isInterface: true
---

[textmode.filters.js](../index.md) / HueRotateOptions

# Interface: HueRotateOptions

Configuration options for the **hueRotate** filter.

Shifts all colors around the color wheel by a specified angle.
Useful for color grading or creating surreal color effects.

## Example

```javascript
// Rotate hue by 180 degrees (complementary colors)
t.layers.base.filter('hueRotate', { angle: 180 });

// Shorthand syntax
t.layers.base.filter('hueRotate', 90);

// Animate hue rotation
let frame = 0;
t.draw(() => {
  t.layers.base.filter('hueRotate', frame % 360);
  frame++;
});
```

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="angle"></a> `angle` | `number` | Rotation angle in degrees. - `0` = no change - `180` = complementary colors - `360` = full rotation (same as 0) Values wrap around, so `370` is equivalent to `10`. **Default** `0.0` |
