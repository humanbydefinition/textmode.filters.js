---
title: GlitchOptions
description: Configuration options for the 'glitch' filter.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-02-06
isInterface: true
---

[textmode.filters.js](../index.md) / GlitchOptions

# Interface: GlitchOptions

Configuration options for the `'glitch'` filter.

Digital glitch effect with RGB channel separation, scanlines, and noise.
Creates a corrupted/broken digital signal aesthetic.

## Example

```javascript
// Subtle glitch
t.layers.base.filter('glitch', { amount: 0.5 });

// Intense glitch
t.layers.base.filter('glitch', 2.0);

// Animate glitch intensity
t.draw(() => {
  const glitchAmount = Math.random() > 0.9 ? Math.random() * 3 : 0.1;
  t.layers.base.filter('glitch', glitchAmount);
});
```

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="amount"></a> `amount` | `number` | Glitch intensity. - `0.0` = no glitch effect - `0.5` = subtle glitching - `1.0+` = intense, chaotic glitching **Default** `0.0` |
