import CitizenBattle from "../ai/CitizenBattle";
import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Sfx from "../const/Sfx";
import Vars from "../const/Vars";
import SaveData from "../util/SaveData";
import Subtitles from "../util/Subtitles";

export default class P6 extends TutorialSequence {
  init() {

    const script = Subtitles.GetScript();

    this
    .addTitle(" >>> Just generic conversations until Moon Chief and Blue Moon reach Green Village -")
    
    .addPlayerDistanceCheck(4.8)
    .addSpeakAndWait(Enum.ID_BLUE_MOON, Icon.EXCLAIM, script.BlueMoon.plains1, 3000, Sfx.VOICE_AMUSED1)
    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.QUESTION, script.MoonChief.plains1, 2000, Sfx.VOICE_HO1)
    .addSpeakAndWait(Enum.ID_BLUE_MOON, Icon.QUESTION, script.BlueMoon.plains2, 1000, Sfx.VOICE_SIGH1)
    .addUpdateSaveStep()

    .addPlayerDistanceCheck(5.1)
    .addSpeakAndWait(Enum.ID_BLUE_MOON, Icon.SPEECH, script.BlueMoon.plains3, 2000, Sfx.VOICE_SIGH1)
    .addUpdateSaveStep()

    .addPlayerDistanceCheck(5.5)
    .addSpeakAndWait(Enum.ID_BLUE_MOON, Icon.QUESTION, script.BlueMoon.plains4, 3000, Sfx.VOICE_HO2)
    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.STAR_THREE, script.MoonChief.plains2, 2000, Sfx.VOICE_AMUSED1)
    .addUpdateSaveStep()

    .addPlayerDistanceCheck(5.9)
    .addSpeakAndWait(Enum.ID_BLUE_MOON, Icon.QUESTION, script.BlueMoon.plains5, 3000, Sfx.VOICE_HO2)
    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.EXCLAIM, script.MoonChief.plains3, 2000, Sfx.VOICE_AMUSED1)
    .addUpdateSaveStep()

    .addTitle(" >>> Blue Moon - Should we claim these lands -")

    .addPlayerDistanceCheck(6.2)
    .addSpeakAndWait(Enum.ID_BLUE_MOON, Icon.BANNER, script.BlueMoon.plains6, 2000, Sfx.VOICE_HO2)
    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.SPEECH, script.MoonChief.plains4, 2000, Sfx.VOICE_HO1)
    .addSave()

    .addTitle(" >>> Blue Moon - How are we going to get the Architect -")

    .addPlayerDistanceCheck(6.6)

    .add(()=>{

      for (let i =0; i < 12; i++) {
        
        const x = Phaser.Math.Between(Vars.AREA_WIDTH * 7.1, Vars.AREA_WIDTH * 7.9);
        const ss = Phaser.Utils.Array.GetRandom([
          Vars.SHEET_CITIZEN_GV_M1,
          Vars.SHEET_CITIZEN_GV_M2,
          Vars.SHEET_CITIZEN_GV_F1,
          Vars.SHEET_CITIZEN_GV_F2,
        ]);

        const citi = this.spawnCitizen(x, ss);
        SaveData.Data.citizens.push(citi.getSaveData());
      }

      const chief = this.spawnCitizen(Vars.AREA_WIDTH * 7.4, Vars.SHEET_CITIZEN_GV_CHIEF);
      chief.setName(script.Names.GreenChief);
      chief.uid = Enum.ID_GREEN_CHIEF;
      SaveData.Data.citizens.push(chief.getSaveData());

      return true;
    })
    .addSave()

    .addSpeakAndWait(Enum.ID_BLUE_MOON, Icon.QUESTION, script.BlueMoon.plains7, 3000, Sfx.VOICE_HO2)
    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.SKY_SPEAR, script.MoonChief.plains5, 2000, Sfx.VOICE_LAUGH1)

    .addInstruction(script.Story.P6A_GREEN_VILLAGE);
  }

  //  =================================================================================================

  /** Add distance check for Player */
  addPlayerDistanceCheck(mul) {
    const player = this.scene.player;
    this.add(() => {
      return player.x >= Vars.AREA_WIDTH * mul;
    });
    return this;
  }

  spawnCitizen(x, sheet) {
    const sprite = this.scene.spawnCitizen(x, sheet);
    sprite.setController(new CitizenBattle());
    sprite.setHome(Enum.LOC_GREEN)
    sprite.setTribe(Enum.TRIBE_WHITELEAF);
    return sprite;
  }

}