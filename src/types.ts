/**
 * Type definitions for all filter options in textmode.filters.js.
 *
 * Each filter can be applied using either:
 * - A single value (shorthand for the primary parameter)
 * - An options object with named parameters
 *
 * @example
 * {@includeCode ../examples/Stylization/bloom/sketch.js}
 *
 * @module
 */

// ============================================================================
// BRIGHTNESS
// ============================================================================

/**
 * Configuration options for the `'brightness'` filter.
 *
 * Adjusts image brightness by multiplying pixel values.
 *
 * @example
 * {@includeCode ../examples/ColorAdjustment/brightness/sketch.js}
 *
 * @category Color adjustment filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BrightnessOptions | BrightnessOptions API reference}
 */
export interface BrightnessOptions {
	/**
	 * Brightness multiplier.
	 *
	 * - `1.0` = normal brightness (no change)
	 * - `> 1.0` = brighter
	 * - `< 1.0` = darker
	 * - `0.0` = completely black
	 *
	 * @default 1.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BrightnessOptions#amount | BrightnessOptions.amount API reference}
	 */
	amount: number;
}

// ============================================================================
// CONTRAST
// ============================================================================

/**
 * Configuration options for the `'contrast'` filter.
 *
 * Adjusts image contrast by scaling pixel values around mid-gray.
 *
 * @example
 * {@includeCode ../examples/ColorAdjustment/contrast/sketch.js}
 *
 * @category Color adjustment filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/ContrastOptions | ContrastOptions API reference}
 */
export interface ContrastOptions {
	/**
	 * Contrast multiplier.
	 *
	 * - `1.0` = normal contrast (no change)
	 * - `> 1.0` = more contrast (darker darks, brighter brights)
	 * - `< 1.0` = less contrast (more gray/washed out)
	 * - `0.0` = solid gray
	 *
	 * @default 1.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/ContrastOptions#amount | ContrastOptions.amount API reference}
	 */
	amount: number;
}

// ============================================================================
// SATURATION
// ============================================================================

/**
 * Configuration options for the `'saturation'` filter.
 *
 * Adjusts color intensity without affecting luminance.
 * Perfect for creating vivid, oversaturated looks or desaturating to grayscale.
 *
 * @example
 * {@includeCode ../examples/ColorAdjustment/saturation/sketch.js}
 *
 * @category Color adjustment filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/SaturationOptions | SaturationOptions API reference}
 */
export interface SaturationOptions {
	/**
	 * Saturation multiplier.
	 *
	 * - `0.0` = grayscale (no color)
	 * - `1.0` = normal saturation (no change)
	 * - `> 1.0` = vivid/oversaturated colors
	 *
	 * @default 1.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/SaturationOptions#amount | SaturationOptions.amount API reference}
	 */
	amount: number;
}

// ============================================================================
// HUE ROTATE
// ============================================================================

/**
 * Configuration options for the `'hueRotate'` filter.
 *
 * Shifts all colors around the color wheel by a specified angle.
 * Useful for color grading or creating surreal color effects.
 *
 * @example
 * {@includeCode ../examples/ColorAdjustment/hueRotate/sketch.js}
 *
 * @category Color adjustment filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/HueRotateOptions | HueRotateOptions API reference}
 */
export interface HueRotateOptions {
	/**
	 * Rotation angle in degrees.
	 *
	 * - `0` = no change
	 * - `180` = complementary colors
	 * - `360` = full rotation (same as 0)
	 *
	 * Values wrap around, so `370` is equivalent to `10`.
	 *
	 * @default 0.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/HueRotateOptions#angle | HueRotateOptions.angle API reference}
	 */
	angle: number;
}

// ============================================================================
// POSTERIZE
// ============================================================================

/**
 * Configuration options for the `'posterize'` filter.
 *
 * Reduces the color palette to a limited number of bands per channel,
 * creating a retro quantized/poster-like look.
 *
 * @example
 * {@includeCode ../examples/ColorAdjustment/posterize/sketch.js}
 *
 * @category Color adjustment filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/PosterizeOptions | PosterizeOptions API reference}
 */
export interface PosterizeOptions {
	/**
	 * Number of color levels per channel.
	 *
	 * Lower values create more dramatic banding effects.
	 * Higher values approach the original image quality.
	 *
	 * - `2` = extreme posterization (very few colors)
	 * - `4` = strong posterization (default)
	 * - `8+` = subtle posterization
	 *
	 * @default 4.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/PosterizeOptions#levels | PosterizeOptions.levels API reference}
	 */
	levels: number;
}

