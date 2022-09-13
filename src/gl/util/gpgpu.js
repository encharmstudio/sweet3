import { ClampToEdgeWrapping, FloatType, LinearEncoding, Mesh, NearestFilter, OrthographicCamera, PlaneGeometry, RawShaderMaterial, RedFormat, WebGLRenderTarget } from "three";
import { Root } from "../Root";

const plane = new PlaneGeometry(2, 2, 1, 1);
const dummyCam = new OrthographicCamera(-1, 1, 1, -1, -1, 1);

export const createRT = ({
  width,
  height,
  filter = NearestFilter,
  format = RedFormat,
  type = FloatType,
  wrapping = ClampToEdgeWrapping,
} = {}) => {
  const t = new WebGLRenderTarget(width, height, {
    type,
    format,
    minFilter: filter,
    magFilter: filter,
    encoding: LinearEncoding,
    depthBuffer: false,
  });
  t.texture.wrapS = t.texture.wrapT = wrapping;
  return t;
};

export const createDFBO = ({
  width,
  height,
  filter = NearestFilter,
  format = RedFormat,
  type = FloatType,
  wrapping = ClampToEdgeWrapping,
} = {}) => {
  return {
    read: createRT({ width, height, filter, format, type, wrapping }),
    write: createRT({ width, height, filter, format, type, wrapping }),
    swap() {
      const t = this.read;
      this.read = this.write;
      this.write = t;
    },
    isDFBO: true,
  };
};

export const createProgram = ({ vertex, fragment, uniforms, geometry = plane }) => new Mesh(
  geometry,
  new RawShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms,
    depthTest: false,
    depthWrite: false,
  })
);

export const renderFBO = (program, target) => {
  
  const renderTarget = target.isDFBO ? target.write : target;

  Root.renderPipe.renderer.setRenderTarget(renderTarget);
  Root.renderPipe.renderer.render(program, dummyCam);

  if (target.isDFBO) {
    target.swap();
  }
};