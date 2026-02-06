/**
 * Type definitions for all filter options in textmode.filters.js.
 *
 * Each filter can be applied using either:
 * - A single value (shorthand for the primary parameter)
 * - An options object with named parameters
 * @example
 * ```javascript
 * const t = textmode.create({
 *   width: window.innerWidth,
 *   height: window.innerHeight,
 *   plugins: [FiltersPlugin],
 * });
 *
 * let video;
 *
 * t.setup(async () => {
 *   video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
 *   video.play();
 *   video.loop();
 *   video.characters(' .:-=+*#%@');
 * });
 *
 * t.draw(() => {
 *   t.background(0);
 *   if (video) {
 *     t.image(video, t.grid.cols, t.grid.rows);
 *   }
 *
 *   const wobble = Math.sin(t.secs * 2);
 *   t.layers.base.filter('bloom', {
 *     threshold: 0.5,
 *     intensity: 1 + wobble * 0.35,
 *     radius: 6 + wobble * 2,
 *   });
 * });
 *
 * t.windowResized(() => {
 *   t.resizeCanvas(window.innerWidth, window.innerHeight);
 * });
 * ```
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
 * @example
 * ```javascript
 * const t = textmode.create({
 *   width: window.innerWidth,
 *   height: window.innerHeight,
 *   plugins: [FiltersPlugin],
 * });
 *
 * let video;
 *
 * t.setup(async () => {
 *   video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
 *   video.play();
 *   video.loop();
 *   video.characters(' .:-=+*#%@');
 * });
 *
 * t.draw(() => {
 *   t.background(0);
 *   if (video) {
 *     t.image(video, t.grid.cols, t.grid.rows);
 *   }
 *
 *   const wobble = Math.sin(t.secs * 2);
 *   t.layers.base.filter('brightness', {
 *     amount: 1 + wobble * 0.25,
 *   });
 * });
 *
 * t.windowResized(() => {
 *   t.resizeCanvas(window.innerWidth, window.innerHeight);
 * });
 * ```
 *
 * @category Color adjustment filters
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
 * @example
 * ```javascript
 * const t = textmode.create({
 *   width: window.innerWidth,
 *   height: window.innerHeight,
 *   plugins: [FiltersPlugin],
 * });
 *
 * let video;
 *
 * t.setup(async () => {
 *   video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
 *   video.play();
 *   video.loop();
 *   video.characters(' .:-=+*#%@');
 * });
 *
 * t.draw(() => {
 *   t.background(0);
 *   if (video) {
 *     t.image(video, t.grid.cols, t.grid.rows);
 *   }
 *
 *   const wobble = Math.sin(t.secs * 2);
 *   t.layers.base.filter('contrast', {
 *     amount: 1 + wobble * 0.35,
 *   });
 * });
 *
 * t.windowResized(() => {
 *   t.resizeCanvas(window.innerWidth, window.innerHeight);
 * });
 * ```
 *
 * @category Color adjustment filters
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
 * @example
 * ```javascript
 * const t = textmode.create({
 *   width: window.innerWidth,
 *   height: window.innerHeight,
 *   plugins: [FiltersPlugin],
 * });
 *
 * let video;
 *
 * t.setup(async () => {
 *   video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
 *   video.play();
 *   video.loop();
 *   video.characters(' .:-=+*#%@');
 * });
 *
 * t.draw(() => {
 *   t.background(0);
 *   if (video) {
 *     t.image(video, t.grid.cols, t.grid.rows);
 *   }
 *
 *   const wobble = Math.sin(t.secs * 2);
 *   t.layers.base.filter('saturation', {
 *     amount: 1 + wobble * 0.45,
 *   });
 * });
 *
 * t.windowResized(() => {
 *   t.resizeCanvas(window.innerWidth, window.innerHeight);
 * });
 * ```
 *
 * @category Color adjustment filters
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
 * @example
 * ```javascript
 * const t = textmode.create({
 *   width: window.innerWidth,
 *   height: window.innerHeight,
 *   plugins: [FiltersPlugin],
 * });
 *
 * let video;
 *
 * t.setup(async () => {
 *   video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
 *   video.play();
 *   video.loop();
 *   video.characters(' .:-=+*#%@');
 * });
 *
 * t.draw(() => {
 *   t.background(0);
 *   if (video) {
 *     t.image(video, t.grid.cols, t.grid.rows);
 *   }
 *
 *   const wobble = Math.sin(t.secs * 2);
 *   const hue = (t.frameCount * 2 + wobble * 45) % 360;
 *   t.layers.base.filter('hueRotate', {
 *     angle: hue,
 *   });
 * });
 *
 * t.windowResized(() => {
 *   t.resizeCanvas(window.innerWidth, window.innerHeight);
 * });
 * ```
 *
 * @category Color adjustment filters
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
 * @example
 * ```javascript
 * const t = textmode.create({
 *   width: window.innerWidth,
 *   height: window.innerHeight,
 *   plugins: [FiltersPlugin],
 * });
 *
 * let video;
 *
 * t.setup(async () => {
 *   video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
 *   video.play();
 *   video.loop();
 *   video.characters(' .:-=+*#%@');
 * });
 *
 * t.draw(() => {
 *   t.background(0);
 *   if (video) {
 *     t.image(video, t.grid.cols, t.grid.rows);
 *   }
 *
 *   const wobble = Math.sin(t.secs * 2);
 *   t.layers.base.filter('posterize', {
 *     levels: Math.max(2, Math.round(5 + wobble * 3)),
 *   });
 * });
 *
 * t.windowResized(() => {
 *   t.resizeCanvas(window.innerWidth, window.innerHeight);
 * });
 * ```
 *
 * @category Color adjustment filters
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
 * @example
 * ```javascript
 * const t = textmode.create({
 *   width: window.innerWidth,
 *   height: window.innerHeight,
 *   plugins: [FiltersPlugin],
 * });
 *
 * let video;
 *
 * t.setup(async () => {
 *   video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
 *   video.play();
 *   video.loop();
 *   video.characters(' .:-=+*#%@');
 * });
 *
 * t.draw(() => {
 *   t.background(0);
 *   if (video) {
 *     t.image(video, t.grid.cols, t.grid.rows);
 *   }
 *
 *   const wobble = Math.sin(t.secs * 2);
 *   t.layers.base.filter('chromaticAberration', {
 *     amount: 6 + wobble * 4,
 *     direction: [Math.sin(t.secs), Math.cos(t.secs)],
 *   });
 * });
 *
 * t.windowResized(() => {
 *   t.resizeCanvas(window.innerWidth, window.innerHeight);
 * });
 * ```
 *
 * @category Distortion filters
 */
