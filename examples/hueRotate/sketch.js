import { textmode } from 'textmode.js';
import { FiltersPlugin } from 'textmode.filters.js';

const t = textmode.create({
	canvas: document.getElementById('textmode-canvas'),
	fontSize: 8,
	plugins: [FiltersPlugin],
});

let video;
let hueAngle = 0.0;

const hueSlider = document.getElementById('hue');
const hueValue = document.getElementById('hue-value');

hueSlider.addEventListener('input', (e) => {
	hueAngle = parseFloat(e.target.value);
	hueValue.textContent = hueAngle.toFixed(0) + '°';
});

t.setup(async () => {
	video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
	video.play();
	video.loop();
	video.characters(" .:-=+*#%@");
});

t.draw(() => {
	t.layers.base.filter('hueRotate', hueAngle);

	t.background(0);
	t.image(video);
});
