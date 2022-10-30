import { Root } from "../../Root";

export class ContextComponent {

  constructor({ context = Root.context }) {
    this.context = context;
  }

  get scene() {
    return this.context.scene;
  }

  get camera() {
    return this.context.camera;
  }
}