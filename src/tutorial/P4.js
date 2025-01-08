import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Vars from "../const/Vars";
import Subtitles from "../util/Subtitles";
import SequenceHelper from "./SequenceHelper";

export default class P4 extends TutorialSequence {

  init() {

    const player = this.scene.player;
    const script = Subtitles.GetScript();

    const roseX = Vars.AREA_WIDTH * 2;

    this.enemies = [];
    this.allies = [];

    this
    .addStopSaving()  // Temp (dev)

    .addIcon(player, Icon.ANGER, 3000)
    .add(()=> player.x > roseX + 100)
    .addIcon(player, Icon.BANNER, 7000)

    //.addEnemiesRight(3, Enum.SOLDIER_BANDIT2, Enum.SOLDIER_RED3)
    .addEnemiesRight(1, Enum.SOLDIER_RED3)
    .addWait(7000)

    .add(()=>{
      return false;
    });
  }

  //  - P4 functions

  addEnemiesRight(amt, ...types) {
    this.add(()=>{
      const pX = SequenceHelper.GetCameraRight() + Phaser.Math.Between(10, 70);
      SequenceHelper.SpawnEnemiesAt(pX, amt, types);
      return true;
    });
    return this;
  }
}
