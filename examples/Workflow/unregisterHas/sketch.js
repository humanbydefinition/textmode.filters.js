/**
 * @title FiltersPlugin.unregisterHas
 */
const t = textmode.create({
	width: window.innerWidth,
	height: window.innerHeight,
	fontSize: 8,
	plugins: [FiltersPlugin],
});
const labelLayer = t.layers.add();
let removed = false;

labelLayer.draw(() => {
	t.clear();
	const left = -Math.floor(t.grid.cols / 2),
		top = -Math.floor(t.grid.rows / 2);
	t.printAlign('left', 'top');
	t.charColor(120, 255, 180);
	t.print(`SEPIA REGISTERED: ${t.filters.has('sepia')}`, left + 3, top + 3);
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
});
