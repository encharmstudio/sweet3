#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform vec3 targetPosition;
uniform vec2 texelSize;
uniform sampler2D positionsMap;

void main() {

  vec3 bonePosition = texture(positionsMap, vUv).xyz;
  vec3 nextbonePosition = texture(positionsMap, vec2(vUv.x + texelSize.x, vUv.y)).xyz;

  float mixFactor = vUv.x * (1. - texelSize.x * 0.5);
  mixFactor = 0.25 + 0.75 * mixFactor;

  vec3 result1 = mix(bonePosition, targetPosition, mixFactor);
  vec3 result2 = mix(bonePosition, nextbonePosition, mixFactor);

  float targetFactor = step(.95, vUv.x);
  result1 *= targetFactor;
  result2 *= 1.0 - targetFactor;
  vec3 result = result1 + result2;

  fragColor = vec4(result, 1.0);
}