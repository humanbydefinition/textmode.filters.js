#version 300 es
precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_amount;

in vec2 v_uv;
out vec4 fragColor;

void main() {
    vec4 color = texture(u_texture, v_uv);
    
    // Multiply RGB by brightness amount
    vec3 result = color.rgb * u_amount;
    
    fragColor = vec4(result, color.a);
}