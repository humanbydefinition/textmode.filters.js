#version 300 es
precision highp float;
uniform sampler2D u_texture;
uniform float u_amount;
in vec2 v_uv;
out vec4 fragColor;
void main() {
    vec4 color = texture(u_texture, v_uv);
    vec3 tone = vec3(
        dot(color.rgb, vec3(0.393, 0.769, 0.189)),
        dot(color.rgb, vec3(0.349, 0.686, 0.168)),
        dot(color.rgb, vec3(0.272, 0.534, 0.131))
    );
    fragColor = vec4(mix(color.rgb, tone, u_amount), color.a);
}
