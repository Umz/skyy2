import CitizenBattle from "../ai/CitizenBattle";
import CitizenCaptive from "../ai/CitizenCaptive";
import RedDuel from "../ai/RedDuel";
import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Instructions from "../const/Instructions";
import Sfx from "../const/Sfx";
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

    const bossName = script.Names.RedFace;

    this.enemies = [];
    this.allies = [];

    //  - Take down Red Face and claim Storm Village -

    this
    .addTitle(" >>> Player must pursue Red Face into the forest and fight in a duel -")

    .addIcon(Enum.ID_MOON_CHIEF, Icon.ANGER, 3000)
    .add(()=> player.x > roseForestX + 100)
    .addIcon(Enum.ID_MOON_CHIEF, Icon.BANNER, 7000)

    .addTitle(" >>> Entering Rose Forest or past the initial forest line -")

    .addDialogue(bossName, script.RedFace.rose1, 7000)
    .addSound(Sfx.VOICE_HO1)
    .add(()=>{
      SequenceHelper.SpawnAlly(player.x - 24, Enum.SOLDIER_ALLY_HEAVY1);
      SequenceHelper.SpawnAlly(player.x - 48, Enum.SOLDIER_ALLY_HEAVY1);
      SequenceHelper.SpawnAlly(player.x - 32, Enum.SOLDIER_ALLY_INFANTRY1);
      SequenceHelper.SpawnAlly(player.x - 40, Enum.SOLDIER_ALLY_INFANTRY1);
      return true;
    })

    .addEnemiesRight(6, Enum.SOLDIER_BANDIT2, Enum.SOLDIER_RED1)
    .addEnemiesRight(2, Enum.SOLDIER_RED3)

    .add(()=>{
      this.spawnConstantRight(6, 1);
      return player.x >= roseForestX + Vars.AREA_WIDTH * .4;
    })
    .addDialogue(bossName, script.RedFace.rose2, 5000)
    .addSound(Sfx.VOICE_ATTACK1)

    .addTitle(" >>> Half way point in Rose Forest add more troops to the battle -")

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
    .addIcon(Enum.ID_MOON_CHIEF, Icon.BANNER, 20 * 1000)

    .addEnemiesRight(10, Enum.SOLDIER_BANDIT2, Enum.SOLDIER_RED1)
    .addEnemiesRight(6, Enum.SOLDIER_RED3)

    .add(()=>{
      this.spawnConstantRight(4, 1);
      return player.x >= roseForestX + Vars.AREA_WIDTH * .7;
    })
    .addDialogue(bossName, script.RedFace.rose3, 5000)
    .addSound(Sfx.VOICE_HO1)

    .addTitle(" >>> Spawn Civilians for Storm Village in initial battle mode -")

    .add(()=>{
      return player.x >= roseForestX + Vars.AREA_WIDTH * .8;
    })
    .add(()=>{

      for (let i =0; i < 15; i++) {
        
        const x = Phaser.Math.Between(Vars.AREA_WIDTH * 3.1, Vars.AREA_WIDTH * 3.9);
        const ss = Phaser.Utils.Array.GetRandom([Vars.SHEET_CITIZEN_STORM_F1, Vars.SHEET_CITIZEN_STORM_F2, Vars.SHEET_CITIZEN_STORM_M1]);

        const citi = this.spawnCitizen(x, ss);
        citi.setController(new CitizenBattle());
        citi.setData("isJoining", i < 10);

        SaveData.Data.citizens.push(citi.getSaveData());
      }

      return true;
    })

    .add(()=>{
      this.spawnConstantRight(6, 1);
      return player.x >= stormVillageX;
    })

    .addTitle(" >>> When Player reaches far right start the Duel -")

    .addSave()
    .addStopSaving()
    
    .addRedFace()
    .addSound(Sfx.VOICE_AMUSED1)
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
    .addSound(Sfx.VOICE_LAUGH1)
    .addHideDuelDOM()
    .addDialogueAndWait(bossName, script.RedFace.death, 7000)

    .addTitle(" >>> Duel ends with final words and Red Face defeated -")

    .addSave()
    .addStartSaving()
    .addWait(2000)

    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.BANNER, script.MoonChief.rose1, 7000, Sfx.VOICE_EFFORT1)
    .addWait(500)
    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.SKY_SPEAR, script.MoonChief.rose2, 4000, Sfx.VOICE_EFFORT1)

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
    .addWait(3000)

    .addTitle(" >>> Battle is Over with all enemies dead - Claim Storm Village for MaM -")

    .addIcon(Enum.ID_MOON_CHIEF, Icon.STANDARD, 15 * 1000)
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
    .addSave()

    .addWait(3000)
    .addHealing()
    .addInstruction(Instructions.P4B_CITIZEN_TRIALS)

    .addTitle(" >>> Citizens set to Captive behaviour and wait till all have been interacted with -")

    .add(()=>{
      const all = scene.groupCitizens.getChildren();
      const citizens = all.filter(ss => ss.tribe === Enum.TRIBE_STORM);
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
    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.SKY_SPEAR, script.MoonChief.rose3, 4000, Sfx.VOICE_HO1)
  }

  //  - P4 functions    --------------------------------------------------------------------------------

  addRedFace() {
    this.add(()=>{
      const { right } = this.scene.cameras.main.worldView;
      this.redface = this.spawnEnemy(right - 60, Enum.SOLDIER_REDFACE, 15, 10, "Red Face");
      this.redface.setController(new RedDuel());
      return true;
    });
    return this;
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

  //  -

  spawnCitizen(x, sheet) {
    const sprite = this.scene.spawnCitizen(x, sheet);
    sprite.setHome(Enum.LOC_STORM)
    sprite.setTribe(Enum.TRIBE_STORM);
    return sprite;
  }

}
