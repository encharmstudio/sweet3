varying vec2 vUv;

uniform sampler2D t;
uniform vec2 invSize;
uniform vec2 direction;

float gaussianPdf(float x, float sigma) {
  return .39894 * exp(-.5 * x * x / (sigma * sigma)) / sigma;
}

void main() {
  float fSigma = float(SIGMA);

  float weightSum = gaussianPdf(0., fSigma);
  vec3 diffuseSum = texture2D(t, vUv).rgb * weightSum;

  #pragma unroll_loop_start
  for (int i = 1; i < KERNEL_RADIUS; i++) {
    float x = float(i);
    float w = gaussianPdf(x, fSigma);
    vec2 uvOffset = direction * invSize * x;
    vec3 sample1 = texture2D(t, vUv + uvOffset).rgb;
    vec3 sample2 = texture2D(t, vUv - uvOffset).rgb;
    diffuseSum += (sample1 + sample2) * w;
    weightSum += w + w;
  }
  #pragma unroll_loop_end

  gl_FragColor = vec4(diffuseSum / weightSum, 1.);
}