
export default class Counter {

  constructor(max) {
    
    this.count = 0;
    this.maxCount = max;

    this.isLooping = true;
    this.isCounting = true;
  }

  update(delta) {
    this.count += this.isCounting ? delta : 0;
    if (this.count >= this.maxCount) {
      this.count = this.isLooping ? 0 : this.count;
      return true;
    }
    return false;
  }

  setMax(m) {
    this.maxCount = m;
    return this;
  }

  setLooping(b) {
    this.isLooping = b;
    return this;
  }

  resetCount(toCount = 0) {
    this.count = toCount;
  }

  pause() {
    this.isCounting = false;
  }

  resume() {
    this.isCounting = true;
  }
}