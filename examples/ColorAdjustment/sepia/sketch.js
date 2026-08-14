/**
 * @title FiltersPlugin.sepia
 */

const t = textmode.create({
	width: window.innerWidth,
	height: window.innerHeight,
	fontSize: 8,
	plugins: [FiltersPlugin],
});
const labelLayer = t.layers.add();

let video;

function drawText(text, x, y, r = 220, g = 230, b = 255) {
	t.push();
	t.printAlign('left', 'top');
	t.charColor(r, g, b);
	t.print(text, x, y);
	t.pop();
}

t.setup(async () => {
	video = await t.loadVideo('https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4');
	video.play();
	video.loop();
	video.characters(' .:-=+*#%@');
});

labelLayer.draw(() => {
	t.clear();
	const left = -Math.floor(t.grid.cols / 2);
	const top = -Math.floor(t.grid.rows / 2);
	const amount = (0.6 + 0.35 * Math.sin(t.secs * 0.8)).toFixed(2);

	drawText('FILTERSPLUGIN.SEPIA', left + 3, top + 3, 100, 255, 140);
	drawText('------------------------------------', left + 3, top + 4, 80, 100, 150);
	drawText('CONCEPT: ANALOG WARMTH', left + 3, top + 5, 100, 220, 255);
	drawText('Grades a moving scene in sepia.', left + 3, top + 6, 140, 160, 190);
	drawText('Amount: ' + amount, left + 3, top + 8, 140, 255, 180);
});

t.draw(() => {
	if (!video) return;
	const amount = 0.6 + 0.35 * Math.sin(t.secs * 0.8);
	t.layers.base.filter('sepia', { amount });
	t.background(0);
	t.image(video);
});

t.windowResized(() => {
	t.resizeCanvas(window.innerWidth, window.innerHeight);
});
