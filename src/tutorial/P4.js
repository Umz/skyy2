import RedDuel from "../ai/RedDuel";
import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Vars from "../const/Vars";
import Subtitles from "../util/Subtitles";
import SequenceHelper from "./SequenceHelper";

export default class P4 extends TutorialSequence {

  init() {

    const { scene } = this;
    const player = this.scene.player;
    const script = Subtitles.GetScript();

    const roseX = Vars.AREA_WIDTH * 2;
    const stormX = Vars.AREA_WIDTH * 3;

    this.enemies = [];
    this.allies = [];

    this
    .addStopSaving()  // Temp (dev)
    
    .addRedFaceForDuel()
    .add(()=>{
      this.redface.speak(Icon.SPEAR, script.RedFace.rose3, 6000);
      return true;
    })

    // Stop all other characters - set to Duel mode


    .add(()=>{
      return false;
    })

    .add(()=>{
      SequenceHelper.SpawnAlly(player.x - 24, Enum.SOLDIER_ALLY_WILDMAN);
      return true;
    })

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
      const enemyCount = scene.countEnemies();
      for (let i=0; i<enemyCount; i++) {
        const rand = Phaser.Math.Between(210, 270)
        SequenceHelper.SpawnAlly(player.x - rand, Enum.SOLDIER_ALLY_WILDMAN);
      }
      for (let i=0; i<3; i++) {
        const rand = Phaser.Math.Between(210, 270)
        SequenceHelper.SpawnAlly(player.x - rand, Enum.SOLDIER_ALLY_HEAVY1);
      }
      return true;
    })
    .addIcon(player, Icon.BANNER, 20 * 1000)

    .addEnemiesRight(10, Enum.SOLDIER_BANDIT2, Enum.SOLDIER_RED1)
    .addEnemiesRight(6, Enum.SOLDIER_RED3)


    .add(()=>{
      this.spawnConstantRight(6, 1);
      return player.x >= stormX;
    })

    .addDialogue("Red Face", script.RedFace.rose3, 5000)

    // Start Duel

    .add(()=>{
      return false;
    });
  }

  //  - P4 functions

  addRedFaceForDuel() {
    this.add(()=>{
      this.spawnRedFace();
      return true;
    });
    return this;
  }

  spawnRedFace() {

    const pX = this.scene.player.x + 140;

    this.redface = this.scene.spawnEnemy(pX, Enum.SOLDIER_REDFACE);
    this.redface.setHP(15, 15);
    this.redface.setGP(10, 10);
    this.redface.setDisplayName("Red Face", Enum.TEAM_ENEMY);

    this.redface.setController(new RedDuel());
  }

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
