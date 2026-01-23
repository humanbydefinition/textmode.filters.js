import { textmode } from 'textmode.js';
import { createFiltersPlugin } from 'textmode.filters.js';

const t = textmode.create({
	canvas: document.getElementById('textmode-canvas'),
	fontSize: 8,
	plugins: [createFiltersPlugin()],
});

let video;
let vignetteAmount = 0.5;
let vignetteSoftness = 0.5;
let vignetteRoundness = 0.5;

const amountSlider = document.getElementById('amount');
const amountValue = document.getElementById('amount-value');
const softnessSlider = document.getElementById('softness');
const softnessValue = document.getElementById('softness-value');
const roundnessSlider = document.getElementById('roundness');
const roundnessValue = document.getElementById('roundness-value');

amountSlider.addEventListener('input', (e) => {
	vignetteAmount = parseFloat(e.target.value);
	amountValue.textContent = vignetteAmount.toFixed(2);
});

softnessSlider.addEventListener('input', (e) => {
	vignetteSoftness = parseFloat(e.target.value);
	softnessValue.textContent = vignetteSoftness.toFixed(2);
});

roundnessSlider.addEventListener('input', (e) => {
	vignetteRoundness = parseFloat(e.target.value);
	roundnessValue.textContent = vignetteRoundness.toFixed(2);
});

t.setup(async () => {
	video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
	video.play();
	video.loop();
	video.characters(" .:-=+*#%@");
});

t.draw(() => {
	t.layers.base.filter('vignette', {
		amount: vignetteAmount,
		softness: vignetteSoftness,
		roundness: vignetteRoundness
	});

	t.background(0);
	t.image(video);
});
