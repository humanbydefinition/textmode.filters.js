/**
 * @title FiltersPlugin.vignette
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
	const left = -Math.floor(t.grid.cols / 2),
		top = -Math.floor(t.grid.rows / 2);
	let y = top + 3,
		x = left + 3;

	const amt = (0.6 + 0.3 * Math.sin(t.secs * 1.5)).toFixed(2);
	const soft = (0.5 + 0.2 * Math.cos(t.secs * 1.0)).toFixed(2);

	drawText('FILTERSPLUGIN.VIGNETTE', x, y++, 100, 255, 140);
	drawText('------------------------------------', x, y++, 80, 100, 150);
	drawText('CONCEPT: EDGE SHADOWING', x, y++, 100, 220, 255);
	drawText('Applies shading to frame perimeter.', x, y++, 140, 160, 190);
	drawText('------------------------------------', x, y++, 80, 100, 150);
	drawText('Amount: ' + amt, x, y++, 140, 255, 180);
	drawText('Softness: ' + soft, x, y++, 140, 255, 180);
});

t.draw(() => {
	if (!video) return;
	const amt = 0.6 + 0.3 * Math.sin(t.secs * 1.5);
	const soft = 0.5 + 0.2 * Math.cos(t.secs * 1.0);

	t.layers.base.filter('vignette', {
		amount: amt,
		softness: soft,
		roundness: 0.5,
	});

	t.background(0);
	t.image(video);
});

t.windowResized(() => {
	t.resizeCanvas(window.innerWidth, window.innerHeight);
});
