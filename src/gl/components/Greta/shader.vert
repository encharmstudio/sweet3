uniform float wave;
uniform float uLimitCurve;
uniform float uShear;

varying vec2 vUv;
varying vec3 vPos;

#define PI 3.14159265358979323846264338327

void main() {
    vUv = uv;
    vPos = position;
    vec3 displaced = position;
    float p = wave;
    
    float normalizedY = vUv.y;
    float offsetCurve = uLimitCurve * 1.0;
    // float speed = shear;
    float offset = normalizedY * normalizedY * uShear * 2.0;
    displaced.x -= -1.0 * offset ; // Curve
    // displaced.x -= (normalizedY * -offsetShear) * -1.0; 
    
    //displaced.x -= mix(offset * 1.0,uLimitCurve,normalizedY); // shear
    
    // wave
    float gradientSize = 0.3;
    float skewSize = 0.2;
    float progress = p + (p * 2. * gradientSize) + (p * 2. * skewSize) - gradientSize - skewSize;
    float start = progress - gradientSize;
    float end = progress + gradientSize;
    float y = smoothstep(start, end, vUv.x + ((1.0 - vUv.y) * skewSize));
    float height = 1.0 - abs(y * 2. - 1.);
    displaced.z += (height * 5.0) * 0.03;
    //end wave

    vec4 modelViewPosition = modelViewMatrix * vec4(displaced, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
   // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}