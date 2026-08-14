#version 300 es
precision highp float;
uniform sampler2D u_texture;
uniform float u_threshold;
in vec2 v_uv;
out vec4 fragColor;
void main() {
    vec4 color = texture(u_texture, v_uv);
    float value = step(u_threshold, dot(color.rgb, vec3(0.299, 0.587, 0.114)));
    fragColor = vec4(vec3(value), color.a);
}
