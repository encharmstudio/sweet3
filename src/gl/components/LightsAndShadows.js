import { Root } from "../Root";
import { ContextualComponent } from "./Foundation/ContextualComponent";
import { objectWrap } from "../util/objectSugar";
import { AmbientLight, SpotLight, SpotLightHelper } from "three";

export class LightsAndShadows extends ContextualComponent {
  constructor({
    context,
  } = {}) {
    super({ context });

    const spotLight = objectWrap({
      object: new SpotLight(0xffffff, 1, 0, Math.PI / 6, .5),
      position: [0, 10, 5],
      lookAt: 0,
    });
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 512;
    spotLight.shadow.mapSize.height = 512;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 20;
    spotLight.shadow.focus = 1;

    this.scene.add(
      spotLight,
      new AmbientLight(0xffffff, 1),
    );

    if (Root.settings.devMode) {
      const spotLightHelper = new SpotLightHelper(spotLight);
      this.scene.add(spotLightHelper);
    }
  }
}