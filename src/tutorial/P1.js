import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";

export default class P1 extends TutorialSequence {

  init() {
    this.addInstruction(Enum.STORY_0_INTRO);
  }
}
