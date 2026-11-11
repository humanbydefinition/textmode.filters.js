/**
 * @title FiltersPlugin.unregisterHas
 */
const t = textmode.create({
	width: window.innerWidth,
	height: window.innerHeight,
	fontSize: window.innerWidth < 700 ? 8 : 16,
	plugins: [FiltersPlugin],
});
const labelLayer = t.layers.add({ fontSize: window.innerWidth < 700 ? 8 : 16 });
let removed = false;

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
		['FILTERSPLUGIN.UNREGISTERHAS', [120, 240, 180]],
		['------------------------------------', [70, 100, 140]],
		['CONCEPT: UNREGISTER AND HAS', [140, 210, 255]],
		['Removes the sepia filter at 3 seconds.', [140, 160, 190]],
		['has() reports the current registry.', [140, 160, 190]],
		['------------------------------------', [70, 100, 140]],
		[`SEPIA REGISTERED: ${t.filters.has('sepia')}`, [140, 255, 200]],
	]);
});

t.draw(() => {
	if (t.secs > 3 && !removed) removed = t.filters.unregister('sepia');
	if (t.filters.has('sepia')) t.layers.base.filter('sepia');
	t.background(15, 35, 75);
	t.charColor(255, 180, 70);
	t.char('%');
	t.rect(t.grid.width * 0.7, t.grid.height * 0.7);
});

t.windowResized(() => {
	t.resizeCanvas(window.innerWidth, window.innerHeight);
	const size = window.innerWidth < 700 ? 8 : 16;
	t.fontSize(size);
	for (const layer of t.layers.all) layer.fontSize(size);
});
