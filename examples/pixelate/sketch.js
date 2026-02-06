import { textmode } from 'textmode.js';
import { FiltersPlugin } from 'textmode.filters.js';

const t = textmode.create({
	canvas: document.getElementById('textmode-canvas'),
	fontSize: 8,
	plugins: [FiltersPlugin],
});

let video;
let pixelSize = 4.0;

const pixelSizeSlider = document.getElementById('pixelSize');
const pixelSizeValue = document.getElementById('pixelSize-value');

pixelSizeSlider.addEventListener('input', (e) => {
	pixelSize = parseFloat(e.target.value);
	pixelSizeValue.textContent = pixelSize.toFixed(0);
});

t.setup(async () => {
	video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
	video.play();
	video.loop();
	video.characters(" .:-=+*#%@");
});

t.draw(() => {
	t.layers.base.filter('pixelate', pixelSize);

	t.background(0);
	t.image(video);
});
