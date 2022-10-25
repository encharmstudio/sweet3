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
uniform float time;

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

float patternCheker(vec2 vUv) {
  vec2 st = vUv;
  st *= 50.0; // Scale the coordinate system by 10
  vec2 ipos = floor(st);  // get the integer coords
  vec2 fpos = fract(st);  // get the fractional coords
    // Assign a random value based on the integer coord
  return random(ipos);

}

float patternLines(vec2 uv) {

  float p = progress;
  vec2 st = vec2(fract(uv.x * 10.0), uv.y);

  float p1 = mapRange(p, 0.0, 0.5, 0.0, 1.0);
  float p2 = mapRange(p, 0.5, 1.0, 0.0, 1.0);

  float mask = 0.0;
  if(st.x < 0.5) {
    if(st.y < p1) {
      mask = 1.0;
    }
  } else {
    if(st.y > (1.0 - p1)) {
      mask = 1.0;
    }
  }

  if(progress >= 0.5) {
   // mask = 1.0;
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

float patternBlot(vec2 uv) {
  float mask = 0.0;
  float p = progress;
  if(progress <= 0.5) {
    p = mapRange(p, 0.0, 0.5, 0.0, 1.0);
    mask = step(1.0 - p, fbm(uv * 5.0));
  } else {
    p = mapRange(p, 0.5, 1.0, 0.0, 1.0);
    mask = step(p, fbm(uv * 5.0));
  }

  return mask;
}

vec3 patternFire(vec2 uv) {

  const float speed = 0.001;
  const float detals = 1.3;
  const float force = 0.4;
  const float shift = 0.0;
  const float scalaFactor = 100.0;
  //noise 

  vec2 xyFast = vec2(uv.x * scalaFactor, uv.y * scalaFactor - time * speed);
  //vec2 xyFast = vec2(uv.x, uv.y);
  float noise1 = fbm(xyFast);
  float noise2 = force * (fbm(xyFast + noise1 + time * speed) - shift);

  float nnoise1 = force * (fbm(vec2(noise1, noise2)));
  float nnoise2 = fbm(vec2(noise2, noise1));

  //cg
  const vec3 red = vec3(0.9, 0.4, 0.2);
  const vec3 yellow = vec3(0.9, 0.9, 0.0);
  const vec3 darkRed = vec3(0.5, 0.0, 0.0);
  const vec3 dark = vec3(0.1, 0.1, 0.1);
  vec3 c1 = mix(red, darkRed, nnoise1 + shift);
  vec3 c2 = mix(yellow, dark, nnoise2);

  vec3 gradient = vec3(1.0) - vec3(vLayoutUv.y) * 0.1 * progress;
  vec3 c = c1 + c2 - gradient - noise2;

  return c;
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
  vec3 brown = vec3(0.6, 0.3, 0.0);
  vec3 fontColor = blue;
  
  vec4 finalColor = vec4(patternFire(vUv), 1.0);
  //vec3  mainColor = vec3(orange);


  // float pattern = patternCheker(vUv);
   //float w = 0.5;
  // float p0 = progress;
  // p0 = mapRange(p0,0.0,0.25, -w ,1.0);  
  // p0 = smoothstep(p0, p0 + w,vLayoutUv.x);
  // float mix0 = clamp(2.0 * (1.0 - p0) - pattern, 0.0, 1.0);

  // float p1 = progress;
  // p1 = mapRange(p1, 0.0, 0.5, -w, 1.0);
  // p1 = smoothstep(p1, p1 + w, vLayoutUv.x);
  // float mix1 = clamp(2.0 * (1.0 - p1)- pattern , 0.0, 1.0);

  // float p2 = progress;
  // p2 = mapRange(p2, 0.5, 0.75, -w, 1.0 );
  // p2 = smoothstep(p2, p2 + w, vLayoutUv.x);
  // float mix2 = clamp(2.0 * (p2) - pattern, 0.0, 1.0);

  // float p3 = progress;
  // p3 = mapRange(p3, 0.75, 1.0, -w, 1.0 );
  // p3 = smoothstep(p3, p3 + w, vLayoutUv.x);
  // float mix3 = clamp(2.0 * (p3) - pattern, 0.0, 1.0);

  // float fade = 1.0;
  // if(progress <= 0.5){
  //  mainColor = mix(fontColor, white, mix1);//0-1
  //  fade = mix0; //0-1
  // }else{
  //  mainColor = mix(white, fontColor, 1.0 - mix2); //1-0 
  //  fade =  mix3; //1-0
  // }
  // float mainmix = abs(mix1 - (1.0 - mix2));
  // mainColor = mix(blue, white, mainmix);//0-1 
  // fade = abs(mix0 - (1.0-mix3)); //0-1
  //vec4 finalColor = vec4(mainColor,min(alpha,fade));
  //vec4 finalColor = vec4(vec3(vLayoutUv.x,vLayoutUv.y,0.0), min(alpha, fade));
  //vec4 finalColor = vec4(patternFire(vLayoutUv), 1.0);
 
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

float pStroke = progress;
  pStroke = mapRange(pStroke, 0.1, 1.0, 0.0, 1.0);
  pStroke = smoothstep(pStroke, pStroke + 0.5, vLayoutUv.x);
  float mixStroke = clamp(2.0 * (pStroke), 0.0, 1.0);
  vec3 strokeColor = mix(vec3(1.0, 1.0, 1.0), vec3(0.8, 0.8, 0.8), mixStroke); 

// Border
  float border = outset * inset;
// Output
  vec4 strokedFragColor = vec4(strokeColor, opacity * border);

  gl_FragColor = strokedFragColor;

  finalColor = mix(finalColor, strokedFragColor, step(0.5, border));

#endif
 
gl_FragColor = vec4(1.0,1.0, 1.0, 1.0);

}
