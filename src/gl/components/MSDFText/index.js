import { Root } from "../../Root";
import { ContextualComponent } from "../Foundation/ContextualComponent";
import { createMesh } from "../../util/objectSugar";

import { TextGeometry } from "./TextGeometry";
import { MSDFMaterial } from "./MSDFMaterial";

export class MSDFText extends ContextualComponent {

  static get AlignLeft() { return "left"; }
  static get AlignCenter() { return "center"; }
  static get AlignRight() { return "right"; }

  static get OriginCenter() { return "center"; }
  static get OriginLeft() { return "left"; }
  static get OriginRight() { return "right"; }
  static get OriginTop() { return "top"; }
  static get OriginBottom() { return "bottom"; }

  constructor({
    text = "Sample text",
    fontName = "openSansSauce",
    align = MSDFText.AlignLeft,
    originAtX = align,
    originAtY = MSDFText.OriginBottom,
    maxWidth = undefined,
    fontSize = 0.1,

    position,
    rotation,
    scale = 1,
    lookAt,

    context,
  } = {}) {
    super({ context });

    this.mesh = createMesh({
      geometry: new TextGeometry({
        font: Root.assetsManager.get(fontName),
        text,
        fontSize,
        align,
        width: maxWidth,
        originAtX,
        originAtY,
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
      console.log(text + " MSDF bounding box: ", this.mesh.geometry.computeBoundingBox());
    }

    this.scene.add(this.mesh);
  }
}