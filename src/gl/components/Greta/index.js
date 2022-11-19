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
  Group,
  Raycaster,
  Vector2,
  Uniform,
} from "three";

import vertexShader from "./shader.vert";
import fragmentShader from "./shader.frag";
import { bind } from "../../global/Uniforms";
import { Root } from "../../Root";

export class Greta extends ContextualComponent {
  constructor({ context } = {}) {
    super({ context });

    //Settings
    this.widthSegments = 10;
    this.heightSegments = 10;
    this.uShear = 0.0;
    this.wave = 1.0;
    this.heightHelix = 1.0;

    //Raycaster
    this.targetV2 = new Vector2();
    this.raycaster = new Raycaster();

    //this.material.wireframe = true;
    const imgCount = 8;
    this.t = guiSettingsBind("progress", -Math.PI * 2.0, Math.PI * 2.0);
    this.imgGroup = new Group();

    //
    for (let index = 0; index < imgCount; index++) {
      let imgContaner = new Object3D();

      let geometry = new PlaneGeometry(4, 2, 10, 5);
      let material = new ShaderMaterial({
        uniforms: {
          wave: { value: this.wave },
          uLimitCurve: guiSettingsBind("uLimitCurve", 0, 1),
          uShear: { value: this.uShear },
          map: { value: Root.assetsManager.get("greta" + index) },
        },
        vertexShader,
        fragmentShader,
      });

      //material.wireframe = true;
      material.side = DoubleSide;

      let mesh = new Mesh(geometry, material);

      let t = this.t.value + index * 2.0;

      imgContaner.position.set(
        5 * Math.cos(t),
        this.heightHelix * t,
        5 * Math.sin(t)
      );

      let v = new Vector3(
        5 * Math.cos(t + 0.01),
        this.heightHelix * t + 0.01,
        5 * Math.sin(t + 0.01)
      );

      mesh.rotation.y = -this.t.value + Math.PI * 0.5;
      mesh.userData = {
        wave: 0.0,
        waveGO: false,
        waveImage: true,
      };
     // imgContaner.lookAt(v);
      imgContaner.add(mesh);

      this.imgGroup.add(imgContaner);
    }

    this.scene.add(this.imgGroup);
   

    //event 
    document.addEventListener("wheel", this.eventHandler);

    EventBus.on("frame", this.onFrame);
    EventBus.on("pointer.ndc", this.onPointer);
  }

  onFrame = ({ seconds, ds }) => {
    this.raycaster.setFromCamera(this.targetV2, this.context.camera);
    const intersects = this.raycaster.intersectObjects(
      this.context.scene.children
    );

    let hitImage = undefined;
    let hitDictance = Number.MAX_VALUE;

    for (let i = 0; i < intersects.length; i++) {
      //console.log(intersects[i]);

      if (
        intersects[i].object.isMesh &&
        intersects[i].object.userData.waveImage &&
        intersects[i].distance < hitDictance
      ) {
        hitImage = intersects[i].object;
        hitDictance = intersects[i].distance;
      }
    }

    if (hitImage != undefined && hitImage.userData.waveGO == false) {
      hitImage.userData.wave = 0.0;
      hitImage.userData.waveGO = true;
    }

    if (this.uShear > 0 && this.direction) {
      this.uShear -= 2.0 * ds;
    } else if (this.uShear < 0 && !this.direction) {
      this.uShear += 2.0 * ds;
    }

    if (this.wave < 1.0) {
      this.wave += 1.0 * ds;
    }

    for (let index = 0; index < this.imgGroup.children.length; index++) {
      let imgContaner = this.imgGroup.children[index];

      if (
        imgContaner.children[0].userData.wave < 1.0
        //!imgContaner.children[0].userData.waveGO
      ) {
        imgContaner.children[0].userData.wave += 1.0 * ds;
        // imgContaner.children[0].userData.waveGO = true;
      } else if (
        imgContaner.children[0].userData.wave >= 1.0 &&
        imgContaner.children[0].userData.waveGO
      ) {
        imgContaner.children[0].userData.waveGO = false;
      }

      imgContaner.children[0].material.uniforms.uShear.value = this.uShear;
      imgContaner.children[0].material.uniforms.wave.value =
        imgContaner.children[0].userData.wave;
      imgContaner.children[0].material.uniforms.needsUpdate = true;
    }
  };

  onPointer = (pointerNDC) => {
    this.targetV2.x = pointerNDC.x;
    this.targetV2.y = pointerNDC.y;
  };

  eventHandler = (e) => {
    const shearOld = this.uShear;
    this.uShear += e.deltaY / 1000.0;
    this.direction = shearOld < this.uShear ? true : false;
    //this.wave = 0.0;

    this.t.value += e.deltaY / 1000.0;

    for (let index = 0; index < this.imgGroup.children.length; index++) {
      let imgContaner = this.imgGroup.children[index];

      let t = this.t.value + index * 2.0;

      imgContaner.position.set(
        5 * Math.cos(t),
        this.heightHelix * t,
        5 * Math.sin(t)
      );

      let v = new Vector3(
        5 * Math.cos(t + 0.01),
        this.heightHelix * t + 0.01,
        5 * Math.sin(t + 0.01)
      );
      
      imgContaner.rotation.y = -t;
      //imgContaner.rotation.z = ;
      //imgContaner.lookAt(v);
    }
  };
}
