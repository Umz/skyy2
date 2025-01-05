import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Subtitles from "../util/Subtitles";
import SequenceHelper from "./SequenceHelper";

export default class P1 extends TutorialSequence {

  init() {

    const player = this.scene.player;
    const script = Subtitles.GetScript();

    this
    .addIcon(player, Icon.SPEAR, 5000)
    .addInstruction(Enum.STORY_0_INTRO)

    .add(()=>{
      return this.checkCount(2000);
    })
    .addInstruction(Enum.STORY_1A_APPRENTICE)
    .add(()=>{
      this.doOnce(()=>{
        SequenceHelper.SpawnEnemies(2, [Enum.SOLDIER_BANDIT1]);
      });
      return SequenceHelper.CheckEnemiesLessOrEqual(0);
    })

    .addWait(2000)
    .addInstruction(Enum.STORY_1B_APPRENTICE)
    .add(()=>{
      return this.spawnAndWait(2);
    })

    .addWait(1000)
    .addSpeaker(player, Icon.SPEECH, script.MoonChief.peons)
    .add(()=>{
      return this.spawnAndWait(4);
    })

    .addWait(1000)
    .addSpeaker(player, Icon.SPEECH, script.MoonChief.taunt, 2000)
    .add(()=>{
      return this.spawnAndWait(5);
    })

    .add(()=>{
      return this.checkCount(1000);
    })
    .addWait(1000)
    .addInstruction(Enum.STORY_1C_BLUEFOREST);

  }

  //  -

  spawnAndWait(amt) {
    this.doOnce(()=>{
      SequenceHelper.SpawnEnemies(amt, [Enum.SOLDIER_BANDIT1]);
    });
    return SequenceHelper.CheckEnemiesLessOrEqual(0);
  }
}
