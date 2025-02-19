import CitizenBattle from "../ai/CitizenBattle";
import CitizenCaptive from "../ai/CitizenCaptive";
import RedDuel from "../ai/RedDuel";
import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Instructions from "../const/Instructions";
import Vars from "../const/Vars";
import SaveData from "../util/SaveData";
import Subtitles from "../util/Subtitles";
import SequenceHelper from "./SequenceHelper";

export default class P4 extends TutorialSequence {

  init() {

    const { scene } = this;
    const player = this.scene.player;
    const script = Subtitles.GetScript();

    const roseForestX = Vars.AREA_WIDTH * 2;
    const stormVillageX = Vars.AREA_WIDTH * 3;
    const bossName = "Red Face";

    this.enemies = [];
    this.allies = [];

    //  - Take down Red Face and claim Storm Village -

    this

    .addIcon(player, Icon.ANGER, 3000)
    .add(()=> player.x > roseForestX + 100)
    .addIcon(player, Icon.BANNER, 7000)

    .addTitle("Entering Rose Forest -----")

    .addDialogue(bossName, script.RedFace.rose1, 7000)
    .add(()=>{
      SequenceHelper.SpawnAlly(player.x - 24, Enum.SOLDIER_ALLY_HEAVY1);
      SequenceHelper.SpawnAlly(player.x - 48, Enum.SOLDIER_ALLY_HEAVY1);
      return true;
    })

    .addEnemiesRight(6, Enum.SOLDIER_BANDIT2, Enum.SOLDIER_RED1)
    .addEnemiesRight(2, Enum.SOLDIER_RED3)

    .add(()=>{
      this.spawnConstantRight(6, 1);
      return player.x >= roseForestX + Vars.AREA_WIDTH * .4;
    })
    .addDialogue(bossName, script.RedFace.rose2, 5000)

    .addTitle("Half way point in Rose Forest -----")

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
      return player.x >= roseForestX + Vars.AREA_WIDTH * .7;
    })
    .addDialogue(bossName, script.RedFace.rose3, 5000)

    .addTitle("Spawning Civilians for Storm Village -----")

    .add(()=>{
      return player.x >= roseForestX + Vars.AREA_WIDTH * .8;
    })
    .add(()=>{
      for (let i =0; i < 15; i++) {
        const x = Phaser.Math.Between(Vars.AREA_WIDTH * 3.1, Vars.AREA_WIDTH * 3.9);
        const ss = Phaser.Utils.Array.GetRandom([Vars.SHEET_CITIZEN_STORM_F1, Vars.SHEET_CITIZEN_STORM_F2, Vars.SHEET_CITIZEN_STORM_M1]);
        const citi = scene.spawnCitizen(x, ss);
        citi.setController(new CitizenBattle());
        citi.setData("isJoining", i < 10);

        SaveData.Data.citizens.push(citi.saveData); // Save citizens once spawned
      }
      return true;
    })

    .add(()=>{
      this.spawnConstantRight(6, 1);
      return player.x >= stormVillageX;
    })

    .addTitle("Starting the Duel -----")

    .addSave()
    .addStopSaving()
    
    .addRedFaceForDuel()
    .add(()=>{
      this.redface.speak(Icon.SWORD, script.RedFace.rose4, 6000);
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
    .addWaitForDialogue()
    .addShowDuelDOM()

    .add(()=>{
      return this.redface.hp <= 0;
    })
    .addHideDuelDOM()
    .addDialogueAndWait(bossName, script.RedFace.death, 7000)

    .addTitle("Ending the Duel -----")

    .addSave()
    .addStartSaving()
    .addWait(2000)

    .addSpeakerAndWait(player, Icon.BANNER, script.MoonChief.rose1, 7000)
    .addWait(500)
    .addSpeakerAndWait(player, Icon.SKY_SPEAR, script.MoonChief.rose2, 4000)

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

    .addTitle("Battle is Over with all enemies dead - Claim Storm Village for MaM")

    .addIcon(player, Icon.STANDARD, 15 * 1000)
    .addInstruction(Instructions.P4A_CLAIM_STORM)

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
    .addHealing()
    .addInstruction(Instructions.P4B_CITIZEN_TRIALS)

    .addTitle("Citizens set to Captive behaviour -----")

    .add(()=>{
      const citizens = scene.groupCitizens.getChildren();
      for (let citi of citizens) {
        citi.setController(new CitizenCaptive());
      }
      return true;
    })

    .add(()=>{
      const storm = scene.countCitizensOfLoc(Enum.LOC_STORM);
      const mam = scene.countCitizensOfLocTribe(Enum.LOC_STORM, Enum.TRIBE_MAM);
      return storm === mam;
    })

    .addWait(4000)
    .addSpeakerAndWait(player, Icon.SKY_SPEAR, script.MoonChief.rose3, 4000)
  }

  //  - P4 functions    --------------------------------------------------------------------------------

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
