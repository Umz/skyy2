import CitizenMaM from "../ai/CitizenMaM";
import CitizenWife from "../ai/CitizenWife";
import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Sfx from "../const/Sfx";
import Vars from "../const/Vars";
import SaveData from "../util/SaveData";
import Subtitles from "../util/Subtitles";
import SequenceHelper from "./SequenceHelper";

export default class P1 extends TutorialSequence {

  init() {

    const script = Subtitles.GetScript();

    this
    .addTitle(" >>> Spawn citizens and setup initial army and in-game characters -")

    .add(()=>{

      for (let i =0; i < 9; i++) {
        
        const x = Phaser.Math.Between(Vars.AREA_WIDTH * 1.4, Vars.AREA_WIDTH * 1.85);
        const ss = Phaser.Utils.Array.GetRandom([Vars.SHEET_CITIZEN_MAM_M1, Vars.SHEET_CITIZEN_MAM_M2, Vars.SHEET_CITIZEN_MAM_F1, Vars.SHEET_CITIZEN_MAM_F2]);

        const citi = this.spawnCitizen(x, ss);
        SaveData.SaveCitizenData(citi.getSaveData())
      }

      //  Specific Sprites -
      
      const king = this.spawnCitizen(Vars.AREA_WIDTH * 1.48, Vars.SHEET_CITIZEN_MAM_KING);
      king.setName(script.Names.HarvestMoon);
      king.uid = Enum.ID_HARVEST_MOON;
      SaveData.SaveCitizenData(king.getSaveData());

      const glow = this.spawnCitizen(Vars.AREA_WIDTH * 1.52, Vars.SHEET_CITIZEN_MAM_GLOW);
      glow.setName(script.Names.MoonGlow);
      glow.setController(new CitizenWife())
      glow.uid = Enum.ID_MOON_GLOW;
      SaveData.SaveCitizenData(glow.getSaveData());

      const rose = this.spawnCitizen(Vars.AREA_WIDTH * 1.48, Vars.SHEET_CITIZEN_MAM_ROSE);
      rose.setName(script.Names.MoonRose);
      rose.setController(new CitizenWife())
      rose.uid = Enum.ID_MOON_ROSE;
      SaveData.SaveCitizenData(rose.getSaveData());

      return true;
    })
    .addSave()

    .addIcon(Enum.ID_MOON_CHIEF, Icon.SKY_SPEAR, 15000)
    .addInstruction(script.Story.P0_INTRO)

    .add(()=>{
      return this.checkCount(2000);
    })
    .addInstruction(script.Story.P1A_APPRENTICE)

    .addCitizenStateChange(Enum.CS_BATTLE_MODE)
    .add(()=>{
      this.doOnce(()=>{
        SequenceHelper.SpawnEnemies(2, [Enum.SOLDIER_BANDIT1]);
      });
      return SequenceHelper.CheckEnemiesLessOrEqual(0);
    })

    .addWait(2000)
    .addUpdateSaveStep()

    .addInstruction(script.Story.P1B_APPRENTICE)
    .add(()=>{
      return this.spawnAndWait(2);
    })

    .addWait(1000)
    .addSpeak(Enum.ID_MOON_CHIEF, Icon.SPEECH, script.MoonChief.peons, 3000, Sfx.VOICE_AMUSED1)
    .add(()=>{
      return this.spawnAndWait(4);
    })

    .addWait(1000)
    .addSpeak(Enum.ID_MOON_CHIEF, Icon.SPEECH, script.MoonChief.taunt, 2000, Sfx.VOICE_AMUSED3)
    .add(()=>{
      return this.spawnAndWait(5);
    })

    .addCitizenStateChange(Enum.CS_IDLE)
    .addWait(1000)
    .addUpdateSaveStep()
    .addInstruction(script.Story.P1C_BLUEFOREST)

    .addIcon(Enum.ID_MOON_CHIEF, Icon.HAND_LEFT, 4000)
    .addHealing()
  }

  //  -

  addCitizenStateChange(state) {
    this.add(()=>{
      const citizens = this.scene.groupCitizens.getChildren();
      for (let citi of citizens) {
        citi.controller.state = state;
        citi.controller.clearAllActions();
      }
      return true;
    });
    return this;
  }

  //  -

  spawnAndWait(amt) {
    this.doOnce(()=>{
      SequenceHelper.SpawnEnemies(amt, [Enum.SOLDIER_BANDIT1]);
    });
    return SequenceHelper.CheckEnemiesLessOrEqual(0);
  }

  //  -

  spawnCitizen(x, sheet) {
    const sprite = this.scene.spawnCitizen(x, sheet);
    sprite.setController(new CitizenMaM());
    sprite.setHome(Enum.LOC_MAM)
    sprite.setTribe(Enum.TRIBE_MAM);
    return sprite;
  }
}
