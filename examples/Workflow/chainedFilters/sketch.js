/**
 * @title FiltersPlugin.chainedFilters
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
		['FILTERSPLUGIN.CHAINEDFILTERS', [120, 240, 180]],
		['------------------------------------', [70, 100, 140]],
		['CONCEPT: CHAINED FILTERS', [140, 210, 255]],
		['Each filter() call adds another pass.', [140, 160, 190]],
		['Saturation, bloom, then vignette.', [140, 160, 190]],
		['------------------------------------', [70, 100, 140]],
		['PASSES: 3', [140, 255, 200]],
	]);
});

t.draw(() => {
	t.background(20, 35, 80);
	t.charColor(255, 100, 160);
	t.char('@');
	t.rect(t.grid.width * 0.7, t.grid.height * 0.7);
	t.filter('saturation', 1.8);
	t.filter('bloom', { threshold: 0.35, intensity: 1.2, radius: 3 });
	t.filter('vignette', { amount: 0.7, softness: 0.45 });
});

t.windowResized(() => {
	t.resizeCanvas(window.innerWidth, window.innerHeight);
	const size = window.innerWidth < 700 ? 8 : 16;
	t.fontSize(size);
	for (const layer of t.layers.all) layer.fontSize(size);
});
