import { Root } from "../Root";
import { ContextComponent } from "./Foundation/ContextComponent";
import { BackSide, Mesh, MeshBasicMaterial, SphereGeometry } from "three";

export class BackgroundColor extends ContextComponent {
  constructor({
    context,
  } = {}) {
    super({ context });

    const color = Root.settings.backgroundColor;

    this.scene.add(
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