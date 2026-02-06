---
title: ChromaticAberrationOptions
description: Configuration options for the 'chromaticAberration' filter.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-02-06
isInterface: true
---

[textmode.filters.js](../index.md) / ChromaticAberrationOptions

# Interface: ChromaticAberrationOptions

Configuration options for the `'chromaticAberration'` filter.

RGB color channel separation effect that simulates lens distortion
found in cheap cameras or creates stylized glitch aesthetics.

## Example

```javascript
// Horizontal aberration
t.layers.base.filter('chromaticAberration', {
  amount: 10,
  direction: [1, 0]
});

// Diagonal aberration
t.layers.base.filter('chromaticAberration', {
  amount: 5,
  direction: [1, 1]
});

// Shorthand (horizontal only)
t.layers.base.filter('chromaticAberration', 8);
```

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="amount"></a> `amount` | `number` | Offset amount in pixels. Controls how far the red and blue channels are separated from green. **Default** `5.0` |
| <a id="direction"></a> `direction` | \[`number`, `number`\] | Direction of the color separation as `[x, y]`. - `[1, 0]` = horizontal separation - `[0, 1]` = vertical separation - `[1, 1]` = diagonal separation The vector is normalized internally, so `[2, 0]` is the same as `[1, 0]`. **Default** `[1.0, 0.0]` |
