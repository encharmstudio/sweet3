export class EventDispatcher {
  #listeners = {};
  #offList = [];
  #isDispatching = false;

  on = (type, callback) => {
    if (!(type in this.#listeners)) {
      this.#listeners[type] = [];
    }
    this.#listeners[type].push(callback);
  };

  off = (type, callback) => {
    if (this.#isDispatching) {
      this.#offList.push([type, callback]);
    } else {
      this.#off(type, callback);
    }
  };

  #off = (type, callback) => {
    const arr = this.#listeners[type];
    if (arr) {
      let index = arr.indexOf(callback);
      if (index !== -1) {
        arr.splice(index, 1);
      }
    }
  };

  dispatch = (type, data) => {
    if (type in this.#listeners) {

      this.#isDispatching = true;

      this.#listeners[type].forEach(callback => callback(data));

      this.#isDispatching = false;

      if (this.#offList.length > 0) {
        this.#offList.forEach(([pair]) => this.#off(pair[0], pair[1]));
        this.#offList.length = 0;
      }

    }
  };
}

export const EventBus = new EventDispatcher();