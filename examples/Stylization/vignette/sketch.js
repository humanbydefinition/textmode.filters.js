/**
 * @title FiltersPlugin.vignette
 */

const t = textmode.create({
	width: window.innerWidth,
	height: window.innerHeight,
	fontSize: window.innerWidth < 700 ? 8 : 16,
	plugins: [FiltersPlugin],
});
const labelLayer = t.layers.add({ fontSize: window.innerWidth < 700 ? 8 : 16 });

let video;

function drawLabel(lines) {
	const { cols, rows } = labelLayer.grid;
	const [left, top] = [-Math.floor(cols / 2), -Math.floor(rows / 2)];
	const width = Math.max(...lines.map(([text]) => [...text].length)) + 2;
	t.push();
	t.translate(left + (width + 4) / 2, top + (lines.length + 5) / 2);
	t.char(' ');
	t.charColor(6, 10, 22);
	t.cellColor(6, 10, 22);
	t.rect(width, lines.length + 2);
	t.pop();
	t.printAlign('left', 'top');
	lines.forEach(([text, color], i) => {
		t.charColor(color[0], color[1], color[2]);
		t.print(text, left + 3, top + 3 + i);
	});
}

t.setup(async () => {
	video = await t.loadVideo('https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4');
	video.play();
	video.loop();
	video.characters(' .:-=+*#%@');
});

labelLayer.draw(() => {
	t.clear();
	const amt = (0.6 + 0.3 * Math.sin(t.secs * 1.5)).toFixed(2);
	const soft = (0.5 + 0.2 * Math.cos(t.secs * 1.0)).toFixed(2);
	drawLabel([
		['FILTERSPLUGIN.VIGNETTE', [120, 240, 180]],
		['------------------------------------', [70, 100, 140]],
		['CONCEPT: EDGE SHADOWING', [140, 210, 255]],
		['Applies shading to frame perimeter.', [140, 160, 190]],
		['------------------------------------', [70, 100, 140]],
		[`AMOUNT: ${amt}`, [140, 255, 200]],
		[`SOFTNESS: ${soft}`, [140, 255, 200]],
	]);
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
	const size = window.innerWidth < 700 ? 8 : 16;
	t.fontSize(size);
	for (const layer of t.layers.all) layer.fontSize(size);
});
