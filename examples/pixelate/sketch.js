/**
 * @title FiltersPlugin.pixelate
 * @author codex
 */

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
	video = await t.loadVideo('https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4');
	video.play();
	video.loop();
	video.characters(' .:-=+*#%@');
});

t.draw(() => {
	t.layers.base.filter('pixelate', pixelSize);

	t.background(0);
	t.image(video);
});
