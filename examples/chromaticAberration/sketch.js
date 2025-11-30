import { textmode } from 'textmode.js';
import { createFiltersPlugin } from 'textmode.filters.js';

const t = textmode.create({
	canvas: document.getElementById('textmode-canvas'),
	fontSize: 8,
	plugins: [createFiltersPlugin()],
});

let video;
let aberrationAmount = 5.0;

const amountSlider = document.getElementById('amount');
const amountValue = document.getElementById('amount-value');

amountSlider.addEventListener('input', (e) => {
	aberrationAmount = parseFloat(e.target.value);
	amountValue.textContent = aberrationAmount.toFixed(0);
});

t.setup(async () => {
	video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
	video.play();
	video.loop();
	video.characters(" .:-=+*#%@");
});

t.draw(() => {
	t.layers.base.filter('chromaticAberration', aberrationAmount);

	t.background(0);
	t.image(video);
});
