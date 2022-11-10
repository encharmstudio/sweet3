import { Root } from "../../Root";
import { Material } from "./Material";
import { ContextualComponent } from "../Foundation/ContextualComponent";

export class Twist extends ContextualComponent {
  constructor({
    radius = 7.0,
    widthSegments = 125.0,
    heightSegments = 8.0,
    context,
  } = {}) {
    super({ context });
    this.radius = radius;
    this.widthSegments = widthSegments;
    this.heightSegments = heightSegments;

    let mesh = Root.assetsManager.get("cross");
    this.mesh = mesh.scene.children[0];
    this.mesh.material = new Material();

    this.mesh.position.set(-5.0, 2.0, 0.0);
    this.mesh.rotateZ(3.1415 * 0.5);
    this.mesh.scale.set(0.5, 0.5, 0.5);
    this.scene.add(this.mesh);
  }
}
