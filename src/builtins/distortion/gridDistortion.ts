import { defineBuiltinFilter } from '../definition';
import gridDistortionSource from './gridDistortion.frag';

function createFactorDefaults(): number[] {
	return new Array<number>(128).fill(0.5);
}

/**
 * Configuration options for the `'gridDistortion'` filter.
 *
 * Distorts a monospaced character grid by varying the width and height
 * of individual cells. Create wave effects, perspective distortions,
 * or other grid warping effects by providing custom factor arrays.
 *
 * This filter is designed specifically for textmode.js grids, allowing
 * you to create dynamic text distortion effects.
 *
 * @example
 * {@includeCode ../../../examples/Distortion/gridDistortion/sketch.js}
 *
 * @category Distortion filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/GridDistortionOptions | GridDistortionOptions API reference}
 */
export interface GridDistortionOptions {
	/**
	 * Grid dimensions as `[columns, rows]`.
	 *
	 * Should match your textmode grid dimensions.
	 *
	 * Maximum value: `[128, 128]`
	 *
	 * @default [80.0, 40.0]
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/GridDistortionOptions#gridcelldimensions | GridDistortionOptions.gridCellDimensions API reference}
	 */
	gridCellDimensions?: [number, number];

	/**
	 * Grid size in pixels as `[width, height]`.
	 *
	 * Typically calculated as:
	 * `[t.grid.cols * t.grid.cellWidth, t.grid.rows * t.grid.cellHeight]`
	 *
	 * @default [640.0, 320.0]
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/GridDistortionOptions#gridpixeldimensions | GridDistortionOptions.gridPixelDimensions API reference}
	 */
	gridPixelDimensions?: [number, number];

	/**
	 * Grid offset in pixels as `[offsetX, offsetY]`.
	 *
	 * Use `[t.grid.offsetX, t.grid.offsetY]` to match your grid position.
	 *
	 * @default [0.0, 0.0]
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/GridDistortionOptions#gridoffsetdimensions | GridDistortionOptions.gridOffsetDimensions API reference}
	 */
	gridOffsetDimensions?: [number, number];

	/**
	 * Array of distortion values (0-1) for each column.
	 *
	 * Must contain at least as many elements as columns (max 128).
	 * Values control the relative width of each column:
	 * - `0.0` = minimum width
	 * - `0.5` = normal width
	 * - `1.0` = maximum width
	 *
	 * @default Array(128).fill(0.5)
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/GridDistortionOptions#widthfactors | GridDistortionOptions.widthFactors API reference}
	 */
	widthFactors?: number[];

	/**
	 * Array of distortion values (0-1) for each row.
	 *
	 * Must contain at least as many elements as rows (max 128).
	 * Values control the relative height of each row:
	 * - `0.0` = minimum height
	 * - `0.5` = normal height
	 * - `1.0` = maximum height
	 *
	 * @default Array(128).fill(0.5)
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/GridDistortionOptions#heightfactors | GridDistortionOptions.heightFactors API reference}
	 */
	heightFactors?: number[];

	/**
	 * Intensity multiplier for width distortion.
	 *
	 * Higher values create more dramatic width variations.
	 *
	 * @default 0.5
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/GridDistortionOptions#widthvariationscale | GridDistortionOptions.widthVariationScale API reference}
	 */
	widthVariationScale?: number;

	/**
	 * Intensity multiplier for height distortion.
	 *
	 * Higher values create more dramatic height variations.
	 *
	 * @default 0.5
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/GridDistortionOptions#heightvariationscale | GridDistortionOptions.heightVariationScale API reference}
	 */
	heightVariationScale?: number;
}

export const gridDistortionFilter = defineBuiltinFilter<GridDistortionOptions>({
	id: 'gridDistortion',
	shader: gridDistortionSource,
	primary: 'gridCellDimensions',
	uniforms: {
		u_gridCellDimensions: ['gridCellDimensions', [80, 40]],
		u_gridPixelDimensions: ['gridPixelDimensions', [640, 320]],
		u_gridOffsetDimensions: ['gridOffsetDimensions', [0, 0]],
		u_widthFactors: ['widthFactors', createFactorDefaults()],
		u_heightFactors: ['heightFactors', createFactorDefaults()],
		u_widthVariationScale: ['widthVariationScale', 0.5],
		u_heightVariationScale: ['heightVariationScale', 0.5],
	},
});
