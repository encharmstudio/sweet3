precision mediump float;

varying vec2 vUv;

varying vec3 vNormalView;
varying vec3 vPosToCam;

varying vec3 vColor;

void main() {

  float d = dot(normalize(vPosToCam), normalize(vNormalView));
  gl_FragColor = vec4(normalize(vPosToCam), 1.0);
  gl_FragColor = vec4(vec3(d), 0.5);

  if (d < 0.5) {
    discard;
  }
  d *= d;
  float d4 = d * d;
  gl_FragColor = vec4(vColor, d * d4 *  (vUv.y));
}