---
title: FilmGrainOptions
description: Configuration options for the **filmGrain** filter.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-02-06
isInterface: true
---

[textmode.filters.js](../index.md) / FilmGrainOptions

# Interface: FilmGrainOptions

Configuration options for the **filmGrain** filter.

Adds an animated film grain/noise texture overlay to simulate vintage
film stock or analog video. The multi-layered noise creates an organic,
moving grain pattern that's less visible in darker areas, mimicking
real film characteristics.

## Example

```javascript
// Subtle film grain
let time = 0;
t.draw(() => {
  t.layers.base.filter('filmGrain', {
    intensity: 0.15,
    size: 1.5,
    speed: 1.0,
    time: time
  });
  time += 0.016;
});

// Heavy vintage film look
t.layers.base.filter('filmGrain', {
  intensity: 0.4,
  size: 3.0,
  speed: 2.0,
  time: time
});
```

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="intensity"></a> `intensity` | `number` | Strength of the grain effect. - `0.0` = no grain - `0.2` = subtle grain (default) - `0.5+` = heavy, noticeable grain **Default** `0.2` |
| <a id="size"></a> `size` | `number` | Size of grain particles. - `1.0` = fine grain - `2.0` = medium grain (default) - `5.0+` = coarse, chunky grain **Default** `2.0` |
| <a id="speed"></a> `speed` | `number` | Animation speed of the grain. - `0.0` = static grain (not recommended) - `1.0` = normal animation speed (default) - `2.0+` = fast, flickering grain **Default** `1.0` |
| <a id="time"></a> `time` | `number` | Animation time parameter. Increment this value each frame to animate the grain effect. **Default** `0.0` |
