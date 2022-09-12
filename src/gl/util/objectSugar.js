import { InstancedMesh, Mesh, Object3D, Vector3 } from "three";

const setVal = (obj, val) => {
  val instanceof Vector3 ? obj.copy(val) : Array.isArray(val) ? obj.fromArray(val) : obj.setScalar(val);
};

const callLookAt = (obj, pos) => {
  pos instanceof Vector3 ? obj.lookAt(pos) : Array.isArray(pos) ? obj.lookAt(...pos) : obj.lookAt(pos, pos, pos);
};

export const objectWrap = ({ object, position, rotation, scale, lookAt, layer, name = "", userData }) => {
  object.name = name;
  if (position !== undefined) {
    setVal(object.position, position);
  }
  if (scale !== undefined) {
    setVal(object.scale, scale);
  }
  if (rotation !== undefined) {
    setVal(object.rotation, rotation);
    // rotation instanceof Euler ? mesh.rotation.copy(rotation) : Array.isArray(rotation) ? mesh.rotation.fromArray(rotation) : mesh.rotation.setScalar(rotation)
  }
  if (lookAt !== undefined) {
    callLookAt(object, lookAt);
  }
  if (layer !== undefined) {
    object.layers.set(layer);
  }
  userData && (object.userData = userData);
  return object;
};

export const createMesh = ({ geometry, material, position, rotation, scale, lookAt, layer, name = "", userData }) => {
  return objectWrap({ object: new Mesh(geometry, material), position, rotation, scale, lookAt, layer, name, userData });
};

export const createInstancedMesh = ({ geometry, material, count, position, rotation, scale, lookAt, color, layer, userData }) => {
  const mesh = new InstancedMesh(geometry, material, count),
        dummy = new Object3D();
  for (let i = 0; i < count; i++) {
    position !== undefined && setVal(dummy.position, position instanceof Function ? position(i) : position);
    rotation !== undefined && setVal(dummy.rotation, rotation instanceof Function ? rotation(i) : rotation);
    scale !== undefined && setVal(dummy.scale, scale instanceof Function ? scale(i) : scale);
    lookAt !== undefined && callLookAt(dummy, lookAt instanceof Function ? lookAt(i) : lookAt);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
    color !== undefined && mesh.setColorAt(i, color instanceof Function ? color(i) : color);
  }
  if (layer !== undefined) {
    mesh.layers.set(layer);
  }
  userData && (mesh.userData = userData);
  return mesh;
}; 