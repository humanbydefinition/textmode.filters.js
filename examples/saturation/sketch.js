/**
 * @title FiltersPlugin.saturation
 * @author codex
 */

const t = textmode.create({
	canvas: document.getElementById('textmode-canvas'),
	fontSize: 8,
	plugins: [FiltersPlugin],
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
	video = await t.loadVideo('https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4');
	video.play();
	video.loop();
	video.characters(' .:-=+*#%@');
});

t.draw(() => {
	t.layers.base.filter('saturation', saturationAmount);

	t.background(0);
	t.image(video);
});
