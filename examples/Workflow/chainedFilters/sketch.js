/**
 * @title FiltersPlugin.chainedFilters
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
	t.print('CHAIN: SATURATION > BLOOM > VIGNETTE', left + 3, top + 3);
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
});
