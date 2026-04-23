/**
 * @title FiltersPlugin.posterize
 * @author codex
 */

const t = textmode.create({
	canvas: document.getElementById('textmode-canvas'),
	fontSize: 8,
	plugins: [FiltersPlugin],
});

let video;
let levels = 4.0;

const levelsSlider = document.getElementById('levels');
const levelsValue = document.getElementById('levels-value');

levelsSlider.addEventListener('input', (e) => {
	levels = parseFloat(e.target.value);
	levelsValue.textContent = levels;
});

t.setup(async () => {
	video = await t.loadVideo('https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4');
	video.play();
	video.loop();
	video.characters(' .:-=+*#%@');
});

t.draw(() => {
	t.layers.base.filter('posterize', {
		levels: levels,
	});

	t.background(0);
	t.image(video);
});
