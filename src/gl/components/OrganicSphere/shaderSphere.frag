// #ifdef GL_OES_standard_derivatives
// #extension GL_OES_standard_derivatives: enable
// #endif

 varying vec2 vUv;
 varying vec3 vNormal;
 varying vec3 vPosition;

// uniform sampler2D map;
// uniform vec3 color;
// uniform float power;
// uniform float opacity;


void main() {
   
   gl_FragColor = vec4(vNormal,1.0);
}