// ============================================================================
// CHROMATIC ABERRATION
// ============================================================================

/**
 * Configuration options for the `'chromaticAberration'` filter.
 *
 * RGB color channel separation effect that simulates lens distortion
 * found in cheap cameras or creates stylized glitch aesthetics.
 *
 * @example
 * {@includeCode ../examples/Distortion/chromaticAberration/sketch.js}
 *
 * @category Distortion filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/ChromaticAberrationOptions | ChromaticAberrationOptions API reference}
 */
export interface ChromaticAberrationOptions {
	/**
	 * Offset amount in pixels.
	 *
	 * Controls how far the red and blue channels are separated from green.
	 *
	 * @default 5.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/ChromaticAberrationOptions#amount | ChromaticAberrationOptions.amount API reference}
	 */
	amount: number;

	/**
	 * Direction of the color separation as `[x, y]`.
	 *
	 * - `[1, 0]` = horizontal separation
	 * - `[0, 1]` = vertical separation
	 * - `[1, 1]` = diagonal separation
	 *
	 * The vector is normalized internally, so `[2, 0]` is the same as `[1, 0]`.
	 *
	 * @default [1.0, 0.0]
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/ChromaticAberrationOptions#direction | ChromaticAberrationOptions.direction API reference}
	 */
	direction: [number, number];
}

// ============================================================================
// PIXELATE
// ============================================================================

/**
 * Configuration options for the `'pixelate'` filter.
 *
 * Reduces image resolution to create a mosaic/pixelated effect
 * reminiscent of retro video games or censored content.
 *
 * @example
 * {@includeCode ../examples/Distortion/pixelate/sketch.js}
 *
 * @category Distortion filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/PixelateOptions | PixelateOptions API reference}
 */
export interface PixelateOptions {
	/**
	 * Size of each pixel block in pixels.
	 *
	 * Larger values create bigger, more visible pixels.
	 *
	 * Minimum value: `1.0`
	 *
	 * @default 4.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/PixelateOptions#pixelsize | PixelateOptions.pixelSize API reference}
	 */
	pixelSize: number;
}

// ============================================================================
// GRID DISTORTION
// ============================================================================

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
 * {@includeCode ../examples/Distortion/gridDistortion/sketch.js}
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
	gridCellDimensions: [number, number];

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
	gridPixelDimensions: [number, number];

	/**
	 * Grid offset in pixels as `[offsetX, offsetY]`.
	 *
	 * Use `[t.grid.offsetX, t.grid.offsetY]` to match your grid position.
	 *
	 * @default [0.0, 0.0]
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/GridDistortionOptions#gridoffsetdimensions | GridDistortionOptions.gridOffsetDimensions API reference}
	 */
	gridOffsetDimensions: [number, number];

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
	widthFactors: number[];

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
	heightFactors: number[];

	/**
	 * Intensity multiplier for width distortion.
	 *
	 * Higher values create more dramatic width variations.
	 *
	 * @default 0.5
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/GridDistortionOptions#widthvariationscale | GridDistortionOptions.widthVariationScale API reference}
	 */
	widthVariationScale: number;

	/**
	 * Intensity multiplier for height distortion.
	 *
	 * Higher values create more dramatic height variations.
	 *
	 * @default 0.5
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/GridDistortionOptions#heightvariationscale | GridDistortionOptions.heightVariationScale API reference}
	 */
	heightVariationScale: number;
}

// ============================================================================
// GLITCH
// ============================================================================

/**
 * Configuration options for the `'glitch'` filter.
 *
 * Digital glitch effect with RGB channel separation, scanlines, and noise.
 * Creates a corrupted/broken digital signal aesthetic.
 *
 * @example
 * {@includeCode ../examples/Stylization/glitch/sketch.js}
 *
 * @category Stylization filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/GlitchOptions | GlitchOptions API reference}
 */
export interface GlitchOptions {
	/**
	 * Glitch intensity.
	 *
	 * - `0.0` = no glitch effect
	 * - `0.5` = subtle glitching
	 * - `1.0+` = intense, chaotic glitching
	 *
	 * @default 0.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/GlitchOptions#amount | GlitchOptions.amount API reference}
	 */
	amount: number;
}

