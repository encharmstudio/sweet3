import { RGFormat, Vector2 } from "three";
import { Root } from "../../Root";
import { createDFBO, createProgram, renderFBO } from "../../util/gpgpu";
import { bind, provide } from "../../global/Uniforms";
import { EventBus } from "../../global/EventDispatcher";

import vertex from "./sim.vert";
import fragment from "./sim.frag";

export class SimpleFluidSim {
  constructor(settings) {
    this.settings = settings || Root.settings.fluid;
    if (this.settings.isFullScreen) {
      this.settings.width = Root.screen.x;
      this.settings.height = Root.screen.y;
    }

    const aspect = this.settings.width / this.settings.height,
          aspectV2 = new Vector2();
    aspectV2.x = aspect > 1 ? aspect : 1;
    aspectV2.y = aspect > 1 ? 1 : aspect;

    this.fbo = createDFBO({
      width: this.settings.width,
      height: this.settings.height,
      format: RGFormat,
    });

    this.program = createProgram({
      uniforms: {
        aspect: { value: aspectV2 },
        texelSize: { value: new Vector2(1 / this.settings.width, 1 / this.settings.height) },
        pointer: bind("pointer.v3"),
        seconds: bind("seconds"),
        map: { value: null },
      },
      vertex,
      fragment,
    });

    EventBus.on("beforeRender", this.update);
    EventBus.on("resize", this.onResize);
  }

  update = () => {
    this.program.material.uniforms.map.value = this.fbo.read.texture;
    
    renderFBO(this.program, this.fbo);

    provide("simpleFluid", this.fbo.read.texture);
    EventBus.dispatch("simpleFluid", this.fbo.read.texture);
  };

  onResize = ({ x, y }) => {
    if (this.settings.isFullScreen) {
      this.fbo.read.setSize(x, y);
      this.fbo.write.setSize(x, y);
    }
  };
}