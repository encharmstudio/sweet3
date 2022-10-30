import { PerspectiveCamera, Scene } from "three";
import { Root } from "./Root";

export class Context {
  constructor({
    scene = new Scene(),
    camera = new PerspectiveCamera(
      Root.settings.camera.fov,
      Root.screen.aspect,
      Root.settings.camera.near,
      Root.settings.camera.far,
    ),
    renderSettings = {},
  } = {}) {
    this.scene = scene;
    this.camera = camera;
    this.renderSettings = renderSettings;
  }
}