// ============================================================================
// CRT MATTIAS
// ============================================================================

/**
 * Configuration options for the `'crtMattias'` filter.
 *
 * CRT monitor emulation effect with screen curvature, animated scanlines,
 * blur, vignette, and film grain noise. Based on Mattias Gustavsson's
 * classic CRT shader.
 *
 * @example
 * {@includeCode ../examples/Stylization/crtMattias/sketch.js}
 *
 * @see {@link https://github.com/libretro/glsl-shaders/blob/master/crt/shaders/crt-mattias.glsl | Original shader by Mattias Gustavsson}
 *
 * @category Stylization filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/CrtMattiasOptions | CrtMattiasOptions API reference}
 */
export interface CrtMattiasOptions {
	/**
	 * Amount of screen curvature/barrel distortion.
	 *
	 * - `0.0` = flat screen
	 * - `0.5` = moderate curvature (default)
	 * - `1.0` = maximum curvature
	 *
	 * @default 0.5
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/CrtMattiasOptions#curvature | CrtMattiasOptions.curvature API reference}
	 */
	curvature: number;

	/**
	 * Speed of the scrolling scanline effect.
	 *
	 * Higher values make the scanline crawl faster.
	 *
	 * @default 1.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/CrtMattiasOptions#scanspeed | CrtMattiasOptions.scanSpeed API reference}
	 */
	scanSpeed: number;

	/**
	 * Animation time parameter.
	 *
	 * Increment this value each frame to animate the effect.
	 * Typically use elapsed time in seconds or frame count.
	 *
	 * @default 0.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/CrtMattiasOptions#time | CrtMattiasOptions.time API reference}
	 */
	time: number;
}

// ============================================================================
// SCANLINES
// ============================================================================

/**
 * Configuration options for the `'scanlines'` filter.
 *
 * A standalone scanline effect that adds horizontal lines to the image
 * to simulate a CRT display or old monitor. More customizable than
 * the scanlines in crtMattias.
 *
 * @example
 * {@includeCode ../examples/Stylization/scanlines/sketch.js}
 *
 * @category Stylization filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/ScanlinesOptions | ScanlinesOptions API reference}
 */
export interface ScanlinesOptions {
	/**
	 * Number of scanlines across the image height.
	 *
	 * Higher values create finer, more dense lines.
	 *
	 * Minimum value: `10.0`
	 *
	 * @default 300.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/ScanlinesOptions#count | ScanlinesOptions.count API reference}
	 */
	count: number;

	/**
	 * Width of the lines relative to the spacing.
	 *
	 * - `0.0` = very thin lines (mostly transparent)
	 * - `0.5` = equal line and gap width
	 * - `1.0` = solid (no gaps)
	 *
	 * @default 0.5
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/ScanlinesOptions#linewidth | ScanlinesOptions.lineWidth API reference}
	 */
	lineWidth: number;

	/**
	 * Opacity/darkness of the scanlines.
	 *
	 * - `0.0` = invisible lines
	 * - `0.75` = clearly visible (default)
	 * - `1.0` = maximum darkness (solid black lines)
	 *
	 * @default 0.75
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/ScanlinesOptions#intensity | ScanlinesOptions.intensity API reference}
	 */
	intensity: number;

	/**
	 * Scrolling speed of the lines.
	 *
	 * - `0.0` = static lines
	 * - `1.0` = normal scrolling speed
	 * - Higher values = faster scrolling
	 *
	 * @default 1.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/ScanlinesOptions#speed | ScanlinesOptions.speed API reference}
	 */
	speed: number;

	/**
	 * Animation time parameter.
	 *
	 * Increment this value each frame to animate the scrolling effect.
	 *
	 * @default 0.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/ScanlinesOptions#time | ScanlinesOptions.time API reference}
	 */
	time: number;
}

// ============================================================================
// VIGNETTE
// ============================================================================

/**
 * Configuration options for the `'vignette'` filter.
 *
 * Darkens the edges and corners of the image, drawing focus to the center.
 * Useful for creating a cinematic look or highlighting central content.
 *
 * @example
 * {@includeCode ../examples/Stylization/vignette/sketch.js}
 *
 * @category Stylization filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/VignetteOptions | VignetteOptions API reference}
 */
