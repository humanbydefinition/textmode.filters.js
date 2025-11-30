import { textmode } from 'textmode.js';
import { createFiltersPlugin } from 'textmode.filters.js';

const t = textmode.create({
	canvas: document.getElementById('textmode-canvas'),
	fontSize: 8,
	plugins: [createFiltersPlugin()],
});

let video;
let contrastAmount = 1.0;

const contrastSlider = document.getElementById('contrast');
const contrastValue = document.getElementById('contrast-value');

contrastSlider.addEventListener('input', (e) => {
	contrastAmount = parseFloat(e.target.value);
	contrastValue.textContent = contrastAmount.toFixed(1);
});

t.setup(async () => {
	video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
	video.play();
	video.loop();
	video.characters(" .:-=+*#%@");
});

t.draw(() => {
	t.layers.base.filter('contrast', contrastAmount);

	t.background(0);
	t.image(video);
});
