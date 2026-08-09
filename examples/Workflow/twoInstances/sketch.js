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
	fontSize: 8,
	plugins: [FiltersPlugin],
});
const other = textmode.create({
	canvas: secondCanvas,
	width: window.innerWidth,
	height: window.innerHeight,
	fontSize: 8,
	plugins: [FiltersPlugin],
});
const labelLayer = t.layers.add();
const otherLabelLayer = other.layers.add();

labelLayer.draw(() => {
	t.clear();
	const left = -Math.floor(t.grid.cols / 2),
		top = -Math.floor(t.grid.rows / 2);
	t.printAlign('left', 'top');
	t.charColor(120, 255, 180);
	t.print('INSTANCE A: INVERT', left + 3, top + 3);
});

otherLabelLayer.draw(() => {
	other.clear();
	other.printAlign('left', 'top');
	other.charColor(120, 255, 180);
	other.print('INSTANCE B: SEPIA', -Math.floor(other.grid.cols / 2) + 3, -Math.floor(other.grid.rows / 2) + 3);
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
});
