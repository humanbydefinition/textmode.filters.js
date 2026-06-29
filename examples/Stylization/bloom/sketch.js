/**
 * @title FiltersPlugin.bloom
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

	const th = (0.4 + 0.3 * Math.sin(t.secs * 1.5)).toFixed(2);
	const val = (1.5 + 1.0 * Math.cos(t.secs * 1.0)).toFixed(2);

	drawText('FILTERSPLUGIN.BLOOM', x, y++, 100, 255, 140);
	drawText('------------------------------------', x, y++, 80, 100, 150);
	drawText('CONCEPT: GLOW HIGHLIGHTS', x, y++, 100, 220, 255);
	drawText('Glows bright regions in the scene.', x, y++, 140, 160, 190);
	drawText('------------------------------------', x, y++, 80, 100, 150);
	drawText('Threshold: ' + th, x, y++, 140, 255, 180);
	drawText('Intensity: ' + val, x, y++, 140, 255, 180);
});

t.draw(() => {
	if (!video) return;
	const th = 0.4 + 0.3 * Math.sin(t.secs * 1.5);
	const val = 1.5 + 1.0 * Math.cos(t.secs * 1.0);

	t.layers.base.filter('bloom', {
		threshold: th,
		intensity: val,
		radius: 4.0,
	});

	t.background(0);
	t.image(video);
});

t.windowResized(() => {
	t.resizeCanvas(window.innerWidth, window.innerHeight);
});
