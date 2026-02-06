---
title: ContrastOptions
description: Configuration options for the **contrast** filter.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-02-06
isInterface: true
---

[textmode.filters.js](../index.md) / ContrastOptions

# Interface: ContrastOptions

Configuration options for the **contrast** filter.

Adjusts image contrast by scaling pixel values around mid-gray.

## Example

```javascript
// Increase contrast
t.layers.base.filter('contrast', { amount: 1.5 });

// Shorthand: same as above
t.layers.base.filter('contrast', 1.5);

// Reduce contrast (washed out look)
t.layers.base.filter('contrast', 0.5);
```

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="amount"></a> `amount` | `number` | Contrast multiplier. - `1.0` = normal contrast (no change) - `> 1.0` = more contrast (darker darks, brighter brights) - `< 1.0` = less contrast (more gray/washed out) - `0.0` = solid gray **Default** `1.0` |
