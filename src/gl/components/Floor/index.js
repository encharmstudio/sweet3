import { DepthFormat, DepthTexture, HalfFloatType, LinearEncoding, LinearFilter, Matrix4, Plane, PlaneGeometry, UnsignedShortType, Vector3, Vector4, WebGLRenderTarget } from "three";
import { EventBus } from "../../global/EventDispatcher";
import { Root } from "../../Root";
import { createMesh } from "../../util/objectSugar";
import { ContextualComponent } from "../Foundation/ContextualComponent";
import { BlurPass } from "./BlurPass";
import { Material } from "./Material";

export class Floor extends ContextualComponent {

  constructor({
    resolution = 1024,
    blur = [600, 300],
    size = [200, 200],
    mirror = 0,
    mixBlur = 100,
    mixStrength = 80,
    minDepthThreshold = .9,
    maxDepthThreshold = 1,
    depthScale = .01,
    depthToBlurRatioBias = 0.25,
    distortion = 0,
    distortionMap,
    context,
  } = {}) {
    super({ context });

    this.blur = blur;
    this.hasBlur = blur[0] + blur[1] > 0;
    this.normal = new Vector3();
    this.reflectorWorldPosition = new Vector3();
    this.cameraWorldPosition = new Vector3();
    this.reflectorPlane = new Plane();
    this.lookAtPosition = new Vector3();
    this.rotationMatrix = new Matrix4();
    this.clipPlane = new Vector4();
    this.view = new Vector3();
    this.target = new Vector3();
    this.q = new Vector4();
    this.textureMatrix = new Matrix4();
    this.virtualCamera = this.camera.clone();

    const parameters = {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      encoding: LinearEncoding,
      type: HalfFloatType,
    };
    this.fbo1 = new WebGLRenderTarget(resolution, resolution, parameters);
    this.fbo1.depthBuffer = true;
    this.fbo1.depthTexture = new DepthTexture(resolution, resolution);
    this.fbo1.depthTexture.format = DepthFormat;
    this.fbo1.depthTexture.type = UnsignedShortType;
    
    this.fbo2 = new WebGLRenderTarget(resolution, resolution, parameters);
    
    this.blurpass = new BlurPass({
      gl: Root.pipeline.renderer,
      resolution,
      width: blur[0],
      height: blur[1],
      minDepthThreshold,
      maxDepthThreshold,
      depthScale,
      depthToBlurRatioBias,
    });

    this.mesh = createMesh({
      name: "Floor",
      geometry: new PlaneGeometry(size[0], size[1], 1, 1),
      rotation: [-Math.PI * .5, 0, 0],
      material: new Material({
        size,
        mirror,
        mixBlur,
        mixStrength,
        minDepthThreshold,
        maxDepthThreshold,
        depthScale,
        depthToBlurRatioBias,
        transparent: true,
        distortion,
        distortionMap,
        textureMatrix: this.textureMatrix,
        tDiffuse: this.fbo1.texture,
        tDepth: this.fbo1.depthTexture,
        tDiffuseBlur: this.fbo2.texture,
        hasBlur: this.hasBlur,
      }),
    });

    this.mesh.position.y -= .01;

    this.scene.add(this.mesh);

    EventBus.on("beforeRender", this.onBeforeRender);
  }

  onBeforeRender = () => {
    this.reflectorWorldPosition.setFromMatrixPosition(this.mesh.matrixWorld);
    this.cameraWorldPosition.setFromMatrixPosition(this.camera.matrixWorld);
    this.rotationMatrix.extractRotation(this.mesh.matrixWorld);
    this.normal.set(0, 0, 1);
    this.normal.applyMatrix4(this.rotationMatrix);
    this.view.subVectors(this.reflectorWorldPosition, this.cameraWorldPosition);

    // Avoid rendering when reflector is facing away
    if (this.view.dot(this.normal) > 0) return;
    
    this.view.reflect(this.normal).negate();
    this.view.add(this.reflectorWorldPosition);

    this.rotationMatrix.extractRotation(this.camera.matrixWorld);
    this.lookAtPosition.set(0, 0, -1);
    this.lookAtPosition.applyMatrix4(this.rotationMatrix);
    this.lookAtPosition.add(this.cameraWorldPosition);
    this.target.subVectors(this.reflectorWorldPosition, this.lookAtPosition);
    this.target.reflect(this.normal).negate();
    this.target.add(this.reflectorWorldPosition);

    this.virtualCamera.position.copy(this.view);
    this.virtualCamera.up.set(0, 1, 0);
    this.virtualCamera.up.applyMatrix4(this.rotationMatrix);
    this.virtualCamera.up.reflect(this.normal);
    this.virtualCamera.lookAt(this.target);
    this.virtualCamera.far = this.camera.far; // Used in WebGLBackground
    this.virtualCamera.updateMatrixWorld();
    this.virtualCamera.projectionMatrix.copy(this.camera.projectionMatrix);

    // Update the texture matrix
    this.textureMatrix.set(0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0);
    this.textureMatrix.multiply(this.virtualCamera.projectionMatrix);
    this.textureMatrix.multiply(this.virtualCamera.matrixWorldInverse);
    this.textureMatrix.multiply(this.mesh.matrixWorld);
    
    // Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
    // Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
    this.reflectorPlane.setFromNormalAndCoplanarPoint(this.normal, this.reflectorWorldPosition);
    this.reflectorPlane.applyMatrix4(this.virtualCamera.matrixWorldInverse);

    this.clipPlane.set(this.reflectorPlane.normal.x, this.reflectorPlane.normal.y, this.reflectorPlane.normal.z, this.reflectorPlane.constant);
    const projectionMatrix = this.virtualCamera.projectionMatrix;
    this.q.x = (Math.sign(this.clipPlane.x) + projectionMatrix.elements[8]) / projectionMatrix.elements[0];
    this.q.y = (Math.sign(this.clipPlane.y) + projectionMatrix.elements[9]) / projectionMatrix.elements[5];
    this.q.z = -1.;
    this.q.w = (1. + projectionMatrix.elements[10]) / projectionMatrix.elements[14];

    // Calculate the scaled plane vector
    this.clipPlane.multiplyScalar(2. / this.clipPlane.dot(this.q));
    // Replacing the third row of the projection matrix
    projectionMatrix.elements[2] = this.clipPlane.x;
    projectionMatrix.elements[6] = this.clipPlane.y;
    projectionMatrix.elements[10] = this.clipPlane.z + 1.;
    projectionMatrix.elements[14] = this.clipPlane.w;

    this.mesh.visible = false;
    const renderer = Root.pipeline.renderer;
    const currentXrEnabled = renderer.xr.enabled;
    const currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;
    renderer.xr.enabled = false;
    renderer.shadowMap.autoUpdate = false;

    renderer.setRenderTarget(this.fbo1);
    renderer.state.buffers.depth.setMask(true);
    if (!renderer.autoClear) renderer.clear();

    renderer.render(this.scene, this.virtualCamera);

    if (this.hasBlur) {
      this.blurpass.render(renderer, this.fbo1, this.fbo2);
    }

    renderer.xr.enabled = currentXrEnabled;
    renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;
    this.mesh.visible = true;
  };
}