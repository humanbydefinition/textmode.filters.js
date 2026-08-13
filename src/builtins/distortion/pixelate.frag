#version 300 es
precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_pixelSize;

in vec2 v_uv;
out vec4 fragColor;

void main() {
    vec2 pixelSize = vec2(u_pixelSize) / u_resolution;
    vec2 pixelatedUV = floor(v_uv / pixelSize) * pixelSize + pixelSize * 0.5;
    
    fragColor = texture(u_texture, pixelatedUV);
}
