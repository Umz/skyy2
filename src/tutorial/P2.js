import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import PartHelper from "./PartHelper";

export default class P2 extends TutorialSequence {

  init() {
    this
    .add(()=>{
      return this.checkCount(2000);
    })
    .addInstruction(Enum.STORY_1A_APPRENTICE)
    .add(()=>{
      this.doOnce(()=>{
        PartHelper.SpawnEnemies(2, [Enum.SOLDIER_BANDIT1]);
      });
      return PartHelper.CheckEnemiesLessOrEqual(0);
    });
  }
}
