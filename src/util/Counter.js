
export default class Counter {

  constructor(max) {
    
    this.count = 0;
    this.maxCount = max;

    this.isLooping = true;
    this.isCounting = true;
  }

  update(delta, mul = 1) {
    this.count += this.isCounting ? delta * mul : 0;
    if (this.count >= this.maxCount) {
      this.count = this.isLooping ? 0 : this.count;
      return true;
    }
    return false;
  }

  reverse(delta, mul) {
    const newCount = this.isCounting ? this.count - (delta * mul) : this.count;
    this.count = Math.max(0, newCount);
    return this.count === 0;
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

  getPercent() {
    return Phaser.Math.Percent(this.count, 0, this.maxCount) * 100;
  }

  getPercentDecimal() {
    return Phaser.Math.Percent(this.count, 0, this.maxCount);
  }
}