import { BackSide, Mesh, MeshBasicMaterial, SphereGeometry } from "three";
import { Root } from "../Root";

export class BackgroundColor {
  constructor() {
    const color = Root.settings.backgroundColor;

    Root.scene.add(
      new Mesh(
        new SphereGeometry(1e3),
        new MeshBasicMaterial({
          color,
          side: BackSide,
        })
      )
    );
  }
}