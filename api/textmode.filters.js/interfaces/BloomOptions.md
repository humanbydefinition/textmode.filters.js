---
title: BloomOptions
description: Configuration options for the 'bloom' filter.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-02-06
isInterface: true
---

[textmode.filters.js](../index.md) / BloomOptions

# Interface: BloomOptions

Configuration options for the `'bloom'` filter.

Creates a glow effect around bright areas of the image. Pixels above
the brightness threshold emit a soft glow that spreads outward.
Perfect for creating neon, glowing text, or dreamy effects.

## Example

```javascript
// Subtle bloom
t.layers.base.filter('bloom', {
  threshold: 0.7,
  intensity: 0.8,
  radius: 4
});

// Intense neon glow
t.layers.base.filter('bloom', {
  threshold: 0.3,
  intensity: 2.0,
  radius: 12
});

// Dreamy soft glow
t.layers.base.filter('bloom', {
  threshold: 0.5,
  intensity: 1.5,
  radius: 8
});
```

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="threshold"></a> `threshold` | `number` | Brightness level above which pixels will glow. - `0.0` = everything glows - `0.5` = mid-brightness and above glows (default) - `1.0` = only the brightest pixels glow **Default** `0.5` |
| <a id="intensity"></a> `intensity` | `number` | Strength of the glow effect. - `0.0` = no visible glow - `1.0` = normal glow intensity (default) - `2.0+` = very bright, intense glow **Default** `1.0` |
| <a id="radius"></a> `radius` | `number` | Size of the glow spread in pixels. Larger values create a wider, softer glow. - `1.0` = tight glow - `4.0` = moderate spread (default) - `10.0+` = wide, diffuse glow **Default** `4.0` |
