import { bind } from "../../global/Uniforms";

export class Dither {
  out = {
    uniforms: {
      seconds: bind("seconds"),
    },
    declarations: /*glsl*/`
uniform float seconds;
float rand(vec2 c) {
  return fract(sin(dot(fract(c), vec2(12.9898, 78.233))) * 43758.5453);
}

`,
    inject: /*glsl*/`{
      float rnd = rand(fract(vUv + seconds));
      color += rnd * .03 - .015;
    }`
  };
}