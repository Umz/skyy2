export default class ControlKeys {

  constructor() {
    
    this.attack = this.getKey();
    this.defend = this.getKey();

    this.pause = this.getKey();
    this.start = this.getKey();

    this.right = this.getKey();
    this.left = this.getKey();
    this.up = this.getKey();
    this.down = this.getKey();
  }

  pressKey(key) {
    key.down = true;
    key.up = false;
    key.singleUp = true;
  }
  
  releaseKey(key) {
    key.down = false;
    key.singleDown = true;
    key.up = true;
  }

  getPress(key, fn) {
    if (key.down) {
      if (fn) {
        fn();
      }
    }
  }

  getSinglePress(key, fn) {
    if (key.down && key.singleDown) {
      key.singleDown = false;
      if (fn) {
        fn();
      }
      return true;
    }
    return false;
  }

  getSingleRelease(key, fn) {
    if (key.up && key.singleUp) {
      key.singleUp = false;
      if (fn) {
        fn()
      }
      return true;
    }
    return false;
  }
  
  getKey() {
    return {down:false, up:true, singleDown:true, singleUp:true};
  }
}