import { ShaderMaterial, Vector3, BackSide } from "three";
import { bind } from "../../../global/Uniforms";

import vertexShader from "./shader.vert";
import fragmentShader from "./shader.frag";

export class Material extends ShaderMaterial {
  constructor() {
    super({
      depthTest: false,
      side: BackSide,
      uniforms: {
        time: bind("time"),
        positionsMap: bind("lines.positions"),
        normalsMap: bind("lines.normals"),
        texelSize: bind("lines.fbo.texelSize"),
        up: { value: new Vector3(0.0, 0.0, 1.0) },
      },
      vertexShader,
      fragmentShader,
    });
    this.transparent = true;
  }
}
