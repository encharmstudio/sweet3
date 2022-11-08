import { Root } from "../../Root";
import { ContextualComponent } from "../Foundation/ContextualComponent";
import { createMesh } from "../../util/objectSugar";

import { TextGeometry } from "./TextGeometry";
import { MSDFMaterial } from "./MSDFMaterial";

export class MSDFText extends ContextualComponent {
  constructor({
    text = "Sample text",
    fontName = "openSansSauce",
    align = "left",
    position,
    rotation,
    scale = 1,
    lookAt,
    width = 1000,
    ptSize = 0.01,
    context,
  } = {}) {
    super({ context });

    this.mesh = createMesh({
      geometry: new TextGeometry({
        width,
        align,
        font: Root.assetsManager.get(fontName),
        text,
        ptSize,
      }),
      material: new MSDFMaterial({
        map: Root.assetsManager.get(fontName + ".texture"),
      }),
      position,
      lookAt,
      rotation,
      scale,
    });

    if (Root.settings.devMode) {
      console.log(
        text + " MSDF bounding box: ",
        this.mesh.geometry.computeBoundingBox()
      );
    }

    this.scene.add(this.mesh);
  }
  getMesh() {
    return this.mesh;
  }
}
