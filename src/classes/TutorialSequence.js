import SaveData from "../util/SaveData";
import Subtitles from "../util/Subtitles";

export default class TutorialSequence {
  
  constructor(tut) {
    
    this.tutorial = tut;
    this.scene = tut.scene;

    this.sequence = [];
    this.shouldSaveStepID = true;

    this.step = 0;
    this.once = -1;
    this.date = new Date();

    this.init();
  }

  init() {
    console.log("Override the init() function in TutorialSequence subClass");
  }

  startFrom(skipAmt) {
    this.sequence.splice(0, skipAmt);
    this.step = skipAmt;
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

  addWait(time) {
    this.add(()=>{
      return this.checkCount(time);
    });
    return this;
  }

  addInstruction(instruction) {
    this.add(()=>{
      this.doOnce(()=>{
        this.tutorial.showInstructions(instruction);
      });
    });
    return this;
  }

  addDialogue(name, text, ttl) {
    this.add(()=>{
      Subtitles.ShowDialogue(name, text, ttl)
      return true;
    })
    return this;

  }

  addDialogueAndWait(name, text, ttl) {
    this
    .addDialogue(name, text, ttl)
    .add(()=>{ return !Subtitles.IsShowing() })
    return this;
  }

  addWaitForDialogue() {
    this.add(()=>{ return !Subtitles.IsShowing() });
    return this;
  }

  addIcon(sprite, icon, ttl) {
    this.add(()=>{
      sprite.showIcon(icon, ttl);
      return true;
    })
    return this;
  }

  addSpeaker(sprite, icon, text, ttl) {
    this.add(()=>{
      sprite.speak(icon, text, ttl);
      return true;
    })
    return this;
  }

  addSpeakerAndWait(sprite, icon, text, ttl) {
    this
    .addSpeaker(sprite, icon, text, ttl)
    .add(()=>{ return !Subtitles.IsShowing() })
    return this;
  }

  addStopSaving() {
    this.add(()=>{
      this.turnSavingOff();
      return true;
    })
    return this;
  }

  addStartSaving() {
    this.add(()=>{
      this.turnSavingOn();
      return true;
    })
    return this;
  }

  addSave() {
    this.add(()=>{
      SaveData.SAVE_GAME_DATA();
      return true;
    });
    return this;
  }

  addShowDuelDOM() {
    this.add(()=>{
      const element = document.getElementById("duel-text");
      element.style.display = "block";
      return true;
    });
    return this;
  }

  addHideDuelDOM() {
    this.add(()=>{
      const element = document.getElementById("duel-text");
      element.style.display = "none";
      return true;
    });
    return this;
  }

  // Just used to add section titles in long sequences
  addTitle(txt, logDetails = false) {
    if (logDetails) {
      this.add(()=>{
        console.log(txt);
        console.log(`Tutorial Step ${this.step}`)
        return true;
      });
    }
    return this;
  }

  //  -------

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

    if (this.shouldSaveStepID) {
      SaveData.Data.tutorialSequenceStep = this.step;
    }
  }

  /** Perform the given function once per step (first come, first serve) */
  doOnce(fn) {
    if (this.once !== this.step) {
      fn();
      this.once = this.step;
    }
  }

  /** Do not save the next step when complete - skips saveing if setup is required */
  turnSavingOff() {
    this.shouldSaveStepID = false;
  }

  /** Resume saving steps when complete */
  turnSavingOn() {
    this.shouldSaveStepID = true;
  }

}