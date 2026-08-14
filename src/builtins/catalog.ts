import type { BuiltinFilterDescriptor } from './definition';
import { brightnessFilter, type BrightnessOptions } from './color-adjustment/brightness';
import { contrastFilter, type ContrastOptions } from './color-adjustment/contrast';
import { grayscaleFilter, type GrayscaleOptions } from './color-adjustment/grayscale';
import { hueRotateFilter, type HueRotateOptions } from './color-adjustment/hueRotate';
import { invertFilter } from './color-adjustment/invert';
import { posterizeFilter, type PosterizeOptions } from './color-adjustment/posterize';
import { saturationFilter, type SaturationOptions } from './color-adjustment/saturation';
import { sepiaFilter, type SepiaOptions } from './color-adjustment/sepia';
import { thresholdFilter, type ThresholdOptions } from './color-adjustment/threshold';
import { chromaticAberrationFilter, type ChromaticAberrationOptions } from './distortion/chromaticAberration';
import { gridDistortionFilter, type GridDistortionOptions } from './distortion/gridDistortion';
import { pixelateFilter, type PixelateOptions } from './distortion/pixelate';
import { bloomFilter, type BloomOptions } from './stylization/bloom';
import { crtMattiasFilter, type CrtMattiasOptions } from './stylization/crtMattias';
import { filmGrainFilter, type FilmGrainOptions } from './stylization/filmGrain';
import { glitchFilter, type GlitchOptions } from './stylization/glitch';
import { scanlinesFilter, type ScanlinesOptions } from './stylization/scanlines';
import { vignetteFilter, type VignetteOptions } from './stylization/vignette';

/**
 * Parameter types for every built-in filter.
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BuiltInFilterParameterMap | BuiltInFilterParameterMap API reference}
 */
export interface BuiltInFilterParameterMap {
	/**
	 * Invert has no configurable parameters.
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BuiltInFilterParameterMap#property-invert | BuiltInFilterParameterMap.invert API reference}
	 */
	invert: void;
	/**
	 * Grayscale parameters.
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BuiltInFilterParameterMap#property-grayscale | BuiltInFilterParameterMap.grayscale API reference}
	 */
	grayscale: number | GrayscaleOptions | void;
	/**
	 * Sepia parameters.
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BuiltInFilterParameterMap#property-sepia | BuiltInFilterParameterMap.sepia API reference}
	 */
	sepia: number | SepiaOptions | void;
	/**
	 * Threshold parameters.
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BuiltInFilterParameterMap#property-threshold | BuiltInFilterParameterMap.threshold API reference}
	 */
	threshold: number | ThresholdOptions | void;
	/**
	 * Brightness parameters.
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BuiltInFilterParameterMap#property-brightness | BuiltInFilterParameterMap.brightness API reference}
	 */
	brightness: number | BrightnessOptions | void;
	/**
	 * Contrast parameters.
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BuiltInFilterParameterMap#property-contrast | BuiltInFilterParameterMap.contrast API reference}
	 */
	contrast: number | ContrastOptions | void;
	/**
	 * Saturation parameters.
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BuiltInFilterParameterMap#property-saturation | BuiltInFilterParameterMap.saturation API reference}
	 */
	saturation: number | SaturationOptions | void;
	/**
	 * Hue rotation parameters.
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BuiltInFilterParameterMap#property-huerotate | BuiltInFilterParameterMap.hueRotate API reference}
	 */
	hueRotate: number | HueRotateOptions | void;
	/**
	 * Posterize parameters.
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BuiltInFilterParameterMap#property-posterize | BuiltInFilterParameterMap.posterize API reference}
	 */
	posterize: number | PosterizeOptions | void;
	/**
	 * Chromatic aberration parameters.
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BuiltInFilterParameterMap#property-chromaticaberration | BuiltInFilterParameterMap.chromaticAberration API reference}
	 */
	chromaticAberration: number | ChromaticAberrationOptions | void;
	/**
	 * Pixelate parameters.
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BuiltInFilterParameterMap#property-pixelate | BuiltInFilterParameterMap.pixelate API reference}
	 */
	pixelate: number | PixelateOptions | void;
	/**
	 * Grid distortion parameters.
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BuiltInFilterParameterMap#property-griddistortion | BuiltInFilterParameterMap.gridDistortion API reference}
	 */
	gridDistortion: number | GridDistortionOptions | void;
	/**
	 * Glitch parameters.
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BuiltInFilterParameterMap#property-glitch | BuiltInFilterParameterMap.glitch API reference}
	 */
	glitch: number | GlitchOptions | void;
	/**
	 * CRT simulation parameters.
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BuiltInFilterParameterMap#property-crtmattias | BuiltInFilterParameterMap.crtMattias API reference}
	 */
	crtMattias: number | CrtMattiasOptions | void;
	/**
	 * Scanline parameters.
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BuiltInFilterParameterMap#property-scanlines | BuiltInFilterParameterMap.scanlines API reference}
	 */
	scanlines: number | ScanlinesOptions | void;
	/**
	 * Vignette parameters.
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BuiltInFilterParameterMap#property-vignette | BuiltInFilterParameterMap.vignette API reference}
	 */
	vignette: number | VignetteOptions | void;
	/**
	 * Bloom parameters.
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BuiltInFilterParameterMap#property-bloom | BuiltInFilterParameterMap.bloom API reference}
	 */
	bloom: number | BloomOptions | void;
	/**
	 * Film grain parameters.
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BuiltInFilterParameterMap#property-filmgrain | BuiltInFilterParameterMap.filmGrain API reference}
	 */
	filmGrain: number | FilmGrainOptions | void;
}

/**
 * Names installed synchronously by {@link FiltersPlugin}.
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/type-aliases/BuiltInFilterName | BuiltInFilterName API reference}
 */
export type BuiltInFilterName = keyof BuiltInFilterParameterMap;

/**
 * The authoritative shipped set of built-in filters. Its keys are compile-time checked to match
 * {@link BuiltInFilterParameterMap} exactly. Internal to the runtime; never exported from the package root.
 */
export const BUILTIN_CATALOG = Object.freeze({
	invert: invertFilter,
	grayscale: grayscaleFilter,
	sepia: sepiaFilter,
	threshold: thresholdFilter,
	brightness: brightnessFilter,
	contrast: contrastFilter,
	saturation: saturationFilter,
	hueRotate: hueRotateFilter,
	posterize: posterizeFilter,
	chromaticAberration: chromaticAberrationFilter,
	pixelate: pixelateFilter,
	gridDistortion: gridDistortionFilter,
	glitch: glitchFilter,
	crtMattias: crtMattiasFilter,
	scanlines: scanlinesFilter,
	vignette: vignetteFilter,
	bloom: bloomFilter,
	filmGrain: filmGrainFilter,
} satisfies Record<BuiltInFilterName, BuiltinFilterDescriptor>);
