/**
 * @title FiltersPlugin.twoInstances
 */
const firstCanvas = document.createElement('canvas');
const secondCanvas = document.createElement('canvas');
firstCanvas.style.width = secondCanvas.style.width = '50vw';
firstCanvas.style.height = secondCanvas.style.height = '100vh';
document.body.append(firstCanvas, secondCanvas);

const t = textmode.create({
	canvas: firstCanvas,
	width: window.innerWidth,
	height: window.innerHeight,
	fontSize: window.innerWidth < 700 ? 8 : 16,
	plugins: [FiltersPlugin],
});
const other = textmode.create({
	canvas: secondCanvas,
	width: window.innerWidth,
	height: window.innerHeight,
	fontSize: window.innerWidth < 700 ? 8 : 16,
	plugins: [FiltersPlugin],
});
const labelLayer = t.layers.add({ fontSize: window.innerWidth < 700 ? 8 : 16 });
const otherLabelLayer = other.layers.add({ fontSize: window.innerWidth < 700 ? 8 : 16 });

function drawLabel(inst, layer, lines) {
	const { cols, rows } = layer.grid;
	const [left, top] = [-Math.floor(cols / 2), -Math.floor(rows / 2)];
	const width = Math.max(...lines.map(([text]) => [...text].length)) + 2;
	inst.push();
	inst.translate(left + (width + 4) / 2, top + (lines.length + 5) / 2);
	inst.char(' ');
	inst.charColor(6, 10, 22);
	inst.cellColor(6, 10, 22);
	inst.rect(width, lines.length + 2);
	inst.pop();
	inst.printAlign('left', 'top');
	lines.forEach(([text, color], i) => {
		inst.charColor(color[0], color[1], color[2]);
		inst.print(text, left + 3, top + 3 + i);
	});
}

labelLayer.draw(() => {
	t.clear();
	drawLabel(t, labelLayer, [
		['FILTERSPLUGIN.TWOINSTANCES', [120, 240, 180]],
		['------------------------------------', [70, 100, 140]],
		['CONCEPT: INDEPENDENT FILTER STACKS', [140, 210, 255]],
		['Each instance filters on its own.', [140, 160, 190]],
		['This canvas inverts its base layer.', [140, 160, 190]],
		['------------------------------------', [70, 100, 140]],
		['INSTANCE A: INVERT', [140, 255, 200]],
	]);
});

otherLabelLayer.draw(() => {
	other.clear();
	drawLabel(other, otherLabelLayer, [
		['FILTERSPLUGIN.TWOINSTANCES', [120, 240, 180]],
		['------------------------------------', [70, 100, 140]],
		['CONCEPT: INDEPENDENT FILTER STACKS', [140, 210, 255]],
		['Both canvases resize together.', [140, 160, 190]],
		['This canvas applies sepia.', [140, 160, 190]],
		['------------------------------------', [70, 100, 140]],
		['INSTANCE B: SEPIA', [140, 255, 200]],
	]);
});

t.draw(() => {
	t.layers.base.filter('invert');
	t.background(20, 35, 80);
	t.charColor(255, 100, 160);
	t.char('@');
	t.rect(t.grid.width * 0.7, t.grid.height * 0.7);
});

other.draw(() => {
	other.layers.base.filter('sepia');
	other.background(20, 60, 45);
	other.charColor(80, 220, 255);
	other.char('#');
	other.rect(other.grid.width * 0.7, other.grid.height * 0.7);
});

t.windowResized(() => {
	t.resizeCanvas(window.innerWidth, window.innerHeight);
	other.resizeCanvas(window.innerWidth, window.innerHeight);
	const size = window.innerWidth < 700 ? 8 : 16;
	for (const inst of [t, other]) {
		inst.fontSize(size);
		for (const layer of inst.layers.all) layer.fontSize(size);
	}
});
