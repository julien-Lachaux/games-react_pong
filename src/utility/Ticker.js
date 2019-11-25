import { observable, computed, decorate } from "mobx";

export default class Ticker {
  constructor(callback) {
    if (typeof callback === "function") {
      this.callbacks = [callback];
    } else {
      this.callbacks = [];
    }
  }

  get isPaused() {
    return !this.frame;
  }

  add(callback) {
    if (typeof callback === "function") {
      this.callbacks.push(callback);
    }
  }

  toggle() {
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  resume() {
    if (this.frame) {
      return;
    }
    this.lastTime = new Date().getTime();
    this.handleFrame();
  }

  pause() {
    cancelAnimationFrame(this.frame);
    this.frame = null;
  }

  handleFrame() {
    // get now for calculating delta
    const now = new Date().getTime();

    // prepare next tick
    this.frame = requestAnimationFrame(this.handleFrame.bind(this));

    // call callbacks with delta time
    const delta = (now - this.lastTime) * 0.001;
    this.tick(delta);

    // set last time to calculate delta of next tick
    this.lastTime = now;
  }

  tick(delta) {
    for (let callback of this.callbacks) {
      callback(delta);
    }
  }

  destroy() {
    this.pause();
    this.callback = null;
  }
}

// NOTE: maybe making the frame property observable isn't the greatest idea,
// but it works and this is just to get to know the concepts anyway.
decorate(Ticker, {
  isPaused: computed,
  frame: observable
});
