import { ShaderMaterial, WebGLRenderTarget } from "three";
import { Root } from "../../../Root";
import { bind, provide } from "../../../global/Uniforms";
import { EventBus } from "../../../global/EventDispatcher";
import { Pipeline } from "../../Pipeline";

import vertexShader from "../../../shaderLib/uv.vert";
import fragmentShader from "./fxaa.frag";

export class FXAA {
  constructor() {

    this.material = new ShaderMaterial({
      uniforms: {
        map: bind("post.screen"),
        resolution: { value: Root.screen.iv2 },
      },
      vertexShader,
      fragmentShader,
    });

    this.renderTarget = new WebGLRenderTarget(Root.screen.x, Root.screen.y, Pipeline.rtParameters);

    provide("post.fxaa.map", this.renderTarget.texture);

    EventBus.on("resize", this.onResize);
  }

  render = (renderer, quad, cam) => {
    quad.material = this.material;
    renderer.setRenderTarget(this.renderTarget);
    renderer.render(quad, cam);
    
    provide("post.screen", this.renderTarget.texture);
  };

  onResize = ({ x, y }) => {
    this.renderTarget.setSize(x, y);
  };
}