export default class Action {

  constructor(name, sprite) {

    this.name = name;
    this.isActionComplete = false;
    this.isRepeating = false;
    this.callbacks = [];

    this.initialised = false;
    this.isStopped = false;

    if (sprite) {
      this.sprite = sprite;
      this.scene = sprite.scene;
    }
  }

  mainUpdate(time, delta) {

    if (!this.initialised) {
      this.initialised = true;
      this.init();
    }

    //  ONLY while not complete and not stopped
    this.update(time, delta);

    if (this.isActionComplete && !this.isStopped) {
      for (let i=this.callbacks.length; --i>=0;) {
        let fn = this.callbacks.shift();
        fn(this);
      }
    }
  }

  update(time, delta) {
    throw new Error(this.constructor.name + " subClassUpdate() must be overriden");
  }

  addCallback(fn) {
    this.callbacks.push(fn);
    return this;
  }

  setComplete(b = true) {
    this.isActionComplete = b;
  }

  isComplete() {
    return this.isActionComplete;
  }

  setRepeating(b) {
    this.isRepeating = b;
  }

  init() { return 0; }

  stop() {
    this.setComplete();
    this.isStopped = true;
  }

  rename(name) {
    this.name = name;
    return this;
  }

  setSprite(ss) {
    this.sprite = ss;
    this.scene = ss.scene;
  }
}
