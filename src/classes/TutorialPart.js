export default class TutorialPart {
  
  constructor(tut) {
    
    this.parent = tut;
    this.scene = tut.scene;

    this.step = 0;
    this.once = -1;
    this.date = new Date();
  }

  update() {
    return false;
  }

  checkCount(max) {
    const start = this.date.getTime();
    const comp = new Date();
    const time = comp.getTime();
    const elapsed = time - start;
    return elapsed >= max;
  }

  nextStep() {
    this.step ++;
    this.date = new Date();
  }

  prevStep() {
    this.step --;
  }

  doOnce() {
    if (this.once !== this.step) {
      this.once = this.step;
      return true;
    }
    return false;
  }
}