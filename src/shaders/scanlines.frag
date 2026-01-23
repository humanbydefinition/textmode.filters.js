#version 300 es
precision highp float;

uniform sampler2D u_texture;
uniform float u_time;
uniform float u_count;     // Number of scanlines
uniform float u_intensity; // Scanline opacity/strength
uniform float u_speed;     // Scroll speed

in vec2 v_uv;
out vec4 fragColor;

void main() {
    vec4 color = texture(u_texture, v_uv);
    
    // Generate animated scanline pattern
    float lines = sin((v_uv.y * u_count - u_time * u_speed) * 3.141592 * 2.0);
    lines = lines * 0.5 + 0.5; // Normalize to 0..1
    
    // Apply intensity to control darkening strength
    float darkening = 1.0 - (u_intensity * (1.0 - lines));
    
    fragColor = vec4(color.rgb * darkening, color.a);
}
