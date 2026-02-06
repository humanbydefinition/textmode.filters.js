---
title: FilterOptions
description: Union type of all available filter option interfaces.
category: Type Aliases
api: true
kind: TypeAlias
lastModified: 2026-02-06
---

[textmode.filters.js](../index.md) / FilterOptions

# Type Alias: FilterOptions

```ts
type FilterOptions = 
  | BrightnessOptions
  | ContrastOptions
  | SaturationOptions
  | HueRotateOptions
  | PosterizeOptions
  | ChromaticAberrationOptions
  | PixelateOptions
  | GridDistortionOptions
  | GlitchOptions
  | CrtMattiasOptions
  | ScanlinesOptions
  | VignetteOptions
  | BloomOptions
  | FilmGrainOptions;
```

Union type of all available filter option interfaces.

Useful for type-safe filter handling when the filter name is dynamic.
