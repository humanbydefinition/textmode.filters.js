/**
 * @packageDocumentation
 * Complete optional filter system for textmode.js, including 18 setup-compiled GPU effects,
 * custom registration, layer/global/final queues, and automatic resource cleanup.
 *
 * @categoryDescription Workflow
 * The plugin that installs the filter system on a textmode.js sketch.
 *
 * @categoryDescription Filter management
 * The runtime that owns filter registration, queues, GPU resources, and cleanup.
 *
 * @categoryDescription Built-in filters
 * The shipped filter names and their parameter types.
 *
 * @categoryDescription Custom filters
 * Types used when registering bespoke GPU filters on the manager.
 *
 * @categoryDescription Color adjustment filters
 * Configuration options for the bundled color-adjustment effects.
 *
 * @categoryDescription Distortion filters
 * Configuration options for the bundled distortion effects.
 *
 * @categoryDescription Stylization filters
 * Configuration options for the bundled stylization effects.
 *
 * @showCategories
 */

import './public/augmentations';

export { FiltersPlugin } from './plugin/FiltersPlugin';
export { TextmodeFilterManager } from './runtime/TextmodeFilterManager';
export type { TextmodeFilterShader, TextmodeFilterUniformDefinitions } from './public/filter-types';
export type { FilterName } from './public/filter-types';
export type { BuiltInFilterName, BuiltInFilterParameterMap } from './builtins/catalog';
export type { BloomOptions } from './builtins/stylization/bloom';
export type { BrightnessOptions } from './builtins/color-adjustment/brightness';
export type { ChromaticAberrationOptions } from './builtins/distortion/chromaticAberration';
export type { ContrastOptions } from './builtins/color-adjustment/contrast';
export type { CrtMattiasOptions } from './builtins/stylization/crtMattias';
export type { FilmGrainOptions } from './builtins/stylization/filmGrain';
export type { GlitchOptions } from './builtins/stylization/glitch';
export type { GrayscaleOptions } from './builtins/color-adjustment/grayscale';
export type { GridDistortionOptions } from './builtins/distortion/gridDistortion';
export type { HueRotateOptions } from './builtins/color-adjustment/hueRotate';
export type { PixelateOptions } from './builtins/distortion/pixelate';
export type { PosterizeOptions } from './builtins/color-adjustment/posterize';
export type { SaturationOptions } from './builtins/color-adjustment/saturation';
export type { ScanlinesOptions } from './builtins/stylization/scanlines';
export type { SepiaOptions } from './builtins/color-adjustment/sepia';
export type { ThresholdOptions } from './builtins/color-adjustment/threshold';
export type { VignetteOptions } from './builtins/stylization/vignette';

import type { TextmodePlugin } from 'textmode.js';
import { FiltersPlugin } from './plugin/FiltersPlugin';

declare global {
	interface Window {
		FiltersPlugin?: TextmodePlugin;
	}
}

if (typeof window !== 'undefined') window.FiltersPlugin = FiltersPlugin;
