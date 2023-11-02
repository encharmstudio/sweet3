import GUI from "lil-gui";
import { bind, provide } from "./Uniforms";
import { Root } from "../../Root";

const gui = Root.settings.devMode ? new GUI() : null,
      binder = {};

export function guiField(object, name, min, max) {
  return Root.settings.devMode ? 
    gui.add(object, name, min, max) :
    null;
}

export function guiBind(name, min, max, val = (min + max) * .5) {
  if (Root.settings.devMode) {
    while (name in binder) {
      name += "_";
    }
    binder[name] = val;
    gui.add(binder, name, min, max).onChange(val => provide(name, val));
  }
  return bind(name, val);
}