---
title: BrightnessOptions
description: Configuration options for the 'brightness' filter.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-02-06
isInterface: true
---

[textmode.filters.js](../index.md) / BrightnessOptions

# Interface: BrightnessOptions

Configuration options for the `'brightness'` filter.

Adjusts image brightness by multiplying pixel values.

## Example

```javascript
// Increase brightness by 50%
t.layers.base.filter('brightness', { amount: 1.5 });

// Shorthand: same as above
t.layers.base.filter('brightness', 1.5);

// Darken the image
t.layers.base.filter('brightness', 0.7);
```

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="amount"></a> `amount` | `number` | Brightness multiplier. - `1.0` = normal brightness (no change) - `> 1.0` = brighter - `< 1.0` = darker - `0.0` = completely black **Default** `1.0` |
