// #ifdef GL_OES_standard_derivatives
// #extension GL_OES_standard_derivatives: enable
// #endif

varying vec2 vUv;
varying vec2 vLayoutUv;

uniform sampler2D map;
uniform vec3 color;
uniform float power;
uniform float opacity;
uniform float progress;

// Strokes
uniform vec3 uStrokeColor;
uniform float uStrokeOutsetWidth;
uniform float uStrokeInsetWidth;
uniform float uThreshold;

#define STROKE

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) *
    43758.5453123);
}
// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise(in vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

    // Four corners in 2D of a tile
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x) +
    (c - a) * u.y * (1.0 - u.x) +
    (d - b) * u.x * u.y;
}

#define OCTAVES 6
float fbm(in vec2 st) {
    // Initial values
  float value = 0.0;
  float amplitude = .5;
  float frequency = 0.;
    //
    // Loop of octaves
  for(int i = 0; i < OCTAVES; i++) {
    value += amplitude * noise(st);
    st *= 2.;
    amplitude *= .5;
  }
  return value;
}

float mapRange(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float patternCheker(vec2 vUv){
  vec2 st = vUv;
  st *= 50.0; // Scale the coordinate system by 10
  vec2 ipos = floor(st);  // get the integer coords
  vec2 fpos = fract(st);  // get the fractional coords
    // Assign a random value based on the integer coord
  return  random(ipos);

}

float patternLines(vec2 uv){

  float p = progress;
  vec2 st = vec2(fract(uv.x * 10.0),uv.y);
  
  float p1 = mapRange(p, 0.0, 0.5, 0.0, 1.0);
  float p2 = mapRange(p, 0.5, 1.0, 0.0, 1.0);

  float mask = 0.0;
  if(st.x < 0.5) {
    if(st.y < p1) {
      mask = 1.0;
    }
  } else {
    if(st.y > (1.0-p1) ) {
      mask = 1.0;
    }
  }

  if(progress >= 0.5) {
     if(st.x < 0.5) {
        if(st.y < p2) {
          mask = 0.0;
        }
      } else {
        if(st.y > (1.0 - p2)) {
          mask = 0.0;
        }
      }
  } 

  return mask;
}

float patternBlot(vec2 uv){
  float mask = 0.0;
  float p = progress;
  if(progress<=0.5){
     p = mapRange(p, 0.0, 0.5, 0.0, 1.0);
     mask = step(1.0-p, fbm(uv * 5.0));
  }else{
     p = mapRange(p, 0.5, 1.0, 0.0, 1.0);
     mask = step(p, fbm(uv * 5.0));
  }
 
  return mask;
} 

float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

void main() {
  vec3 msdf = texture2D(map, vUv).rgb;
  float sigDist = median(msdf.r, msdf.g, msdf.b) - .5;
  float alpha = opacity * clamp(sigDist / fwidth(sigDist) + .5, 0., 1.);
  if (alpha < .01) discard;
  //gl_FragColor = vec4(color * power, alpha);

  vec3 black = vec3(0.0);
  vec3 white = vec3(1.0);
  vec3 red = vec3(1.0,0.0,0.0);
  vec3 orange = vec3(1.0, 0.5, 0.0);
  vec3 pink = vec3(1.0, 0.4, 0.8);
  vec3 blue = vec3(0.0, 0.2, 0.8);
  vec3 fontColor = orange;
  
  vec3  mainColor = vec3(orange);


  float pattern = patternCheker(vUv);
  float w = 0.5;
  float p2 = progress;
  p2 = mapRange(p2, 0.25, 1.0, -w, 1.0 );
  p2 = smoothstep(p2, p2 + w, vLayoutUv.x);
  float mix2 = clamp(2.0 * (p2) - pattern, 0.0, 1.0);
  //mainColor = mix(white, fontColor, 1.0 - mix2); //1-0 
  
  float maskPattern = patternBlot(vUv);
  vec4 finalColor = vec4(fontColor*maskPattern,min(alpha,maskPattern));
 
//Stroke
#ifdef STROKE
// Outset
  float sigDistOutset = sigDist + uStrokeOutsetWidth * 0.5;

// Inset
  float sigDistInset = sigDist - uStrokeInsetWidth * 0.5;

#ifdef IS_SMALL
  float outset = smoothstep(uThreshold - afwidth, uThreshold + afwidth, sigDistOutset);
  float inset = 1.0 - smoothstep(uThreshold - afwidth, uThreshold + afwidth, sigDistInset);
#else
  float outset = clamp(sigDistOutset / fwidth(sigDistOutset) + 0.5, 0.0, 1.0);
  float inset = 1.0 - clamp(sigDistInset / fwidth(sigDistInset) + 0.5, 0.0, 1.0);
#endif

float pStrokeIN = progress;
pStrokeIN = mapRange(pStrokeIN, 0.0, 0.2, -w, 1.0);
pStrokeIN = smoothstep(pStrokeIN, pStrokeIN + w, vLayoutUv.x);
float mixStrokeIN = 1.0-clamp(2.0 * (pStrokeIN), 0.0, 1.0); 

float pStrokeOUT = progress;
pStrokeOUT = mapRange(pStrokeOUT, 0.8, 1.0, 0.0, 1.0);
pStrokeOUT = smoothstep(pStrokeOUT, pStrokeOUT + w, vLayoutUv.x);
float mixStrokeOUT =  clamp(2.0 * (pStrokeOUT), 0.0, 1.0); 
float mixStroke = abs(mixStrokeIN - (1.0 - mixStrokeOUT));
vec3 strokeColor = mix(white,blue,mixStroke); 

// Border
  float border = outset * inset;
// Output
vec4 strokedFragColor = vec4(strokeColor, opacity * border * mixStroke);

gl_FragColor = strokedFragColor;

finalColor = mix(finalColor,strokedFragColor, step(0.5,border));

#endif
 
gl_FragColor = finalColor;

}
