// #ifdef GL_OES_standard_derivatives
// #extension GL_OES_standard_derivatives: enable
// #endif

uniform sampler2D map;
varying vec2 vUv;

void main() {
  vec3 texture = texture2D(map, vUv).rgb;
  gl_FragColor = vec4(texture, 1.0);
}
