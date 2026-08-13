import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
	FiltersPlugin,
	TextmodeFilterManager,
	type BloomOptions,
	type BrightnessOptions,
	type BuiltInFilterName,
	type BuiltInFilterParameterMap,
	type ChromaticAberrationOptions,
	type ContrastOptions,
	type CrtMattiasOptions,
	type FilmGrainOptions,
	type FilterName,
	type GlitchOptions,
	type GrayscaleOptions,
	type GridDistortionOptions,
	type HueRotateOptions,
	type PixelateOptions,
	type PosterizeOptions,
	type SaturationOptions,
	type ScanlinesOptions,
	type SepiaOptions,
	type TextmodeFilterShader,
	type TextmodeFilterUniformDefinitions,
	type ThresholdOptions,
	type VignetteOptions,
} from '../../src/index';

declare const manager: TextmodeFilterManager;
declare const shader: TextmodeFilterShader;
declare const uniforms: TextmodeFilterUniformDefinitions;
declare const name: FilterName;
declare const builtIn: BuiltInFilterName;
declare const parameters: BuiltInFilterParameterMap;
declare const bloom: BloomOptions;
declare const brightness: BrightnessOptions;
declare const chromaticAberration: ChromaticAberrationOptions;
declare const contrast: ContrastOptions;
declare const crtMattias: CrtMattiasOptions;
declare const filmGrain: FilmGrainOptions;
declare const glitch: GlitchOptions;
declare const grayscale: GrayscaleOptions;
declare const gridDistortion: GridDistortionOptions;
declare const hueRotate: HueRotateOptions;
declare const pixelate: PixelateOptions;
declare const posterize: PosterizeOptions;
declare const saturation: SaturationOptions;
declare const scanlines: ScanlinesOptions;
declare const sepia: SepiaOptions;
declare const threshold: ThresholdOptions;
declare const vignette: VignetteOptions;

if (false) {
	void manager;
	void shader;
	void uniforms;
	void name;
	void builtIn;
	void parameters;
	void bloom;
	void brightness;
	void chromaticAberration;
	void contrast;
	void crtMattias;
	void filmGrain;
	void glitch;
	void grayscale;
	void gridDistortion;
	void hueRotate;
	void pixelate;
	void posterize;
	void saturation;
	void scanlines;
	void sepia;
	void threshold;
	void vignette;
}

describe('public root exports', () => {
	it('exports the two runtime values', () => {
		expect(FiltersPlugin).toBeDefined();
		expect(typeof FiltersPlugin.install).toBe('function');
		expect(TextmodeFilterManager).toBeDefined();
		expect(TextmodeFilterManager.prototype.register).toBeTypeOf('function');
		expect(TextmodeFilterManager.prototype.unregister).toBeTypeOf('function');
		expect(TextmodeFilterManager.prototype.has).toBeTypeOf('function');
	});

	it('keeps package exports to the single root entrypoint', () => {
		const manifest = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'));
		expect(Object.keys(manifest.exports).sort()).toEqual(['.']);
		expect(manifest.files).toEqual(['dist']);
	});
});
