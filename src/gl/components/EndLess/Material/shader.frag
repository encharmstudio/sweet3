// #ifdef GL_OES_standard_derivatives
// #extension GL_OES_standard_derivatives: enable
// #endif

uniform sampler2D map;
uniform float time;

varying vec2 vUv;
varying vec3 vPos;

void main() {

  float t = time * 0.0001;
  vec2 repeat = -vec2(12.0 , 3.0);
  vec2 uv = fract(vUv * repeat + vec2(-t, 0.));
  vec3 texture = texture2D(map, uv).rgb;
 
  float shadow = vPos.z/2.0;
  shadow = smoothstep(0.0, 1.0, shadow);
  texture *=shadow;
 
  gl_FragColor = vec4(texture, 1.0);
}
