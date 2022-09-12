import { Color, DoubleSide, ShaderMaterial } from "three";

import vertexShader from "./msdf.vert";
import fragmentShader from "./msdf.frag";

export class MSDFMaterial extends ShaderMaterial {
  constructor({
    map,
    color = 0xffffff,
    opacity = 1,
    power = 1,
  } = {}) {
    super({
      uniforms: {
        map: { value: map },
        color: { value: new Color(color) },
        power: { value: power },
        opacity: { value: opacity },
      },
      side: DoubleSide,
      transparent: true,
      vertexShader,
      fragmentShader,
    });
  }
}