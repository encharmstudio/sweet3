import { Color, DoubleSide, ShaderMaterial } from "three";
import { guiSettingsBind } from "../../../global/GUI";
import { bind } from "../../../global/Uniforms";

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
        progress: guiSettingsBind("progress", 0, 1),
        uStrokeOutsetWidth: { value: 0.5 },
        uStrokeInsetWidth: { value: 0.5 },
        uThreshold: { value: 0.05 },
        time: bind("time"),
      },
      side: DoubleSide,
      transparent: true,
      vertexShader,
      fragmentShader,
    });
  }
}