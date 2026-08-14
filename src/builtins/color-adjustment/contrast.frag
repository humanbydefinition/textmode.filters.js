#version 300 es
precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_amount;

in vec2 v_uv;
out vec4 fragColor;

void main() {
    vec4 color = texture(u_texture, v_uv);
    
    // Adjust contrast around midpoint (0.5)
    vec3 result = (color.rgb - 0.5) * u_amount + 0.5;
    
    fragColor = vec4(result, color.a);
}