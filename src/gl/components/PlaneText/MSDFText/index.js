import { TextGeometry } from "./TextGeometry";
import { Root } from "../../../Root";
import { createMesh } from "../../../util/objectSugar";
import { MSDFMaterial } from "./MSDFMaterial";
import { defaults } from "../../../../data";
import {
  PlaneGeometry,
  Group,
  MeshBasicMaterial,
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
    this.width = width;
    this.ptSize = ptSize;
    this.align = align;

    this.mesh1 = this.createMeshChunk(
      "The",
      [0.837, -0.554, 0.0],
      1.02,
      OPENSAUCESANSLIGTH
    );

    this.mesh2 = this.createMeshChunk(
      "Beauty",
      [1.2009, -0.04, 0.0],
      1.02,
      OPENSAUCESANSBOLD
    );

    this.mesh3 = this.createMeshChunk(
      "Nothing",
      [1.282, 0.475, 0.0],
      1.02,
      OPENSAUCESANSBOLD
    );

    this.mesh4 = this.createMeshChunk(
      "of",
      [2.235, -0.04, 0.0],
      1.03,
      OPENSAUCESANSLIGTH
    );

    this.width = 2000;
    this.mesh5 = this.createMeshChunk(
      "You create all the impression.",
      [0.2, 0.82, 0.0],
      0.39,
      ATSURT
    );

    this.width = 1000;
    this.mesh6 = this.createMeshChunk("Act.", [5.89, 0.805, 0.0], 0.39, ATSURT);
    this.mesh7 = this.createMeshChunk(
      "hello∅encharm.studio",
      [5.23, 1.415, 0.0],
      0.39,
      ATSURT
    );

    this.groupText = new Group();
    this.groupText.add(this.mesh1);
    this.groupText.add(this.mesh2);
    this.groupText.add(this.mesh3);
    this.groupText.add(this.mesh4);
    this.groupText.add(this.mesh5);
    this.groupText.add(this.mesh6);
    this.groupText.add(this.mesh7);

    if (defaults.devMode) {
      // console.log(
      //   this.groupText + " MSDF bounding box: ",
      //   //this.groupText.computeBoundingBox();
      // );
    }

    Root.scene.add(this.groupText);
  }

  createMeshChunk(text, pos, scale, fontName) {
    let position = this.position.slice(0);
    position[1] = position[1] - pos[1];
    position[0] = position[0] + pos[0];

    let mesh = createMesh({
      geometry: new TextGeometry({
        width: this.width,
        align: this.align,
        font: Root.assetsManager.get(fontName),
        text,
        ptSize: this.ptSize,
      }),
      material: new MSDFMaterial({
        map: Root.assetsManager.get(fontName + ".texture"),
      }),
      position,
      scale: [scale, scale, scale],
    });

    return mesh;
  }
}
