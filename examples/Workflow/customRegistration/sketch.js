/**
 * @title FiltersPlugin.customRegistration
 */
const t = textmode.create({
	width: window.innerWidth,
	height: window.innerHeight,
	fontSize: window.innerWidth < 700 ? 8 : 16,
	plugins: [FiltersPlugin],
});
const labelLayer = t.layers.add({ fontSize: window.innerWidth < 700 ? 8 : 16 });

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

t.setup(async () => {
	await t.filters.register('colorShift', colorShiftSource, { u_amount: ['amount', 1.0] });
});

labelLayer.draw(() => {
	t.clear();
	drawLabel([
		['FILTERSPLUGIN.CUSTOMREGISTRATION', [120, 240, 180]],
		['------------------------------------', [70, 100, 140]],
		['CONCEPT: CUSTOM FILTER REGISTRATION', [140, 210, 255]],
		['Registers a GLSL color-shift filter.', [140, 160, 190]],
		['Channels swap through u_amount.', [140, 160, 190]],
		['------------------------------------', [70, 100, 140]],
		[`REGISTERED: ${t.filters.has('colorShift')}`, [140, 255, 200]],
	]);
});

t.draw(() => {
	t.layers.base.filter('colorShift', { amount: 0.7 + 0.3 * Math.sin(t.secs) });
	t.background(15, 30, 70);
	t.charColor(255, 90, 150);
	t.char('@');
	t.rect(t.grid.width * 0.7, t.grid.height * 0.7);
});

t.windowResized(() => {
	t.resizeCanvas(window.innerWidth, window.innerHeight);
	const size = window.innerWidth < 700 ? 8 : 16;
	t.fontSize(size);
	for (const layer of t.layers.all) layer.fontSize(size);
});
