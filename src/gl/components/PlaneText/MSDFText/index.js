import { TextGeometry } from "./TextGeometry";
import { Root } from "../../../Root";
import { createMesh } from "../../../util/objectSugar";
import { MSDFMaterial } from "./MSDFMaterial";
import { defaults } from "../../../../data";
import {
  Object3D, 
} from "three";

export class MSDFText {
  constructor({
    text = "Sample text",
    fontName = "ATSURT", //AvenirNext // openSansSauce // BungeeSpice // doom
    align = "left",
    position,
    rotation,
    scale = 1,
    lookAt,
    width = 1000,
    ptSize = 0.01,
  } = {}) {
    //The
    const ATSURT = "ATSURT";
    const OPENSAUCESANSBOLD = "OPENSAUCESANSBOLD";
    const OPENSAUCESANSLIGTH = "OPENSAUCESANSLIGTH";

    this.position = position;
    this.lookAt = lookAt;
    this.rotation = rotation;
    this.align = align;
    this.scale = scale;
    this.width = width;
    this.ptSize = ptSize;
 

      this.text1 = "The";
      let position1 = position.slice(0);
      position1[1] = position1[1] + 0.2;
      position1[0] = position1[0] - 0.45;
      let lookAt1 = lookAt.slice(0);
      lookAt1[1] = lookAt1[1] + 0.2;
      lookAt1[0] = lookAt1[0] - 0.45;
      this.mesh1 = createMesh({
        geometry: new TextGeometry({
          width,
          align,
          font: Root.assetsManager.get(OPENSAUCESANSLIGTH),
          text: this.text1,
          ptSize,
        }),
        material: new MSDFMaterial({
          map: Root.assetsManager.get(OPENSAUCESANSLIGTH + ".texture"),
        }),
        position: position1,
        lookAt: lookAt1,
        rotation,
        scale,
      });

      // 
      // this.mesh1 = this.createMeshChunk(
      //   "The",
      //   [0.45, 0.2, 0.0],
      //   [1.0, 1.0, 1.0],
      //   OPENSAUCESANSLIGTH
      // );

    // // Beauty
    // // Nothing
    this.text2 = "Beauty";
    let position2 = position.slice(0);
    position2[1] = position2[1] - 0.3;
    position2[0] = position2[0] - 0.1;
    let lookAt2 = lookAt.slice(0);
    lookAt2[1] = lookAt2[1] - 0.3;
    lookAt2[0] = lookAt2[0] - 0.1;

    this.mesh2 = createMesh({
      geometry: new TextGeometry({
        width,
        align,
        font: Root.assetsManager.get(OPENSAUCESANSBOLD),
        text: this.text2,
        ptSize,
      }),
      material: new MSDFMaterial({
        map: Root.assetsManager.get(OPENSAUCESANSBOLD + ".texture"),
      }),
      position: position2,
      lookAt: lookAt2,
      rotation,
      scale,
    });

    this.text3 = "Nothing";

    let position3 = position.slice(0);
    position3[1] = position3[1] - 0.8;
    position3[0] = position3[0] - 0.02;
    let lookAt3 = lookAt.slice(0);
    lookAt3[1] = lookAt3[1] - 0.8;
    lookAt3[0] = lookAt3[0] - 0.02;

    this.mesh3 = createMesh({
      geometry: new TextGeometry({
        width,
        align,
        font: Root.assetsManager.get(OPENSAUCESANSBOLD),
        text: this.text3,
        ptSize,
      }),
      material: new MSDFMaterial({
        map: Root.assetsManager.get(OPENSAUCESANSBOLD + ".texture"),
      }),
      position: position3,
      lookAt: lookAt3,
      rotation,
      scale,
    });

    // //of

    this.text4 = "of";
    let position4 = position.slice(0);
    position4[0] = position4[0] + 1.0;
    position4[1] = position4[1] - 0.3;
    let lookAt4 = lookAt.slice(0);
    lookAt4[0] = lookAt4[0] + 1.0;
    lookAt4[1] = lookAt4[1] - 0.3;

    this.mesh4 = createMesh({
      geometry: new TextGeometry({
        width,
        align,
        font: Root.assetsManager.get(OPENSAUCESANSLIGTH),
        text: this.text4,
        ptSize,
      }),
      material: new MSDFMaterial({
        map: Root.assetsManager.get(OPENSAUCESANSLIGTH + ".texture"),
      }),
      position: position4,
      lookAt: lookAt4,
      rotation,
      scale,
    });

    //You create all the impression.
    this.text5 = "You create all the impression.";
    let position5 = position.slice(0);
    position5[1] = position5[1] - 1.2;
    position5[0] = position5[0] - 1.2;
    let lookAt5 = lookAt.slice(0);
    lookAt5[1] = lookAt5[1] - 1.2;
    lookAt5[0] = lookAt5[0] - 1.2;

    this.mesh5 = createMesh({
      geometry: new TextGeometry({
        width: 2000,
        align,
        font: Root.assetsManager.get(ATSURT),
        text: this.text5,
        ptSize,
      }),
      material: new MSDFMaterial({
        map: Root.assetsManager.get(ATSURT + ".texture"),
      }),
      position: position5,
      lookAt: lookAt5,
      rotation,
      scale: [0.4, 0.4, 0.4],
    });

    //Act.
    this.text6 = "Act.";
    let position6 = position.slice(0);
    position6[1] = position6[1] - 1.2;
    position6[0] = position6[0] + 5.2;
    let lookAt6 = lookAt.slice(0);
    lookAt6[1] = lookAt6[1] - 1.2;
    lookAt6[0] = lookAt6[0] + 5.2;
    this.mesh6 = createMesh({
      geometry: new TextGeometry({
        width,
        align,
        font: Root.assetsManager.get(ATSURT),
        text: this.text6,
        ptSize,
      }),
      material: new MSDFMaterial({
        map: Root.assetsManager.get(ATSURT + ".texture"),
      }),
      position: position6,
      lookAt: lookAt6,
      rotation,
      scale: [0.4, 0.4, 0.4],
    });

    //hello∅encharm.studio
    this.text7 = "hello∅encharm.studio";
    let position7 = position.slice(0);
    position7[1] = position7[1] - 1.8;
    position7[0] = position7[0] + 4.6;
    let lookAt7 = lookAt.slice(0);
    lookAt7[1] = lookAt7[1] - 1.8;
    lookAt7[0] = lookAt7[0] + 4.6;
    this.mesh7 = createMesh({
      geometry: new TextGeometry({
        width,
        align,
        font: Root.assetsManager.get(ATSURT),
        text: this.text7,
        ptSize,
      }),
      material: new MSDFMaterial({
        map: Root.assetsManager.get(ATSURT + ".texture"),
      }),
      position: position7,
      lookAt: lookAt7,
      rotation,
      scale: [0.4, 0.4, 0.4],
    });

    this.textGroup = new Object3D();
    this.textGroup.add(this.mesh1);
    this.textGroup.add(this.mesh2);
    this.textGroup.add(this.mesh3);
    this.textGroup.add(this.mesh4);
    this.textGroup.add(this.mesh5);
    this.textGroup.add(this.mesh6);
    this.textGroup.add(this.mesh7);

    if (defaults.devMode) {
      console.log(
        this.mesh1 + " MSDF bounding box: ",
        this.mesh1.geometry.computeBoundingBox()
      );
    }

    Root.scene.add(this.textGroup);
  }

  createMeshChunk(text, pos, scale, fontName) {
    let position = this.position.slice(0);
    position[1] = position[1] - pos[1];
    position[0] = position[0] + pos[0];
    let lookAt = this.lookAt.slice(0);
    lookAt[1] = lookAt[1] - pos[1];
    lookAt[0] = lookAt[0] + pos[0];

    let mesh = createMesh({
      geometry: new TextGeometry({
        width: this.width,
        align: this.align,
        font: Root.assetsManager.get(fontName),
        text: text,
        ptSize: this.ptSize,
      }),
      material: new MSDFMaterial({
        map: Root.assetsManager.get(fontName + ".texture"),
      }),
      position,
      lookAt,
      rotation: this.rotation,
      scale,
    });

    return mesh;
  }

}
