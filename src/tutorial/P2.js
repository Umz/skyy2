import TutorialPart from "../classes/TutorialPart";
import Enum from "../util/Enum";

export default class P2 extends TutorialPart {

  update() {

    switch (this.step) {
      
      case 0:        
        if (this.checkCount(2000)) {
          this.nextStep();
        }
        break;
      case 1:
        this.parent.showInstructions(Enum.STORY_1A_APPRENTICE);
        this.nextStep();
        break;  // Waiting
      case 2: // Kill enemies?
        return false;
    }

    return false;
  }

}