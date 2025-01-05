import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import SequenceHelper from "./SequenceHelper";

export default class P3 extends TutorialSequence {

  init() {
    this
    .add(()=>{
      return this.checkCount(2000);
    })
    .addInstruction(Enum.STORY_1B_APPRENTICE)
    .add(()=>{
      return this.spawnAndWait(2);
    })

    .add(()=>{
      return this.checkCount(1000);
    })
    .addConversation(Enum.MC_PEOMS)
    .add(()=>{
      return this.spawnAndWait(4);
    })

    .add(()=>{
      return this.checkCount(1000);
    })
    .addConversation(Enum.MC_TAUNT)
    .add(()=>{
      return this.spawnAndWait(5);
    })

    .add(()=>{
      return this.checkCount(1000);
    })
    .addInstruction(Enum.STORY_1C_BLUEFOREST);
  }

  //  -

  spawnAndWait(amt) {
    this.doOnce(()=>{
      SequenceHelper.SpawnEnemies(2, [Enum.SOLDIER_BANDIT1]);
    });
    return SequenceHelper.CheckEnemiesLessOrEqual(0);
  }

}