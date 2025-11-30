import { textmode } from 'textmode.js';
import { createFiltersPlugin } from 'textmode.filters.js';

const t = textmode.create({
	canvas: document.getElementById('textmode-canvas'),
	fontSize: 8,
	plugins: [createFiltersPlugin()],
});

let video;
let brightnessAmount = 1.0;

const brightnessSlider = document.getElementById('brightness');
const brightnessValue = document.getElementById('brightness-value');

brightnessSlider.addEventListener('input', (e) => {
	brightnessAmount = parseFloat(e.target.value);
	brightnessValue.textContent = brightnessAmount.toFixed(1);
});

t.setup(async () => {
	video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
	video.play();
	video.loop();
	video.characters(" .:-=+*#%@");
});

t.draw(() => {
	t.layers.base.filter('brightness', brightnessAmount);

	t.background(0);
	t.image(video);
});
