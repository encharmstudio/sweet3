import {
  Vector3,
  Matrix4,
  CylinderGeometry,
  RGBAFormat,
  Vector2,
  DynamicDrawUsage,
  InstancedMesh,
  Color,
} from "three";
import { EventBus } from "../../global/EventDispatcher";

import { createDFBO, createProgram, renderFBO } from "../../util/gpgpu";
import { bind, provide } from "../../global/Uniforms";
import { Material } from "./Material";
import { ContextualComponent } from "../Foundation/ContextualComponent";

import vertexGPGPU from "./gpgpu.vert";
import positionsFrag from "./positions.frag";
import normalsFrag from "./normals.frag";

export class FatLine extends ContextualComponent {
  constructor({ context } = {}) {
    super({ context });
    const sectionsCount = 25;
    this.targetV3 = new Vector3();

    this.count = 1;
    this.lines = new Array(this.count).fill(0);

    this.trailInstanced = new InstancedMesh(
      new CylinderGeometry(0.1, 0.1, 1, 8, sectionsCount, true),
      new Material(),
      this.count
    );
    this.trailInstanced.instanceMatrix.setUsage(DynamicDrawUsage);

    this.lines.forEach((line, i) => {
      this.trailInstanced.setColorAt(i, new Color(0, 0, 0));
    });
    this.scene.add(this.trailInstanced);

    // ------gpgpu
    const fboWidth = sectionsCount + 1;
    const fboHeight = 1;

    this.positionsFBO = createDFBO({
      width: fboWidth,
      height: fboHeight,
      format: RGBAFormat,
    });

    this.normalsFBO = createDFBO({
      width: fboWidth,
      height: fboHeight,
      format: RGBAFormat,
    });

    provide("lines.fbo.texelSize", new Vector2(1 / fboWidth, 1 / fboHeight));
    provide("lines.positions", this.positionsFBO.read.texture);
    provide("lines.normals", this.normalsFBO.read.texture);

    this.positionsProgram = createProgram({
      vertex: vertexGPGPU,
      fragment: positionsFrag,
      uniforms: {
        targetPosition: { value: this.targetV3 },
        texelSize: bind("lines.fbo.texelSize"),
        positionsMap: bind("lines.positions"),
      },
    });

    this.normalsProgram = createProgram({
      vertex: vertexGPGPU,
      fragment: normalsFrag,
      uniforms: {
        texelSize: bind("lines.fbo.texelSize"),
        positionsMap: bind("lines.positions"),
        normalsMap: bind("lines.normals"),
      },
    });

    EventBus.on("frame", this.onFrame);
    EventBus.on("pointer.ndc", this.onPointer);
  }

  onPointer = (pointerNDC) => {
    this.targetV3.x = pointerNDC.x;
    this.targetV3.y = pointerNDC.y;
    this.targetV3.z = 0.95;

    this.targetV3.unproject(this.context.camera);
  };

  onFrame = ({ seconds, ds }) => {
    this.lines.forEach((line, i) => {
      this.trailInstanced.setColorAt(
        i,
        new Color(0, (-1 * i) / this.lines.length, i / -15)
      );
      let iMatrix = new Matrix4().identity();
      iMatrix.makeRotationAxis(new Vector3(0, 1, 0), i);
      this.trailInstanced.setMatrixAt(i, iMatrix);
    });
    this.trailInstanced.instanceColor.needsUpdate = true;
    this.trailInstanced.instanceMatrix.needsUpdate = true;

    renderFBO(this.positionsProgram, this.positionsFBO);
    provide("lines.positions", this.positionsFBO.read.texture);

    renderFBO(this.normalsProgram, this.normalsFBO);
    provide("lines.normals", this.normalsFBO.read.texture);
  };
}
