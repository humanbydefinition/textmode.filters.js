#version 300 es
precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_count;
uniform float u_opacity;
uniform float u_vertical; // 0.0 for horizontal, 1.0 for vertical

in vec2 v_uv;
out vec4 fragColor;

void main() {
    vec4 color = texture(u_texture, v_uv);

    // Determine coordinate to use based on orientation
    float coord = mix(v_uv.y, v_uv.x, u_vertical);

    // Calculate sine wave pattern
    // shift by 0.5 to keep range [-1, 1], then normalize to [0, 1]
    float scanline = sin(coord * u_count * 3.14159 * 2.0);

    // Map [-1, 1] to [1 - opacity, 1]
    // when scanline is 1, result is 1 (no darkening)
    // when scanline is -1, result is 1 - opacity (darkest point)
    float darken = 1.0 - (u_opacity * 0.5 * (1.0 - scanline));

    fragColor = vec4(color.rgb * darken, color.a);
}
