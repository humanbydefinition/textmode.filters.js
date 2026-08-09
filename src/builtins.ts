import type { TextmodeUniformValue } from 'textmode.js';

import invert from './shaders/invert.frag';
import grayscale from './shaders/grayscale.frag';
import sepia from './shaders/sepia.frag';
import threshold from './shaders/threshold.frag';
import brightness from './shaders/brightness.frag';
import contrast from './shaders/contrast.frag';
import saturation from './shaders/saturation.frag';
import hueRotate from './shaders/hueRotate.frag';
import posterize from './shaders/posterize.frag';
import chromaticAberration from './shaders/chromaticAberration.frag';
import pixelate from './shaders/pixelate.frag';
import gridDistortion from './shaders/gridDistortion.frag';
import glitch from './shaders/glitch.frag';
import crtMattias from './shaders/crtMattias.frag';
import scanlines from './shaders/scanlines.frag';
import vignette from './shaders/vignette.frag';
import bloom from './shaders/bloom.frag';
import filmGrain from './shaders/filmGrain.frag';

export type FilterUniformDefinitions = Record<string, readonly [paramName: string, defaultValue: TextmodeUniformValue]>;

export interface BuiltinFilterDescriptor {
	readonly source: string;
	readonly uniforms: FilterUniformDefinitions;
}

const factors = Object.freeze(new Array<number>(128).fill(0.5)) as unknown as number[];

export const BUILTIN_FILTERS = Object.freeze({
	invert: { source: invert, uniforms: {} },
	grayscale: { source: grayscale, uniforms: { u_amount: ['amount', 1] } },
	sepia: { source: sepia, uniforms: { u_amount: ['amount', 1] } },
	threshold: { source: threshold, uniforms: { u_threshold: ['threshold', 0.5] } },
	brightness: { source: brightness, uniforms: { u_amount: ['amount', 1] } },
	contrast: { source: contrast, uniforms: { u_amount: ['amount', 1] } },
	saturation: { source: saturation, uniforms: { u_amount: ['amount', 1] } },
	hueRotate: { source: hueRotate, uniforms: { u_angle: ['angle', 0] } },
	posterize: { source: posterize, uniforms: { u_levels: ['levels', 4] } },
	chromaticAberration: {
		source: chromaticAberration,
		uniforms: { u_amount: ['amount', 5], u_direction: ['direction', [1, 0]] },
	},
	pixelate: { source: pixelate, uniforms: { u_pixelSize: ['pixelSize', 4] } },
	gridDistortion: {
		source: gridDistortion,
		uniforms: {
			u_gridCellDimensions: ['gridCellDimensions', [80, 40]],
			u_gridPixelDimensions: ['gridPixelDimensions', [640, 320]],
			u_gridOffsetDimensions: ['gridOffsetDimensions', [0, 0]],
			u_widthFactors: ['widthFactors', factors],
			u_heightFactors: ['heightFactors', factors],
			u_widthVariationScale: ['widthVariationScale', 0.5],
			u_heightVariationScale: ['heightVariationScale', 0.5],
		},
	},
	glitch: { source: glitch, uniforms: { u_amount: ['amount', 0] } },
	crtMattias: {
		source: crtMattias,
		uniforms: { u_curvature: ['curvature', 0.5], u_scanSpeed: ['scanSpeed', 1], u_time: ['time', 0] },
	},
	scanlines: {
		source: scanlines,
		uniforms: {
			u_count: ['count', 300],
			u_lineWidth: ['lineWidth', 0.5],
			u_intensity: ['intensity', 0.75],
			u_speed: ['speed', 1],
			u_time: ['time', 0],
		},
	},
	vignette: {
		source: vignette,
		uniforms: { u_amount: ['amount', 0.5], u_softness: ['softness', 0.5], u_roundness: ['roundness', 0.5] },
	},
	bloom: {
		source: bloom,
		uniforms: { u_threshold: ['threshold', 0.5], u_intensity: ['intensity', 1], u_radius: ['radius', 4] },
	},
	filmGrain: {
		source: filmGrain,
		uniforms: { u_intensity: ['intensity', 0.2], u_size: ['size', 2], u_speed: ['speed', 1], u_time: ['time', 0] },
	},
} satisfies Record<string, BuiltinFilterDescriptor>);
