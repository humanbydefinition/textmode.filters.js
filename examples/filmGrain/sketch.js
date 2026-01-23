import { textmode } from 'textmode.js';
import { createFiltersPlugin } from 'textmode.filters.js';

const t = textmode.create({
	canvas: document.getElementById('textmode-canvas'),
	fontSize: 8,
	plugins: [createFiltersPlugin()],
});

let video;
let grainIntensity = 0.2;
let grainSize = 2.0;
let grainSpeed = 1.0;
let time = 0;

const intensitySlider = document.getElementById('intensity');
const intensityValue = document.getElementById('intensity-value');
const sizeSlider = document.getElementById('size');
const sizeValue = document.getElementById('size-value');
const speedSlider = document.getElementById('speed');
const speedValue = document.getElementById('speed-value');

intensitySlider.addEventListener('input', (e) => {
	grainIntensity = parseFloat(e.target.value);
	intensityValue.textContent = grainIntensity.toFixed(2);
});

sizeSlider.addEventListener('input', (e) => {
	grainSize = parseFloat(e.target.value);
	sizeValue.textContent = grainSize.toFixed(1);
});

speedSlider.addEventListener('input', (e) => {
	grainSpeed = parseFloat(e.target.value);
	speedValue.textContent = grainSpeed.toFixed(1);
});

t.setup(async () => {
	video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
	video.play();
	video.loop();
	video.characters(" .:-=+*#%@");
});

t.draw(() => {
	t.layers.base.filter('filmGrain', {
		intensity: grainIntensity,
		size: grainSize,
		speed: grainSpeed,
		time: time
	});

	t.background(0);
	t.image(video);
	
	time += 0.016; // Approximate frame time
});
