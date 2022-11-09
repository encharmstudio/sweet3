import { SphereGeometry } from "three";
import { EventBus } from "../../global/EventDispatcher";
import { Root } from "../../Root";
import { createMesh } from "../../util/objectSugar";
import { Material } from "./Material";
import { ContextualComponent } from "../Foundation/ContextualComponent";

export class OrganicSphere extends ContextualComponent {
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

    this.mesh = createMesh({
      name: "OrganicSphere",
      geometry: new SphereGeometry(
        this.radius,
        this.widthSegments,
        this.heightSegments
      ),
      material: new Material(),
    });
    this.mesh.geometry.computeTangents();

    this.mesh.position.set(-3.0, 1.0, 0.0);
    this.mesh.geometry.scale(0.1, 0.1, 0.1);
    this.scene.add(this.mesh);

    EventBus.on("frame", this.onFrame);
  }

  onFrame = ({ seconds, ds }) => {
    this.mesh.rotation.y += ds * 0.5;
  };
}
