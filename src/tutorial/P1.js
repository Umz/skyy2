import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../util/Enum";

export default class P1 extends TutorialSequence {

  init() {
    this.add(()=>{
      this.doOnce(()=>{
        this.tutorial.showInstructions(Enum.STORY_0_INTRO);
      });
    })
  }
}