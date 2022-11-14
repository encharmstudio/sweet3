import { EventBus } from "../../global/EventDispatcher";
import { guiSettingsBind } from "../../global/GUI";
import { ContextualComponent } from "../Foundation/ContextualComponent";
import {
  PlaneGeometry,
  MeshBasicMaterial,
  DoubleSide,
  Mesh,
  ShaderMaterial,
  Vector3,
  Object3D,
} from "three";

import vertexShader from "./shader.vert";
import fragmentShader from "./shader.frag";
import { bind } from "../../global/Uniforms";

export class Greta extends ContextualComponent {
  constructor({ context } = {}) {
    super({ context });

    this.widthSegments = 10;
    this.heightSegments = 10;
    this.uShear = 0.0;
    this.wave = 1.0;

    this.geometry = new PlaneGeometry(8, 4, 10, 10);
    this.material = new ShaderMaterial({
      uniforms: {
        wave: { value: this.wave },
        uLimitCurve: guiSettingsBind("uLimitCurve", 0, 1),
        uShear: { value: this.uShear },
      },
      vertexShader,
      fragmentShader,
    });

    this.material.wireframe = true;
    const imgCount = 1;
    this.t = guiSettingsBind("progress", -Math.PI * 2.0, Math.PI * 2.0);
    this.imgContaner = new Object3D();

    this.mesh = new Mesh(this.geometry, this.material);

    this.imgContaner.position.set(
      5 * Math.cos(this.t.value),
      1 * this.t.value,
      5 * Math.sin(this.t.value)
    );

    let v = new Vector3(
      5 * Math.cos(this.t.value + 0.01),
      1 * this.t.value + 0.01,
      5 * Math.sin(this.t.value + 0.01)
    );

    this.mesh.rotation.y = -this.t.value + Math.PI * 0.5;
    this.imgContaner.lookAt(v);
    this.imgContaner.add(this.mesh);
   
    this.scene.add(this.imgContaner);

    document.addEventListener("wheel", this.eventHandler);

    EventBus.on("frame", this.onFrame);
  }

  onFrame = ({ seconds, ds }) => {
    
    if (this.uShear > 0 && this.direction) {
      this.uShear -= 2.0 * ds;
      this.mesh.material.uniforms.uShear.value = this.uShear;
      this.mesh.material.uniforms.needsUpdate = true;
    } else if (this.uShear < 0 && !this.direction) {
      this.uShear += 2.0 * ds;
      this.mesh.material.uniforms.uShear.value = this.uShear;
      this.mesh.material.uniforms.needsUpdate = true;
    } else {
      this.mesh.material.uniforms.uShear.value = 0.0;
      this.mesh.material.uniforms.needsUpdate = false;
    }
    
    if (this.wave < 1.0){
      this.wave += 1.0 * ds; 
      this.mesh.material.uniforms.wave.value = this.wave;
      this.mesh.material.uniforms.needsUpdate = true;
      console.log("this.wave = " + this.wave);
    }
    

  };

  eventHandler = (e) => {
   // console.log(e.deltaY);
    const shearOld = this.uShear;
    this.uShear += e.deltaY / 1000.0;
    this.direction = shearOld < this.uShear ? true : false;
    this.wave = 0.0;

    this.t.value += e.deltaY / 1000.0;

    this.imgContaner.position.set(
      5 * Math.cos(this.t.value),
      1 * this.t.value,
      5 * Math.sin(this.t.value)
    );

    let v = new Vector3(
      5 * Math.cos(this.t.value + 0.01),
      1 * this.t.value + 0.01,
      5 * Math.sin(this.t.value + 0.01)
    );

    this.imgContaner.lookAt(v);
    // this.imgContaner.position.y += 4.0;
  };

  // Easing(){

  // }
}