export interface ChromaticAberrationOptions {
	/**
	 * Offset amount in pixels.
	 *
	 * Controls how far the red and blue channels are separated from green.
	 *
	 * @default 5.0
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
 * @example
 * ```javascript
 * const t = textmode.create({
 *   width: window.innerWidth,
 *   height: window.innerHeight,
 *   plugins: [FiltersPlugin],
 * });
 *
 * let video;
 *
 * t.setup(async () => {
 *   video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
 *   video.play();
 *   video.loop();
 *   video.characters(' .:-=+*#%@');
 * });
 *
 * t.draw(() => {
 *   t.background(0);
 *   if (video) {
 *     t.image(video, t.grid.cols, t.grid.rows);
 *   }
 *
 *   const wobble = Math.sin(t.secs * 2);
 *   t.layers.base.filter('pixelate', {
 *     pixelSize: 6 + wobble * 3,
 *   });
 * });
 *
 * t.windowResized(() => {
 *   t.resizeCanvas(window.innerWidth, window.innerHeight);
 * });
 * ```
 *
 * @category Distortion filters
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
 * @example
 * ```javascript
 * const t = textmode.create({
 *   width: window.innerWidth,
 *   height: window.innerHeight,
 *   plugins: [FiltersPlugin],
 * });
 *
 * let video;
 *
 * t.setup(async () => {
 *   video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
 *   video.play();
 *   video.loop();
 *   video.characters(' .:-=+*#%@');
 * });
 *
 * t.draw(() => {
 *   t.background(0);
 *   if (video) {
 *     t.image(video, t.grid.cols, t.grid.rows);
 *   }
 *
 *   const wobble = Math.sin(t.secs * 2);
 *   const widthFactors = Array.from({ length: t.grid.cols }, (_, i) => (Math.sin(i * 0.18 + t.frameCount * 0.04) + 1) * 0.5);
 *   const heightFactors = Array.from({ length: t.grid.rows }, (_, i) => (Math.sin(i * 0.24 + t.secs * 1.5) + 1) * 0.5);
 *   t.layers.base.filter('gridDistortion', {
 *     gridCellDimensions: [t.grid.cols, t.grid.rows],
 *     gridPixelDimensions: [t.grid.width, t.grid.height],
 *     gridOffsetDimensions: [t.grid.offsetX, t.grid.offsetY],
 *     widthFactors,
 *     heightFactors,
 *     widthVariationScale: 0.35 + wobble * 0.15,
 *     heightVariationScale: 0.35 + wobble * 0.15,
 *   });
 * });
 *
 * t.windowResized(() => {
 *   t.resizeCanvas(window.innerWidth, window.innerHeight);
 * });
 * ```
 *
 * @category Distortion filters
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
	 */
	gridCellDimensions: [number, number];

