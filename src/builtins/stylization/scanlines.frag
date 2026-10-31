#version 300 es
precision highp float;

uniform sampler2D u_texture;
uniform float u_time;
uniform float u_count;     // Number of scanlines
uniform float u_lineWidth; // Dark-line duty cycle (0..1)
uniform float u_intensity; // Scanline opacity/strength
uniform float u_speed;     // Scroll speed

in vec2 v_uv;
out vec4 fragColor;

void main() {
    vec4 color = texture(u_texture, v_uv);
    
    // Generate an antialiased duty-cycle mask. A width of 0 leaves only a
    // minimal edge, 0.5 produces equal line and gap widths, and 1 fills the
    // whole interval.
    float phase = fract(v_uv.y * u_count - u_time * u_speed);
    float antialias = max(fwidth(phase), 0.0001);
    float dutyCycle = clamp(u_lineWidth, 0.0, 1.0);
    float coverage = dutyCycle;
    if (dutyCycle <= 0.0) coverage = antialias;
    if (dutyCycle >= 1.0) coverage = 1.0 + antialias;
    float lineMask = 1.0 - smoothstep(coverage - antialias, coverage + antialias, phase);

    // Apply intensity to control darkening strength.
    float darkening = 1.0 - (u_intensity * lineMask);
    
    fragColor = vec4(color.rgb * darkening, color.a);
}
