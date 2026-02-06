---
title: SaturationOptions
description: Configuration options for the **saturation** filter.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-02-06
isInterface: true
---

[textmode.filters.js](../index.md) / SaturationOptions

# Interface: SaturationOptions

Configuration options for the **saturation** filter.

Adjusts color intensity without affecting luminance.
Perfect for creating vivid, oversaturated looks or desaturating to grayscale.

## Example

```javascript
// Convert to grayscale
t.layers.base.filter('saturation', { amount: 0 });

// Vivid colors
t.layers.base.filter('saturation', 1.5);

// Shorthand syntax
t.layers.base.filter('saturation', 0); // grayscale
```

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="amount"></a> `amount` | `number` | Saturation multiplier. - `0.0` = grayscale (no color) - `1.0` = normal saturation (no change) - `> 1.0` = vivid/oversaturated colors **Default** `1.0` |
