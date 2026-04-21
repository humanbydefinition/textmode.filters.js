/**
 * @title FiltersPlugin.glitch
 * @author codex
 */

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
	video = await t.loadVideo('https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4');
	video.play();
	video.loop();
	video.characters(' .:-=+*#%@');
});

t.draw(() => {
	t.layers.base.filter('glitch', glitchAmount);

	t.background(0);
	t.image(video);
});
