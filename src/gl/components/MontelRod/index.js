import { BoxGeometry, Quaternion, Vector2, Vector3 } from "three";
import { EventBus } from "../../global/EventDispatcher";
import { createMesh } from "../../util/objectSugar";
import { Material } from "./Material";
import { Root } from "../../Root";
import { ContextualComponent } from "../Foundation/ContextualComponent";

export class MontelRod extends ContextualComponent {
  constructor({
    width = 20.0,
    height = 40.0,
    depth = 20.0,
    widthSegments = 120,
    heightSegments = 120,
    depthSegments = 120,
    context,
  } = {}) {
    super({ context });
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.widthSegments = widthSegments;
    this.heightSegments = heightSegments;
    this.depthSegments = depthSegments;

    // this.mesh = createMesh({
    //   name: "Kernel",
    //   geometry: new BoxGeometry(
    //     this.width,
    //     this.height,
    //     this.depth,
    //     this.widthSegments,
    //     this.heightSegments,
    //     this.depthSegments
    //   ),
    //   material: new Material(),
    // });

    let mesh = Root.assetsManager.get("kernel");
    this.mesh = mesh.scene.children[0];

    this.mesh.geometry.computeTangents();

    this.mesh.position.set(-3.0, 1.0, 0.0);
    this.mesh.geometry.scale(0.1, 0.1, 0.1);
    this.mesh.geometry.computeBoundingBox();
    const maxY = this.mesh.geometry.boundingBox.max.y;
    const minY = this.mesh.geometry.boundingBox.min.y;

    const posY = new Vector2(minY, maxY);

    this.mesh.material = new Material(posY);

    this.scene.add(this.mesh);

    EventBus.on("frame", this.onFrame);
  }

  onFrame = ({ ds }) => {
    this.mesh.rotation.y += ds * 0.1;
  };
}
