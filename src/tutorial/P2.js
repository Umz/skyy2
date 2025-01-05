import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import SequenceHelper from "./SequenceHelper";

export default class P2 extends TutorialSequence {

  init() {
    this
    .add(()=>{
      return this.checkCount(2000);
    })
    .addInstruction(Enum.STORY_1A_APPRENTICE)
    .add(()=>{
      this.doOnce(()=>{
        SequenceHelper.SpawnEnemies(2, [Enum.SOLDIER_BANDIT1]);
      });
      return SequenceHelper.CheckEnemiesLessOrEqual(0);
    });
  }
}
