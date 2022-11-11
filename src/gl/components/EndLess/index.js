import {
  WebGLRenderTarget,
  PerspectiveCamera,
  Scene,
  Color,
  TorusKnotGeometry,
  Mesh,
} from "three";

import { Root } from "../../Root";
import { ContextualComponent } from "../Foundation/ContextualComponent";
import { Material } from "./Material";
import { MSDFText } from "../MSDFText";
import { Context } from "../../Context";
import { objectWrap } from "../../util/objectSugar";

export class EndLess extends ContextualComponent {
  constructor({ context } = {}) {
    super({ context });
    this.textContext = new Context({
      camera: objectWrap({
        object: new PerspectiveCamera(45, 1, 0.1, 1000),
        position: [0.0, 0.0, 2.5],
      }),
    });
    this.MSDFText = new MSDFText({
      text: "ENDLESS",
      align: "center",
      width: 500,
      ptSize: 0.01,
      position: [-2.5, -0.6, -3.5],
      lookAt: [-2.5, -0.6, 1],
      context: this.textContext,
    });

    // Render Target setup
    this.rt = new WebGLRenderTarget(512, 512);

    // main Mesh setup
    this.geometry = new TorusKnotGeometry(3, 1, 768, 3, 4, 3);
    this.material = new Material({
      map: this.rt.texture,
    });
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.set(5.0, 2.0, 0.0);
    this.mesh.scale.setScalar(0.2);

    this.scene.add(this.mesh);

    Root.pipeline.renderer.setRenderTarget(this.rt);
    Root.pipeline.renderer.render(
      this.textContext.scene,
      this.textContext.camera
    );
  
    //EventBus.on("frame", this.onFrame);
  }

  onFrame = ({ seconds, ds }) => {
    // Draw Render Target
    // Root.renderPipe.renderer.setRenderTarget(this.rt);
    // Root.renderPipe.renderer.render(this.rtScene, this.rtCamera);
    // Root.renderPipe.renderer.setRenderTarget(null);
  };
}
