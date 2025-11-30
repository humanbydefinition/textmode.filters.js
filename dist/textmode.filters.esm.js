const n = () => ({ name: "textmode.filters", version: "1.0.0", async install(r) {
  r.layers.filters.register("brightness", `#version 300 es\r
precision highp float;\r
\r
uniform sampler2D u_texture;\r
uniform vec2 u_resolution;\r
uniform float u_amount;\r
\r
in vec2 v_uv;\r
out vec4 fragColor;\r
\r
void main() {\r
    vec4 color = texture(u_texture, v_uv);\r
    \r
    // Multiply RGB by brightness amount\r
    vec3 result = color.rgb * u_amount;\r
    \r
    fragColor = vec4(result, color.a);\r
}`, { u_amount: ["amount", 1] }), r.layers.filters.register("contrast", `#version 300 es\r
precision highp float;\r
\r
uniform sampler2D u_texture;\r
uniform vec2 u_resolution;\r
uniform float u_amount;\r
\r
in vec2 v_uv;\r
out vec4 fragColor;\r
\r
void main() {\r
    vec4 color = texture(u_texture, v_uv);\r
    \r
    // Adjust contrast around midpoint (0.5)\r
    vec3 result = (color.rgb - 0.5) * u_amount + 0.5;\r
    \r
    fragColor = vec4(result, color.a);\r
}`, { u_amount: ["amount", 1] });
}, async uninstall(r) {
  r.layers.filters.unregister("brightness"), r.layers.filters.unregister("contrast");
} });
typeof window < "u" && (window.createFiltersPlugin = n);
export {
  n as createFiltersPlugin
};
