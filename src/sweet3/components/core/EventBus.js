export class EventDispatcher {
  #listeners = {};
  #dispatching = {};
  #toRemove = {};

  on = (type, callback) => {
    if (!this.#listeners[type]) {
      this.#listeners[type] = [];
    }
    this.#listeners[type].push(callback);
  };

  off = (type, callback) => {
    if (type in this.#dispatching && this.#dispatching[type] > 0) {
      if (!(type in this.#toRemove)) {
        this.#toRemove[type] = [callback];
      } else {
        this.#toRemove[type].push(callback);
      }
      return;
    }
    this.#off(type, callback);
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

  dispatch = (type, ...data) => {
    if (type in this.#dispatching) {
      this.#dispatching[type]++;
    } else {
      this.#dispatching[type] = 1;
    }

    if (this.#listeners[type]) {
      this.#listeners[type].forEach(callback => callback(...data));
    }
    
    this.#dispatching[type]--;
    if (this.#dispatching[type] == 0 && type in this.#toRemove && this.#toRemove[type].length > 0) {
      this.#toRemove[type].forEach(callback => this.#off(type, callback));
      delete this.#toRemove[type];
    }
  };

  checkSelf = () => {
    Object.keys(this.#listeners).forEach(type => {
      this.#listeners[type].forEach(callback => {
        if (typeof callback !== "function") {
          throw `${type} listener ${callback} is not a function!`;
        }
      });
    })
  };
}

export const EventBus = new EventDispatcher();
