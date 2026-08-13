#version 300 es
precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_levels; // Number of color levels

in vec2 v_uv;
out vec4 fragColor;

void main() {
    vec4 color = texture(u_texture, v_uv);
    vec3 result = floor(color.rgb * u_levels) / u_levels;
    fragColor = vec4(result, color.a);
}
