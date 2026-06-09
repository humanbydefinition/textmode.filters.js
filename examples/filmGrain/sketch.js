/**
 * @title FiltersPlugin.filmGrain
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

	const intensity = (0.3 + 0.2 * Math.sin(t.secs * 2.0)).toFixed(2);

	drawText('FILTERSPLUGIN.FILMGRAIN', x, y++, 100, 255, 140);
	drawText('------------------------------------', x, y++, 80, 100, 150);
	drawText('CONCEPT: ANALOG NOISE OVERLAY', x, y++, 100, 220, 255);
	drawText('Simulates organic film grain.', x, y++, 140, 160, 190);
	drawText('------------------------------------', x, y++, 80, 100, 150);
	drawText('Intensity: ' + intensity, x, y++, 140, 255, 180);
	drawText('Size: 2.0', x, y++, 140, 255, 180);
});

t.draw(() => {
	if (!video) return;
	const intensity = 0.3 + 0.2 * Math.sin(t.secs * 2.0);

	t.layers.base.filter('filmGrain', {
		intensity: intensity,
		size: 2.0,
		speed: 1.0,
		time: t.secs,
	});

	t.background(0);
	t.image(video);
});

t.windowResized(() => {
	t.resizeCanvas(window.innerWidth, window.innerHeight);
});
