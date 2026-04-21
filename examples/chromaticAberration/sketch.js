/**
 * @title FiltersPlugin.chromaticAberration
 * @author codex
 */

const t = textmode.create({
	canvas: document.getElementById('textmode-canvas'),
	fontSize: 8,
	plugins: [FiltersPlugin],
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
	video = await t.loadVideo('https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4');
	video.play();
	video.loop();
	video.characters(' .:-=+*#%@');
});

t.draw(() => {
	t.layers.base.filter('chromaticAberration', aberrationAmount);

	t.background(0);
	t.image(video);
});
