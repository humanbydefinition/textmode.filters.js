/**
 * @title FiltersPlugin.bloom
 */
const t = textmode.create({
	width: window.innerWidth,
	height: window.innerHeight,
	fontSize: window.innerWidth < 700 ? 8 : 16,
	plugins: [FiltersPlugin],
});
const fontSize = () => (window.innerWidth < 700 ? 8 : 16);
const labelLayer = t.layers.add({ fontSize: fontSize() });
const controlLayer = t.layers.add({ fontSize: fontSize() });
const controls = [
	{ label: 'THRESHOLD 0-1', min: 0, max: 1, step: 0.05, value: 0.5, format: (v) => v.toFixed(2) },
	{ label: 'INTENSITY 0-3', min: 0, max: 3, step: 0.1, value: 1.2, format: (v) => v.toFixed(1) },
	{ label: 'RADIUS 1-10', min: 1, max: 10, step: 0.5, value: 4, format: (v) => v.toFixed(1) },
];
let layout = null,
	activeSlider = -1,
	video;
function drawLabel(lines) {
	const [left, top] = [-Math.floor((labelLayer.grid.cols - 1) / 2), -Math.floor(labelLayer.grid.rows / 2)];
	const width = Math.max(...lines.map(([text]) => text.length)) + 2;
	t.clear();
	t.cellColor(6, 10, 22);
	t.push();
	t.translate(left + 2 + (width - 1) / 2, top + 2 + (lines.length + 1) / 2);
	t.rect(width, lines.length + 2);
	t.pop();
	lines.forEach(([text, color], index) => {
		t.charColor(color[0], color[1], color[2]);
		t.print(text, left + 3, top + 3 + index);
	});
}
function drawControls() {
	t.clear();
	const width = Math.min(34, controlLayer.grid.cols - 4);
	const height = controls.length * 3 + 2;
	const left = Math.floor(controlLayer.grid.cols / 2) - width - 1;
	const top = Math.floor((controlLayer.grid.rows - 1) / 2) - height - 1;
	t.cellColor(6, 10, 22);
	t.push();
	t.translate(left + (width - 1) / 2, top + (height - 1) / 2);
	t.rect(width, height);
	t.pop();
	const track = width - 6;
	controls.forEach((control, index) => {
		const row = top + 2 + index * 3;
		const ratio = (control.value - control.min) / (control.max - control.min);
		const filled = Math.max(0, Math.min(track - 1, Math.round(ratio * (track - 1))));
		const bar = '[' + '='.repeat(filled) + '#' + '-'.repeat(track - 1 - filled) + ']';
		t.charColor(140, 255, 200);
		t.print(control.label + ' ' + control.format(control.value), left + 2, row);
		t.print(bar, left + 2, row + 1);
	});
	layout = { left: left + 3, width: track - 1, top: top + 3, gap: 3, panelLeft: left, panelWidth: width };
}
function setControl(index, x) {
	const control = controls[index];
	if (!control || !Number.isFinite(x)) return;
	const ratio = Math.min(1, Math.max(0, (x - layout.left) / layout.width));
	control.value = control.min + Math.round((ratio * (control.max - control.min)) / control.step) * control.step;
}
function start(x, y) {
	activeSlider = -1;
	if (!layout || x < layout.panelLeft || x > layout.panelLeft + layout.panelWidth) return;
	const index = Math.round((y - layout.top) / layout.gap);
	const control = controls[index];
	if (!control || Math.abs(y - (layout.top + index * layout.gap)) > 2) return;
	activeSlider = index;
	setControl(index, x);
}
t.mousePressed(({ position }) => start(position.x, position.y));
t.mouseDragged(({ position }) => setControl(activeSlider, position.x));
t.touchStarted(({ touch }) => start(touch.x, touch.y));
t.touchMoved(({ touch }) => setControl(activeSlider, touch.x));
t.setup(async () => {
	video = await t.loadVideo('https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4');
	video.play();
	video.characters(' .:-=+*#%@');
});
labelLayer.draw(() => {
	drawLabel([
		['FILTERSPLUGIN.BLOOM', [120, 240, 180]],
		['------------------------------------', [70, 100, 140]],
		['CONCEPT: GLOW BRIGHT AREAS', [140, 210, 255]],
	]);
});
controlLayer.draw(drawControls);
t.draw(() => {
	if (!video) return;
	const [threshold, intensity, radius] = controls.map((control) => control.value);
	t.layers.base.filter('bloom', { threshold, intensity, radius });
	t.image(video, t.grid.cols, t.grid.rows);
});
t.windowResized(() => {
	t.resizeCanvas(window.innerWidth, window.innerHeight);
	t.fontSize(fontSize());
	for (const layer of t.layers.all) layer.fontSize(fontSize());
});
