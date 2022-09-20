import { TextGeometry } from "./TextGeometry";
import { Root } from "../../Root";
import { createMesh } from "../../util/objectSugar";
import { MSDFMaterial } from "./MSDFMaterial";
import { defaults } from "../../../data";

export class MSDFText {
  constructor({
    text = "Sample text",
    fontName = "AvenirNext", //AvenirNext // openSansSauce // BungeeSpice
    align = "left",
    position,
    rotation,
    scale = 1,
    lookAt,
    width = 1000,
    ptSize = 0.01,
  } = {}) {
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

    if (defaults.devMode) {
      console.log(
        text + " MSDF bounding box: ",
        this.mesh.geometry.computeBoundingBox()
      );
    }

    Root.scene.add(this.mesh);
  }
}