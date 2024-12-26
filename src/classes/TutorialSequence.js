export default class TutorialSequence {
  
  constructor(tut) {
    
    this.tutorial = tut;
    this.scene = tut.scene;

    this.sequence = [];

    this.step = 0;
    this.once = -1;
    this.date = new Date();

    this.init();
  }

  init() {
    console.log("Override the init() function in TutorialSequence");
  }

  update() {

    if (this.sequence.length > 0) {

      const currentStepFn = this.sequence[0];
      if (currentStepFn()) {
        this.sequence.shift();
        this.incStep();
      }
      return false;
    }
    
    return true;
  }

  add(fn) {
    this.sequence.push(fn);
    return this;
  }

  showConversation(en) {
    this.tutorial.showConversation(en);
  }

  checkCount(max) {
    const start = this.date.getTime();
    const comp = new Date();
    const time = comp.getTime();
    const elapsed = time - start;
    return elapsed >= max;
  }

  nextStep() {
    this.sequence.shift();
    this.incStep();
  }

  incStep() {
    this.step ++;
    this.date = new Date();
  }

  doOnce() {
    if (this.once !== this.step) {
      this.once = this.step;
      return true;
    }
    return false;
  }

}