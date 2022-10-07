// #ifdef GL_OES_standard_derivatives
// #extension GL_OES_standard_derivatives: enable
// #endif

varying vec2 vUv;

uniform sampler2D map;
uniform vec3 color;
uniform float power;
uniform float opacity;

float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

void main() {
  vec3 msdf = texture2D(map, vUv).rgb;
  float sigDist = median(msdf.r, msdf.g, msdf.b) - .5;
  float alpha = opacity * clamp(sigDist / fwidth(sigDist) + .5, 0., 1.);
  if (alpha < .01) discard;
  gl_FragColor = vec4(color * power, alpha);
}