export interface VignetteOptions {
	/**
	 * Intensity of the darkening effect.
	 *
	 * - `0.0` = no vignette
	 * - `0.5` = moderate vignette (default)
	 * - `1.0` = very dark edges
	 *
	 * @default 0.5
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/VignetteOptions#amount | VignetteOptions.amount API reference}
	 */
	amount: number;

	/**
	 * Falloff gradient softness.
	 *
	 * - `0.0` = hard edge (sharp transition)
	 * - `0.5` = moderate gradient (default)
	 * - `1.0` = very soft, gradual falloff
	 *
	 * @default 0.5
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/VignetteOptions#softness | VignetteOptions.softness API reference}
	 */
	softness: number;

	/**
	 * Shape of the vignette.
	 *
	 * - `0.0` = rectangular (follows screen edges)
	 * - `0.5` = rounded rectangle (default)
	 * - `1.0` = circular/elliptical
	 *
	 * @default 0.5
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/VignetteOptions#roundness | VignetteOptions.roundness API reference}
	 */
	roundness: number;
}

// ============================================================================
// BLOOM
// ============================================================================

/**
 * Configuration options for the `'bloom'` filter.
 *
 * Creates a glow effect around bright areas of the image. Pixels above
 * the brightness threshold emit a soft glow that spreads outward.
 * Perfect for creating neon, glowing text, or dreamy effects.
 *
 * @example
 * {@includeCode ../examples/Stylization/bloom/sketch.js}
 *
 * @category Stylization filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BloomOptions | BloomOptions API reference}
 */
export interface BloomOptions {
	/**
	 * Brightness level above which pixels will glow.
	 *
	 * - `0.0` = everything glows
	 * - `0.5` = mid-brightness and above glows (default)
	 * - `1.0` = only the brightest pixels glow
	 *
	 * @default 0.5
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BloomOptions#threshold | BloomOptions.threshold API reference}
	 */
	threshold: number;

	/**
	 * Strength of the glow effect.
	 *
	 * - `0.0` = no visible glow
	 * - `1.0` = normal glow intensity (default)
	 * - `2.0+` = very bright, intense glow
	 *
	 * @default 1.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BloomOptions#intensity | BloomOptions.intensity API reference}
	 */
	intensity: number;

	/**
	 * Size of the glow spread in pixels.
	 *
	 * Larger values create a wider, softer glow.
	 *
	 * - `1.0` = tight glow
	 * - `4.0` = moderate spread (default)
	 * - `10.0+` = wide, diffuse glow
	 *
	 * @default 4.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BloomOptions#radius | BloomOptions.radius API reference}
	 */
	radius: number;
}

// ============================================================================
// FILM GRAIN
// ============================================================================

/**
 * Configuration options for the `'filmGrain'` filter.
 *
 * Adds an animated film grain/noise texture overlay to simulate vintage
 * film stock or analog video. The multi-layered noise creates an organic,
 * moving grain pattern that's less visible in darker areas, mimicking
 * real film characteristics.
 *
 * @example
 * {@includeCode ../examples/Stylization/filmGrain/sketch.js}
 *
 * @category Stylization filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/FilmGrainOptions | FilmGrainOptions API reference}
 */
export interface FilmGrainOptions {
	/**
	 * Strength of the grain effect.
	 *
	 * - `0.0` = no grain
	 * - `0.2` = subtle grain (default)
	 * - `0.5+` = heavy, noticeable grain
	 *
	 * @default 0.2
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/FilmGrainOptions#intensity | FilmGrainOptions.intensity API reference}
	 */
	intensity: number;

	/**
	 * Size of grain particles.
	 *
	 * - `1.0` = fine grain
	 * - `2.0` = medium grain (default)
	 * - `5.0+` = coarse, chunky grain
	 *
	 * @default 2.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/FilmGrainOptions#size | FilmGrainOptions.size API reference}
	 */
	size: number;

	/**
	 * Animation speed of the grain.
	 *
	 * - `0.0` = static grain (not recommended)
	 * - `1.0` = normal animation speed (default)
	 * - `2.0+` = fast, flickering grain
	 *
	 * @default 1.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/FilmGrainOptions#speed | FilmGrainOptions.speed API reference}
	 */
	speed: number;

	/**
	 * Animation time parameter.
	 *
	 * Increment this value each frame to animate the grain effect.
	 *
	 * @default 0.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/FilmGrainOptions#time | FilmGrainOptions.time API reference}
	 */
	time: number;
}