	/**
	 * Grid size in pixels as `[width, height]`.
	 *
	 * Typically calculated as:
	 * `[t.grid.cols * t.grid.cellWidth, t.grid.rows * t.grid.cellHeight]`
	 *
	 * @default [640.0, 320.0]
	 */
	gridPixelDimensions: [number, number];

	/**
	 * Grid offset in pixels as `[offsetX, offsetY]`.
	 *
	 * Use `[t.grid.offsetX, t.grid.offsetY]` to match your grid position.
	 *
	 * @default [0.0, 0.0]
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
	 */
	heightFactors: number[];

	/**
	 * Intensity multiplier for width distortion.
	 *
	 * Higher values create more dramatic width variations.
	 *
	 * @default 0.5
	 */
	widthVariationScale: number;

	/**
	 * Intensity multiplier for height distortion.
	 *
	 * Higher values create more dramatic height variations.
	 *
	 * @default 0.5
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
 * @example
 * ```javascript
 * const t = textmode.create({
 *   width: window.innerWidth,
 *   height: window.innerHeight,
 *   plugins: [FiltersPlugin],
 * });
 *
 * let video;
 *
 * t.setup(async () => {
 *   video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
 *   video.play();
 *   video.loop();
 *   video.characters(' .:-=+*#%@');
 * });
 *
 * t.draw(() => {
 *   t.background(0);
 *   if (video) {
 *     t.image(video, t.grid.cols, t.grid.rows);
 *   }
 *
 *   const wobble = Math.sin(t.secs * 2);
 *   t.layers.base.filter('glitch', {
 *     amount: Math.max(0, 0.2 + wobble * 0.8),
 *   });
 * });
 *
 * t.windowResized(() => {
 *   t.resizeCanvas(window.innerWidth, window.innerHeight);
 * });
 * ```
 *
 * @category Stylization filters
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
 * @example
 * ```javascript
 * const t = textmode.create({
 *   width: window.innerWidth,
 *   height: window.innerHeight,
 *   plugins: [FiltersPlugin],
 * });
 *
 * let video;
 *
 * t.setup(async () => {
 *   video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
 *   video.play();
 *   video.loop();
 *   video.characters(' .:-=+*#%@');
 * });
 *
 * t.draw(() => {
 *   t.background(0);
 *   if (video) {
 *     t.image(video, t.grid.cols, t.grid.rows);
 *   }
 *
 *   const wobble = Math.sin(t.secs * 2);
 *   t.layers.base.filter('crtMattias', {
 *     curvature: 0.45 + wobble * 0.1,
 *     scanSpeed: 1 + wobble * 0.25,
 *     time: t.secs,
 *   });
 * });
 *
 * t.windowResized(() => {
 *   t.resizeCanvas(window.innerWidth, window.innerHeight);
 * });
 * ```
 *
 * @see {@link https://github.com/libretro/glsl-shaders/blob/master/crt/shaders/crt-mattias.glsl | Original shader by Mattias Gustavsson}
 *
 * @category Stylization filters
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
	 */
	curvature: number;

	/**
	 * Speed of the scrolling scanline effect.
	 *
	 * Higher values make the scanline crawl faster.
	 *
	 * @default 1.0
	 */
	scanSpeed: number;

