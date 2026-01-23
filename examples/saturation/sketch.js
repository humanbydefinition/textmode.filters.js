import { textmode } from 'textmode.js';
import { createFiltersPlugin } from 'textmode.filters.js';

const t = textmode.create({
	canvas: document.getElementById('textmode-canvas'),
	fontSize: 8,
	plugins: [createFiltersPlugin()],
});

let video;
let saturationAmount = 1.0;

const saturationSlider = document.getElementById('saturation');
const saturationValue = document.getElementById('saturation-value');

saturationSlider.addEventListener('input', (e) => {
	saturationAmount = parseFloat(e.target.value);
	saturationValue.textContent = saturationAmount.toFixed(1);
});

t.setup(async () => {
	video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
	video.play();
	video.loop();
	video.characters(" .:-=+*#%@");
});

t.draw(() => {
	t.layers.base.filter('saturation', saturationAmount);

	t.background(0);
	t.image(video);
});
