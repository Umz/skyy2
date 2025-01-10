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

    .addDialogue("Red Face", script.RedFace.rose1, 7000)

    .add(()=>{
      SequenceHelper.SpawnAlly(player.x - 24, Enum.SOLDIER_ALLY_HEAVY1);
      SequenceHelper.SpawnAlly(player.x - 48, Enum.SOLDIER_ALLY_HEAVY1);
      return true;
    })

    .addEnemiesRight(6, Enum.SOLDIER_BANDIT2, Enum.SOLDIER_RED1)
    .addEnemiesRight(2, Enum.SOLDIER_RED3)

    .add(()=>{
      this.spawnConstantRight(6, 1);
      return player.x >= roseX + Vars.AREA_WIDTH * .4;
    })
    .addDialogue("Red Face", script.RedFace.rose2, 5000)

    .add(()=>{
      for (let i=0; i<15; i++) {
        const rand = Phaser.Math.Between(210, 270)
        SequenceHelper.SpawnAlly(player.x - rand, Enum.SOLDIER_ALLY_HEAVY1);
      }
      return true;
    })
    .addIcon(player, Icon.BANNER, 20 * 1000)

    .addEnemiesRight(10, Enum.SOLDIER_BANDIT2, Enum.SOLDIER_RED1)
    .addEnemiesRight(6, Enum.SOLDIER_RED3)

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

  spawnConstantRight(min, add) {
    const { scene } = this;
    const enemyCount = scene.countEnemies();
    if (enemyCount < min) {
      const pX = SequenceHelper.GetCameraRight() + Phaser.Math.Between(10, 70);
      SequenceHelper.SpawnEnemiesAt(pX, add, [Enum.SOLDIER_RED1, Enum.SOLDIER_RED2, Enum.SOLDIER_RED3]);
      return true;
    }
  }

}