	/**
	 * Animation time parameter.
	 *
	 * Increment this value each frame to animate the effect.
	 * Typically use elapsed time in seconds or frame count.
	 *
	 * @default 0.0
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
 * @example
 * ```javascript
 * const t = textmode.create({
 *   width: window.innerWidth,
 *   height: window.innerHeight,
 *   plugins: [FiltersPlugin],
 * });
 *
 * let video;
 *
 * t.setup(async () => {
 *   video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
 *   video.play();
 *   video.loop();
 *   video.characters(' .:-=+*#%@');
 * });
 *
 * t.draw(() => {
 *   t.background(0);
 *   if (video) {
 *     t.image(video, t.grid.cols, t.grid.rows);
 *   }
 *
 *   const wobble = Math.sin(t.secs * 2);
 *   t.layers.base.filter('scanlines', {
 *     count: 256,
 *     lineWidth: 0.5,
 *     intensity: 0.7 + wobble * 0.1,
 *     speed: 1 + wobble * 0.15,
 *     time: t.secs,
 *   });
 * });
 *
 * t.windowResized(() => {
 *   t.resizeCanvas(window.innerWidth, window.innerHeight);
 * });
 * ```
 *
 * @category Stylization filters
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
	 */
	speed: number;

	/**
	 * Animation time parameter.
	 *
	 * Increment this value each frame to animate the scrolling effect.
	 *
	 * @default 0.0
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
 * @example
 * ```javascript
 * const t = textmode.create({
 *   width: window.innerWidth,
 *   height: window.innerHeight,
 *   plugins: [FiltersPlugin],
 * });
 *
 * let video;
 *
 * t.setup(async () => {
 *   video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
 *   video.play();
 *   video.loop();
 *   video.characters(' .:-=+*#%@');
 * });
 *
 * t.draw(() => {
 *   t.background(0);
 *   if (video) {
 *     t.image(video, t.grid.cols, t.grid.rows);
 *   }
 *
 *   const wobble = Math.sin(t.secs * 2);
 *   t.layers.base.filter('vignette', {
 *     amount: 0.5 + wobble * 0.2,
 *     softness: 0.5,
 *     roundness: 0.5 + wobble * 0.15,
 *   });
 * });
 *
 * t.windowResized(() => {
 *   t.resizeCanvas(window.innerWidth, window.innerHeight);
 * });
 * ```
 *
 * @category Stylization filters
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
 * @example
 * ```javascript
 * const t = textmode.create({
 *   width: window.innerWidth,
 *   height: window.innerHeight,
 *   plugins: [FiltersPlugin],
 * });
 *
 * let video;
 *
 * t.setup(async () => {
 *   video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
 *   video.play();
 *   video.loop();
 *   video.characters(' .:-=+*#%@');
 * });
 *
 * t.draw(() => {
 *   t.background(0);
 *   if (video) {
 *     t.image(video, t.grid.cols, t.grid.rows);
 *   }
 *
 *   const wobble = Math.sin(t.secs * 2);
 *   t.layers.base.filter('bloom', {
 *     threshold: 0.5,
 *     intensity: 1.2 + wobble * 0.5,
 *     radius: 6 + wobble * 2,
 *   });
 * });
 *
 * t.windowResized(() => {
 *   t.resizeCanvas(window.innerWidth, window.innerHeight);
 * });
 * ```
 *
 * @category Stylization filters
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
 * @example
 * ```javascript
 * const t = textmode.create({
 *   width: window.innerWidth,
 *   height: window.innerHeight,
 *   plugins: [FiltersPlugin],
 * });
 *
 * let video;
 *
 * t.setup(async () => {
 *   video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
 *   video.play();
 *   video.loop();
 *   video.characters(' .:-=+*#%@');
 * });
 *
 * t.draw(() => {
 *   t.background(0);
 *   if (video) {
 *     t.image(video, t.grid.cols, t.grid.rows);
 *   }
 *
 *   const wobble = Math.sin(t.secs * 2);
 *   t.layers.base.filter('filmGrain', {
 *     intensity: 0.2 + wobble * 0.1,
 *     size: 2 + wobble * 0.5,
 *     speed: 1 + wobble * 0.2,
 *     time: t.secs,
 *   });
 * });
 *
 * t.windowResized(() => {
 *   t.resizeCanvas(window.innerWidth, window.innerHeight);
 * });
 * ```
 *
 * @category Stylization filters
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
	 */
	speed: number;

	/**
	 * Animation time parameter.
	 *
	 * Increment this value each frame to animate the grain effect.
	 *
	 * @default 0.0
	 */
	time: number;
}
