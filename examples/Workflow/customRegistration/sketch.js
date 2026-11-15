/**
 * @title FiltersPlugin.customRegistration
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
const controls = [{ label: 'AMOUNT 0-2', min: 0, max: 2, step: 0.1, value: 1, format: (v) => v.toFixed(1) }];
let layout = null,
	activeSlider = -1,
	video;
const colorShiftSource = `#version 300 es
precision highp float;
uniform sampler2D u_texture;
uniform float u_amount;
in vec2 v_uv;
out vec4 fragColor;
void main() {
	vec4 color = texture(u_texture, v_uv);
	fragColor = vec4(color.b * u_amount, color.r, color.g, color.a);
}`;
function drawLabel(lines) {
	const [left, top] = [-Math.floor(labelLayer.grid.cols / 2), -Math.floor(labelLayer.grid.rows / 2)];
	const width = Math.max(...lines.map(([text]) => text.length)) + 2;
	t.clear();
	t.push();
	t.translate(left + 2 + width / 2, top + 2 + (lines.length + 2) / 2);
	t.cellColor(6, 10, 22);
	t.rect(width, lines.length + 2);
	t.pop();
	lines.forEach(([text, color], index) => {
		t.charColor(color[0], color[1], color[2]);
		t.print(text, left + 3, top + 3 + index);
	});
}
function drawControls() {
	t.clear();
	const control = controls[0];
	const width = Math.min(34, controlLayer.grid.cols - 4);
	const height = 5;
	const left = Math.floor(controlLayer.grid.cols / 2) - width - 2;
	const top = Math.floor(controlLayer.grid.rows / 2) - height - 2;
	t.push();
	t.translate(left + width / 2, top + height / 2);
	t.cellColor(6, 10, 22);
	t.rect(width, height);
	t.pop();
	const track = width - 6;
	const ratio = (control.value - control.min) / (control.max - control.min);
	const filled = Math.round(ratio * (track - 1));
	t.charColor(140, 255, 200);
	t.print(control.label + ' ' + control.format(control.value), left + 2, top + 2);
	t.print('[' + '='.repeat(filled) + '#' + '-'.repeat(track - 1 - filled) + ']', left + 2, top + 3);
	layout = { left: left + 3, width: track - 1, top: top + 3, gap: 3, panelLeft: left, panelWidth: width };
}
function setControl(index, x) {
	const control = controls[index];
	if (!control || !Number.isFinite(x)) return;
	const ratio = Math.min(1, Math.max(0, (x - layout.left) / layout.width));
	control.value = control.min + Math.round((ratio * (control.max - control.min)) / control.step) * control.step;
}
function start(x, y) {
	const hit =
		layout && x >= layout.panelLeft && x <= layout.panelLeft + layout.panelWidth && Math.abs(y - layout.top) <= 2;
	activeSlider = hit ? 0 : -1;
	if (hit) setControl(0, x);
}
t.mousePressed(({ position }) => start(position.x, position.y));
t.mouseDragged(({ position }) => setControl(activeSlider, position.x));
t.touchStarted(({ touch }) => start(touch.x, touch.y));
t.touchMoved(({ touch }) => setControl(activeSlider, touch.x));
t.setup(async () => {
	await t.filters.register('colorShift', colorShiftSource, { u_amount: ['amount', 1] });
	video = await t.loadVideo('https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4');
	video.characters(' .:-=+*#%@').play();
});
labelLayer.draw(() => {
	drawLabel([
		['FILTERSPLUGIN.CUSTOMREGISTRATION', [120, 240, 180]],
		['------------------------------------', [70, 100, 140]],
		['CONCEPT: REGISTER A FILTER SHADER', [140, 210, 255]],
		[`REGISTERED: ${t.filters.has('colorShift')}`, [140, 255, 200]],
	]);
});
controlLayer.draw(drawControls);
t.draw(() => {
	if (!video) return;
	t.layers.base.filter('colorShift', { amount: controls[0].value });
	t.image(video, t.grid.cols, t.grid.rows);
});
t.windowResized(() => {
	t.resizeCanvas(window.innerWidth, window.innerHeight);
	t.fontSize(fontSize());
	for (const layer of t.layers.all) layer.fontSize(fontSize());
});
