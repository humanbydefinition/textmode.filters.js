---
title: PixelateOptions
description: Configuration options for the **pixelate** filter.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-02-06
isInterface: true
---

[textmode.filters.js](../index.md) / PixelateOptions

# Interface: PixelateOptions

Configuration options for the **pixelate** filter.

Reduces image resolution to create a mosaic/pixelated effect
reminiscent of retro video games or censored content.

## Example

```javascript
// Large pixels
t.layers.base.filter('pixelate', { pixelSize: 16 });

// Shorthand syntax
t.layers.base.filter('pixelate', 8);

// Subtle pixelation
t.layers.base.filter('pixelate', 2);
```

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="pixelsize"></a> `pixelSize` | `number` | Size of each pixel block in pixels. Larger values create bigger, more visible pixels. Minimum value: `1.0` **Default** `4.0` |
