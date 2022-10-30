import { Root } from "../../Root";

export class ContextualComponent {

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