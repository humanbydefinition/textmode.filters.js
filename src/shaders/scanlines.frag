#version 300 es
precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_count;     // Number of scanlines
uniform float u_lineWidth; // Width relative to spacing (0.0-1.0)
uniform float u_intensity; // Opacity strings
uniform float u_speed;     // Scroll speed

in vec2 v_uv;
out vec4 fragColor;

void main() {
    vec4 color = texture(u_texture, v_uv);
    
    // Calculate scanline pattern
    // v_uv.y is 0 to 1. multiply by count to get number of lines
    float scanline = sin((v_uv.y * u_count - u_time * u_speed) * 3.14159 * 2.0);
    
    // Sharpen the sine wave based on line width
    // map -1..1 to 0..1
    scanline = scanline * 0.5 + 0.5;
    
    // Apply intensity: 1.0 = full scanline effect, 0.0 = no effect
    // We want the scanline to darken the image, so we invert it for multiplication
    // or subtract it.
    
    // Let's use a simpler approach for sharp controllable lines
    // Pattern: 1.0 (visible) -> 1.0-intensity (darkened)
    
    float pattern = smoothstep(0.5 - u_lineWidth/2.0, 0.5 - u_lineWidth/2.0 + 0.1, scanline) 
                  - smoothstep(0.5 + u_lineWidth/2.0, 0.5 + u_lineWidth/2.0 + 0.1, scanline);
    
    // Alternative simple sine based darkening
    float s = sin((v_uv.y * u_count + u_time * u_speed) * 20.0);
    // Normalized 0..1
    float scan = (s + 1.0) * 0.5;
    
    // If we want controllable width, we can power it
    // A standard nice scanline is just a sine wave darkening
    
    float lines = sin((v_uv.y * u_count - u_time * u_speed) * 3.141592 * 2.0);
    lines = lines * 0.5 + 0.5; // 0..1
    
    // Apply intensity. 
    // If intensity is 0.5, we want values to range from 0.5 to 1.0
    // If intensity is 1.0, we want values to range from 0.0 to 1.0
    // If intensity is 0.0, we want values to be 1.0
    
    float darkening = 1.0 - (u_intensity * (1.0 - lines));
    
    fragColor = vec4(color.rgb * darkening, color.a);
}
