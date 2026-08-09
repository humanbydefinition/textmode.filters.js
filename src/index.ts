/**
 * @packageDocumentation
 * Complete optional filter system for textmode.js, including 18 lazily compiled GPU effects,
 * custom registration, layer/global/final queues, and automatic resource cleanup.
 */

import './augmentations';

export { FiltersPlugin } from './FiltersPlugin';
export { TextmodeFilterManager } from './TextmodeFilterManager';
export type { TextmodeFilterShader, TextmodeFilterUniformDefinitions } from './TextmodeFilterManager';
export type {
	BloomOptions,
	BrightnessOptions,
	BuiltInFilterName,
	BuiltInFilterParameterMap,
	ChromaticAberrationOptions,
	ContrastOptions,
	CrtMattiasOptions,
	FilmGrainOptions,
	FilterName,
	GlitchOptions,
	GrayscaleOptions,
	GridDistortionOptions,
	HueRotateOptions,
	PixelateOptions,
	PosterizeOptions,
	SaturationOptions,
	ScanlinesOptions,
	SepiaOptions,
	ThresholdOptions,
	VignetteOptions,
} from './types';

import { FiltersPlugin } from './FiltersPlugin';
import type { TextmodePlugin } from 'textmode.js';

declare global {
	interface Window {
		FiltersPlugin?: TextmodePlugin;
	}
}

if (typeof window !== 'undefined') window.FiltersPlugin = FiltersPlugin;
