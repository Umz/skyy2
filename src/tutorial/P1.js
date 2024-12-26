import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../util/Enum";

export default class P1 extends TutorialSequence {

  update() {

    switch (this.step) {
      case 0:
        this.tutorial.showInstructions(Enum.STORY_0_INTRO);
        this.step ++;
        break;
      case 1: break;  // Waiting
      case 2:
        return true;
    }

    return false;
  }

}