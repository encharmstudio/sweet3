export class EventDispatcher {
  #listeners = {};

  on = (type, callback) => {
    if (!this.#listeners[type]) {
      this.#listeners[type] = [];
    }
    this.#listeners[type].push(callback);
  };

  off = (type, callback) => {
    const arr = this.#listeners[type];
    if (arr) {
      let index = arr.indexOf(callback);
      if (index !== -1) {
        arr.splice(index, 1);
      }
    }
  };

  dispatch = (type, data) => {
    if (this.#listeners[type]) {
      this.#listeners[type].forEach(callback => callback(data));
    }
  };
}

export const EventBus = new EventDispatcher();