import GUI from "lil-gui";
import { bind, provide } from "./Uniforms";
import { Root } from "../../Root";

const binder = {};
let gui;

export function guiField(object, name, min, max) {
  if (!Root.settings.devMode) {
    return null;
  }
  if (!gui) {
    gui = new GUI();
  }
  return gui.add(object, name, min, max);
}

export function guiBind(name, min, max, val = (min + max) * 0.5) {
  if (Root.settings.devMode) {
    if (!gui) {
      gui = new GUI();
    }
    while (name in binder) {
      name += "_";
    }
    binder[name] = val;
    gui.add(binder, name, min, max).onChange((val) => provide(name, val));
  }
  return bind(name, val);
}
