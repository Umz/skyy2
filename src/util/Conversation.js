import Dialogue from "../const/Dialogue";
import Counter from "./Counter";

const FADE_IN = "anim-fadeIn";

export default class Conversation {
  
  constructor(scene) {
    this.scene = scene;

    this.isShowingDialogue = false;
    this.dialogue = [];

    this.counter = new Counter(4000);
    this.transition = new Counter(750);
  }

  update(time, delta) {
    if (this.isShowingDialogue) {
      if (this.counter.update(delta)) {
        this.fadeOut();
        this.isShowingDialogue = false;
      }
    }
    else if (this.hasNextLine()) {
      if (this.transition.update(delta)) {
        this.showNextLine();
        this.isShowingDialogue = true;
      }
    }
  }

  loadDialogue(en) {
    const script = Dialogue.get(en);
    this.dialogue = script.split("-#");
  }

  getNextScriptLine() {
    const line = this.dialogue.shift();
    const lineParts = line.split(": ");
    return {
      speaker: lineParts[0].replace("\n", ""),
      text: lineParts[1]
    }
  }

  showNextLine() {
    
    const speaker = document.getElementById("speech-speaker");
    const text = document.getElementById("speech-text");

    const nextLine = this.getNextScriptLine();
    speaker.innerText = nextLine.speaker;
    text.innerText = nextLine.text;

    this.fadeIn();
  }

  hasNextLine() {
    return this.dialogue.length > 0;
  }

  isConversing() {
    return this.hasNextLine() || this.isShowingDialogue;
  }

  showConversation(en) {
    this.loadDialogue(en);
    this.showNextLine();
    this.isShowingDialogue = true;
  }

  fadeIn() {
    const speechbox = document.getElementById("speech-box");
    speechbox.classList.add(FADE_IN);
  }

  fadeOut() {
    const speechbox = document.getElementById("speech-box");
    speechbox.classList.remove(FADE_IN);
  }
}