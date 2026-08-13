#version 300 es
precision highp float;
uniform sampler2D u_texture;
in vec2 v_uv;
out vec4 fragColor;
void main() {
    vec4 color = texture(u_texture, v_uv);
    fragColor = vec4(1.0 - color.rgb, color.a);
}
