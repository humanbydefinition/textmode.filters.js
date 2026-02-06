---
title: PosterizeOptions
description: Configuration options for the **posterize** filter.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-02-06
isInterface: true
---

[textmode.filters.js](../index.md) / PosterizeOptions

# Interface: PosterizeOptions

Configuration options for the **posterize** filter.

Reduces the color palette to a limited number of bands per channel,
creating a retro quantized/poster-like look.

## Example

```javascript
// Strong posterization (4 levels)
t.layers.base.filter('posterize', { levels: 4 });

// Shorthand syntax
t.layers.base.filter('posterize', 8);

// Extreme posterization (2 levels = high contrast)
t.layers.base.filter('posterize', 2);
```

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="levels"></a> `levels` | `number` | Number of color levels per channel. Lower values create more dramatic banding effects. Higher values approach the original image quality. - `2` = extreme posterization (very few colors) - `4` = strong posterization (default) - `8+` = subtle posterization **Default** `4.0` |
