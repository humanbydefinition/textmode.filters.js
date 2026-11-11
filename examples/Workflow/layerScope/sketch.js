/**
 * @title FiltersPlugin.layerScope
 */
const t = textmode.create({
	width: window.innerWidth,
	height: window.innerHeight,
	fontSize: window.innerWidth < 700 ? 8 : 16,
	plugins: [FiltersPlugin],
});
const labelLayer = t.layers.add({ fontSize: window.innerWidth < 700 ? 8 : 16 });

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

labelLayer.draw(() => {
	t.clear();
	drawLabel([
		['FILTERSPLUGIN.LAYERSCOPE', [120, 240, 180]],
		['------------------------------------', [70, 100, 140]],
		['CONCEPT: PER-LAYER FILTER SCOPE', [140, 210, 255]],
		['A layer filter affects only that layer.', [140, 160, 190]],
		['Base filters leave user layers alone.', [140, 160, 190]],
		['The label stays in full color.', [140, 160, 190]],
	]);
});

t.draw(() => {
	t.layers.base.filter('grayscale');
	t.background(20, 35, 80);
	t.charColor(255, 80, 160);
	t.char('#');
	t.rect(t.grid.width * 0.7, t.grid.height * 0.7);
});

t.windowResized(() => {
	t.resizeCanvas(window.innerWidth, window.innerHeight);
	const size = window.innerWidth < 700 ? 8 : 16;
	t.fontSize(size);
	for (const layer of t.layers.all) layer.fontSize(size);
});
