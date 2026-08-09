/**
 * @title FiltersPlugin.customRegistration
 */
const t = textmode.create({
	width: window.innerWidth,
	height: window.innerHeight,
	fontSize: 8,
	plugins: [FiltersPlugin],
});
const labelLayer = t.layers.add();

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

t.setup(async () => {
	await t.filters.register('colorShift', colorShiftSource, { u_amount: ['amount', 1.0] });
});

labelLayer.draw(() => {
	t.clear();
	const left = -Math.floor(t.grid.cols / 2),
		top = -Math.floor(t.grid.rows / 2);
	t.printAlign('left', 'top');
	t.charColor(120, 255, 180);
	t.print('CUSTOM FILTER: COLORSHIFT', left + 3, top + 3);
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
});
