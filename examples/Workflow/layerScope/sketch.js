/**
 * @title FiltersPlugin.layerScope
 */
const t = textmode.create({
	width: window.innerWidth,
	height: window.innerHeight,
	fontSize: 8,
	plugins: [FiltersPlugin],
});
const labelLayer = t.layers.add();

labelLayer.draw(() => {
	t.clear();
	const left = -Math.floor(t.grid.cols / 2),
		top = -Math.floor(t.grid.rows / 2);
	t.printAlign('left', 'top');
	t.charColor(120, 255, 180);
	t.print('LAYER SCOPE: LABEL STAYS IN COLOR', left + 3, top + 3);
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
});
