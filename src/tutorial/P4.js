import RedDuel from "../ai/RedDuel";
import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Vars from "../const/Vars";
import SaveData from "../util/SaveData";
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

    .add(()=>{
      player.x = Vars.AREA_WIDTH * 1.5;
      return true;
    })
    .add(()=>false)
    
    // Stop all other characters - set to Duel mode

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
      this.spawnConstantRight(4, 1);
      return player.x >= roseX + Vars.AREA_WIDTH * .7;
    })
    .addDialogue("Red Face", script.RedFace.rose3, 5000)

    .add(()=>{
      this.spawnConstantRight(6, 1);
      return player.x >= stormX;
    })
    
    // Start Duel

    .addRedFaceForDuel()
    .add(()=>{
      this.redface.speak(Icon.SPEAR, script.RedFace.rose4, 6000);
      return true;
    })

    .add(()=>{
      const group = this.scene.groupSoldiers.getChildren();
      for (let sol of group) {

        if (sol !== player && sol !== this.redface) {
          sol.controller.pause();
          sol.viewController.pause();
          sol.setActive(false);
          sol.setAlpha(.05);
          sol.idle();
          sol.stopMove();
          sol.body.enable = false;
        }
      }
      return true;
    })

    .add(()=>{
      return this.redface.hp <= 0;
    })
    .addDialogueAndWait("Red Face", script.RedFace.death, 7000)
    .addWait(2000)

    .addSpeakerAndWait(player, Icon.BANNER, script.MoonChief.rose1, 7000)
    .addSpeakerAndWait(player, Icon.SPEAR2, script.MoonChief.rose2, 4000)

    //  Resume soldiers
    .add(()=>{
      const group = this.scene.groupSoldiers.getChildren();
      for (let sol of group) {
        if (sol !== player) {
          sol.controller.resume();
          sol.viewController.resume();
          sol.setActive(true);
          sol.setAlpha(1);
          sol.body.enable = true;
        }
      }
      return true;
    })

    .add(()=>{ return SequenceHelper.CheckEnemiesLessOrEqual(0) })

    // Battle Over - Claim Storm

    .addIcon(player, Icon.STANDARD, 15 * 1000)
    .addInstruction(Enum.STORY_4_CLAIM_STORM)

    //  Claim the land

    .add(()=>{
      this.doOnce(()=>{
        SequenceHelper.SpawnClaimerFlag(Vars.AREA_WIDTH * 3.38);
      });
      return SaveData.Data.claimed.includes(Enum.LOC_STORM);
    })
    .add(()=>{
      SaveData.Data.claimed.push(Enum.LOC_ROSE_FOREST);
      return true;
    })
    .addWait(3000)

    .addInstruction(Enum.STORY_4_CITIZEN_TRIALS)

    // All citizens display a icon and interact

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
