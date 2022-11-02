import { ShaderMaterial } from "three";

import vertexShader from "./shader.vert";
import fragmentShader from "./shader.frag";
import { bind } from "../../../global/Uniforms";

export class Material extends ShaderMaterial {
  constructor({ map } = {}) {
    super({
      uniforms: {
        map: { value: map },
        time: bind("time"),
      },
      vertexShader,
      fragmentShader,
    });
  }
}