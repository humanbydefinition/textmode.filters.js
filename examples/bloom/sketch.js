import { textmode } from 'textmode.js';
import { FiltersPlugin } from 'textmode.filters.js';

const t = textmode.create({
	canvas: document.getElementById('textmode-canvas'),
	fontSize: 8,
	plugins: [FiltersPlugin],
});

let video;
let bloomThreshold = 0.5;
let bloomIntensity = 1.0;
let bloomRadius = 4.0;

const thresholdSlider = document.getElementById('threshold');
const thresholdValue = document.getElementById('threshold-value');
const intensitySlider = document.getElementById('intensity');
const intensityValue = document.getElementById('intensity-value');
const radiusSlider = document.getElementById('radius');
const radiusValue = document.getElementById('radius-value');

thresholdSlider.addEventListener('input', (e) => {
	bloomThreshold = parseFloat(e.target.value);
	thresholdValue.textContent = bloomThreshold.toFixed(2);
});

intensitySlider.addEventListener('input', (e) => {
	bloomIntensity = parseFloat(e.target.value);
	intensityValue.textContent = bloomIntensity.toFixed(1);
});

radiusSlider.addEventListener('input', (e) => {
	bloomRadius = parseFloat(e.target.value);
	radiusValue.textContent = bloomRadius.toFixed(1);
});

t.setup(async () => {
	video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
	video.play();
	video.loop();
	video.characters(" .:-=+*#%@");
});

t.draw(() => {
	t.layers.base.filter('bloom', {
		threshold: bloomThreshold,
		intensity: bloomIntensity,
		radius: bloomRadius
	});

	t.background(0);
	t.image(video);
});
