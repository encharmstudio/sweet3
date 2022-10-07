import {
  WebGLRenderTarget,
  PerspectiveCamera,
  Scene,
  Color,
  TorusKnotGeometry,
  Mesh,
} from "three";

import { Root } from "../../Root";
import { EventBus } from "../../global/EventDispatcher";
import { Material } from "./Material";
import { MSDFText } from "./MSDFText";

export class EndLess{
  constructor() {
    this.MSDFText = new MSDFText({
      text: "ENDLESS",
      align: "center",
      width: 500,
      ptSize: 0.01,
      position: [-2.5, -0.6, -3.5],
      lookAt: [-2.5, -0.6, 1],
    });

    // Render Target setup
    this.rt = new WebGLRenderTarget(window.innerWidth, window.innerHeight);
    this.rtCamera = new PerspectiveCamera(45, 1, 0.1, 1000);
    this.rtCamera.position.z = 2.5;
    this.rtScene = new Scene();
    this.rtScene.background = new Color("#000000");
    this.MSDFText.mesh.scale.set(1.0, 2.0, 1.0);
    this.rtScene.add(this.MSDFText.mesh);

    // main Mesh setup
    this.geometry = new TorusKnotGeometry(3, 1, 768, 3, 4, 3);
    this.material = new Material({
      map: this.rt.texture,
    });
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.set(0.0, 2.0, 0.0);
    this.mesh.scale.set(0.2, 0.2, 0.2);

    Root.scene.add(this.mesh);

    EventBus.on("frame", this.onFrame);
  }

  onFrame = ({ seconds, ds }) => {
    // Draw Render Target
    Root.renderPipe.renderer.setRenderTarget(this.rt);
    Root.renderPipe.renderer.render(this.rtScene, this.rtCamera);
    Root.renderPipe.renderer.setRenderTarget(null);
  };
}
