import { textmode } from 'textmode.js';
import { FiltersPlugin } from 'textmode.filters.js';

const t = textmode.create({
	canvas: document.getElementById('textmode-canvas'),
	fontSize: 8,
	plugins: [FiltersPlugin],
});

let video;
let glitchAmount = 0.0;

const glitchSlider = document.getElementById('glitch');
const glitchValue = document.getElementById('glitch-value');

glitchSlider.addEventListener('input', (e) => {
	glitchAmount = parseFloat(e.target.value);
	glitchValue.textContent = glitchAmount.toFixed(1);
});

t.setup(async () => {
	video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
	video.play();
	video.loop();
	video.characters(" .:-=+*#%@");
});

t.draw(() => {
	t.layers.base.filter('glitch', glitchAmount);

	t.background(0);
	t.image(video);
});
