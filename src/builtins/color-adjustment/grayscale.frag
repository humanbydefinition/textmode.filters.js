#version 300 es
precision highp float;
uniform sampler2D u_texture;
uniform float u_amount;
in vec2 v_uv;
out vec4 fragColor;
void main() {
    vec4 color = texture(u_texture, v_uv);
    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    fragColor = vec4(mix(color.rgb, vec3(gray), u_amount), color.a);
}
