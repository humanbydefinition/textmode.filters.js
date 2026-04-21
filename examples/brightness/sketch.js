import { textmode } from 'textmode.js';
import { FiltersPlugin } from 'textmode.filters.js';

const t = textmode.create({
	canvas: document.getElementById('textmode-canvas'),
	fontSize: 8,
	plugins: [FiltersPlugin],
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
	video = await t.loadVideo('https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4');
	video.play();
	video.loop();
	video.characters(' .:-=+*#%@');
});

t.draw(() => {
	t.layers.base.filter('brightness', brightnessAmount);

	t.background(0);
	t.image(video);
});
