#version 300 es
precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_amount;
uniform vec2 u_direction;

in vec2 v_uv;
out vec4 fragColor;

void main() {
    vec2 texelSize = 1.0 / u_resolution;
    vec2 offset = u_direction * u_amount * texelSize;
    
    // Sample each color channel with different offsets
    float r = texture(u_texture, v_uv + offset).r;
    vec4 ga = texture(u_texture, v_uv);
    float g = ga.g;
    float b = texture(u_texture, v_uv - offset).b;
    float a = ga.a;
    
    fragColor = vec4(r, g, b, a);
}
