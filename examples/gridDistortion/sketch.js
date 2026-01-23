import { textmode } from 'textmode.js';
import { createFiltersPlugin } from 'textmode.filters.js';

const t = textmode.create({
	canvas: document.getElementById('textmode-canvas'),
	fontSize: 8,
	plugins: [createFiltersPlugin()],
});

let video;
let frameCount = 0;
let animating = true;
let widthVariation = 0.5;
let heightVariation = 0.5;

// Sine wave parameters
const config = {
	widthFrequency: 0.05,
	widthSpeed: 0.05,
	widthAmplitude: 1.0,
	heightFrequency: 0.1,
	heightSpeed: 0.03,
	heightAmplitude: 1.0,
};

const toggleBtn = document.getElementById('toggleAnimation');
const widthVariationSlider = document.getElementById('widthVariation');
const heightVariationSlider = document.getElementById('heightVariation');
const widthVariationValue = document.getElementById('widthVariation-value');
const heightVariationValue = document.getElementById('heightVariation-value');

toggleBtn.addEventListener('click', () => {
	animating = !animating;
	toggleBtn.textContent = animating ? 'Pause Animation' : 'Resume Animation';
});

widthVariationSlider.addEventListener('input', (e) => {
	widthVariation = parseFloat(e.target.value);
	widthVariationValue.textContent = widthVariation.toFixed(1);
});

heightVariationSlider.addEventListener('input', (e) => {
	heightVariation = parseFloat(e.target.value);
	heightVariationValue.textContent = heightVariation.toFixed(1);
});

t.setup(async () => {
	video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
	video.play();
	video.loop();
	video.characters(" .:-=+*#%@");
});

t.draw(() => {
	if (animating) {
		frameCount++;
	}

	const cols = t.grid.cols;
	const rows = t.grid.rows;

	// Generate sine wave pattern for width factors
	const widthFactors = [];
	for (let i = 0; i < cols; i++) {
		const sineValue = Math.sin(i * config.widthFrequency + frameCount * config.widthSpeed) * config.widthAmplitude;
		// Map from [-amplitude, amplitude] to [0, 1]
		widthFactors.push((sineValue + config.widthAmplitude) / (2 * config.widthAmplitude));
	}

	// Generate sine wave pattern for height factors
	const heightFactors = [];
	for (let j = 0; j < rows; j++) {
		const sineValue = Math.sin(j * config.heightFrequency + frameCount * config.heightSpeed) * config.heightAmplitude;
		// Map from [-amplitude, amplitude] to [0, 1]
		heightFactors.push((sineValue + config.heightAmplitude) / (2 * config.heightAmplitude));
	}

	// Apply grid distortion filter
	t.layers.base.filter('gridDistortion', {
		gridCellDimensions: [cols, rows],
		gridPixelDimensions: [t.grid.width, t.grid.height],
		gridOffsetDimensions: [t.grid.offsetX, t.grid.offsetY],
		gridCellPixelDimensions: [t.grid.cellWidth, t.grid.cellHeight],
		widthFactors: widthFactors,
		heightFactors: heightFactors,
		widthVariationScale: widthVariation,
		heightVariationScale: heightVariation
	});

	t.image(video, t.grid.cols, t.grid.rows);
});
