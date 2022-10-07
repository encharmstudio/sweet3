import { SphereGeometry , Vector3} from "three";
import { EventBus } from "../../global/EventDispatcher";
import { Root } from "../../Root";
import { createMesh } from "../../util/objectSugar";
//import { BlurPass } from "./BlurPass";
import { Material } from "./Material";

export class OrganicSphere {
  constructor({
    radius = 7.0,
    widthSegments = 125.0,
    heightSegments = 8.0,   
  } = {}) {
    this.radius = radius;
    this.widthSegments = widthSegments;
    this.heightSegments = heightSegments;
    // this.geometry = new SphereGeometry(this.radius, this.widthSegments, this.heightSegments);
    // this.geometry.computeTangents();

    this.mesh = createMesh({
      name: "OrganicSphere",
      geometry: new SphereGeometry(this.radius, this.widthSegments, this.heightSegments),
      material: new Material(),
    });
    this.mesh.geometry.computeTangents();
    
    this.mesh.position.set(-3.0,1.0,0.0);
    this.mesh.geometry.scale(0.1,0.1,0.1);
    Root.scene.add(this.mesh);

    // EventBus.on("beforeRender", this.onBeforeRender);
    EventBus.on("frame", this.onFrame);
  }

  // onBeforeRender = () => {}
  onFrame = ({ seconds, ds }) => {

    //this.mesh.position.set(0.0, Math.sin(seconds), 0.0);
    this.mesh.rotation.y += ds * 0.5;
  }
}

