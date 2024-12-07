export default class TutorialPart {
  
  constructor(tut) {
    this.parent = tut;
    this.step = 0;
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
  }

  prevStep() {
    this.step --;
  }
}