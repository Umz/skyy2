import AllyStandby from "../ai/AllyStandby";
import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Instructions from "../const/Instructions";
import Sfx from "../const/Sfx";
import Vars from "../const/Vars";
import SaveData from "../util/SaveData";
import Subtitles from "../util/Subtitles";
import SequenceHelper from "./SequenceHelper";

export default class P5 extends TutorialSequence {

  init() {
    
    const player = this.scene.player;
    const script = Subtitles.GetScript();
    const fallen = script.Names.FallenCloud;

    this
    .addTitle(" >>> Transition from battle mode to focus on mining and civilians -")

    .add(()=>{
      const allies = this.scene.groupAllies.getChildren();
      for (let ally of allies) {
        if (ally.uid > 100) {
          ally.home = Enum.LOC_STORM;
          ally.setController(new AllyStandby());
        }
      }
      return true;
    })

    .addTitle(" >>> Night Train appears from the east to get Moon Chief! -")

    .add(()=> {
      this.spawnNT();
      return true;
    })
    .addSave()

    .add(()=>{
      const nt = this.getSoldierbyUID(Enum.ID_NIGHT_TRAIN);
      nt.controller.gotoPlayer();
      return true;
    })

    .addSpeakAndWait(Enum.ID_NIGHT_TRAIN, Icon.HAPPY, script.NightTrain.mines1, 4000, Sfx.VOICE_HO1)
    .addWait(500)
    .addSpeakAndWait(Enum.ID_NIGHT_TRAIN, Icon.ANGER, script.NightTrain.mines2, 5000, Sfx.VOICE_ANGRY3)

    .addIcon(Enum.ID_MOON_CHIEF, Icon.SKY_SPEAR, 3000)
    .addSound(Sfx.VOICE_EFFORT1)
    .addWait(1000)

    .addSpeakAndWait(Enum.ID_NIGHT_TRAIN, Icon.HAND_UP_RIGHT, script.NightTrain.mines3, 2000, Sfx.VOICE_HO1)
    .addWait(500)
    .addUpdateSaveStep()

    .addTitle(" >>> Night Train leads Moon Chief to the mines in the east -", true)

    .addSpeak(Enum.ID_NIGHT_TRAIN, Icon.EXCLAIM, script.NightTrain.come_on, 2000, Sfx.VOICE_EFFORT1)
    .addNightMove(Vars.AREA_WIDTH * 4.1)

    .add(()=> player.x > Vars.AREA_WIDTH * 4 )
    .addNightMove(Vars.AREA_WIDTH * 4.2)

    .add(()=> player.x > Vars.AREA_WIDTH * 4.1 )

    .addSpeak(Enum.ID_NIGHT_TRAIN, Icon.EXCLAIM, script.NightTrain.come_on, 2000, Sfx.VOICE_EFFORT1)
    .addNightMove(Vars.AREA_WIDTH * 4.4)
    .add(()=> player.x > Vars.AREA_WIDTH * 4.3 )
    .addUpdateSaveStep()

    .addTitle(" >>> Moon Chief and Night Train arrive at The Mines together -")

    .addSpeakAndWait(Enum.ID_NIGHT_TRAIN, Icon.BLUE_SILICA, script.NightTrain.mines4, 3000, Sfx.VOICE_HO1)
    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.QUESTION, script.MoonChief.mines1, 2000, Sfx.VOICE_HO2)

    .addSpeakAndWait(Enum.ID_NIGHT_TRAIN, Icon.BLUE_SILICA, script.NightTrain.mines5, 8000, Sfx.VOICE_HO1)
    .addSpeakAndWait(Enum.ID_NIGHT_TRAIN, Icon.EXCLAIM, script.NightTrain.mines6, 7000, Sfx.VOICE_EFFORT1)

    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.QUESTION, script.MoonChief.mines2, 3000, Sfx.VOICE_SIGH1)
    .addSpeakAndWait(Enum.ID_NIGHT_TRAIN, Icon.BLUE_SILICA, script.NightTrain.mines7, 3000, Sfx.VOICE_HO1)

    .addSpeak(Enum.ID_NIGHT_TRAIN, Icon.HAND_DOWN, script.NightTrain.mines8, 7000, Sfx.VOICE_AMUSED1)
    .addWait(500)

    .addIcon(Enum.ID_MOON_CHIEF, Icon.ELLIPSE, 1000)
    .addWait(1000)

    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.DROPLET, script.MoonChief.mines3, 2000, Sfx.VOICE_SIGH1)
    .addWait(500)
    .addUpdateSaveStep()
    .addInstruction(Instructions.P5A_BREAK_ROCKS)
    
    .addTitle(" >>> Moon Chief breaks the rocks for Night Train and escorts him back to storm -")

    .add(()=> SaveData.Data.silica > 7 )
    .addUpdateSaveStep()

    .addSpeakAndWait(Enum.ID_NIGHT_TRAIN, Icon.BLUE_SILICA, script.NightTrain.mines9, 4000, Sfx.VOICE_THANKFUL1)
    .add(()=>{
      const nt = this.getSoldierbyUID(Enum.ID_NIGHT_TRAIN);
      nt.controller.followPlayer();
      return true;
    })

    .add(()=> player.x <= Vars.AREA_WIDTH * 3.5 )
    .addUpdateSaveStep()
    .addNightMove(Vars.AREA_WIDTH * 3.28)

    .addTitle(" >>> Harvest Moon appears and instructs Moon Chief to collect more Blue Silica -", true)

    .add(()=>{
      const x = Vars.AREA_WIDTH * 3.3;
      const hm = this.getCitizenByUID(Enum.ID_HARVEST_MOON);
      hm.setX(x);
      hm.controller.pause();
      return true;
    })

    .add(()=> player.x <= Vars.AREA_WIDTH * 3.3 + 100 )
    .addSpeakCitizenW(Enum.ID_HARVEST_MOON, Icon.BANNER, script.HarvestMoon.storm1, 4000, Sfx.VOICE_YES1)

    .add(()=>{
      const nt = this.getSoldierbyUID(Enum.ID_NIGHT_TRAIN);
      const kk = this.getCitizenByUID(Enum.ID_HARVEST_MOON);
      nt.faceX(kk.x);
      return true;
    })

    .addSpeakAndWait(Enum.ID_NIGHT_TRAIN, Icon.EXCLAIM, script.NightTrain.storm1, 5000, Sfx.VOICE_HO1)
    .addSpeakCitizenW(Enum.ID_HARVEST_MOON, Icon.EXCLAIM, script.HarvestMoon.storm2, 1500, Sfx.VOICE_HO2)
    .addSpeakAndWait(Enum.ID_NIGHT_TRAIN, Icon.HAPPY, script.NightTrain.storm2, 3500, Sfx.VOICE_HO1)

    .addIcon(Enum.ID_MOON_CHIEF, Icon.SLEEP, 3000)
    .addSpeakCitizenW(Enum.ID_HARVEST_MOON, Icon.SPEECH, script.HarvestMoon.storm3, 5500, Sfx.VOICE_HO2)
    .addSpeakAndWait(Enum.ID_NIGHT_TRAIN, Icon.EXCLAIM, script.NightTrain.storm3, 1500, Sfx.VOICE_HO1)

    .add(()=>{
      const hm = this.getCitizenByUID(Enum.ID_HARVEST_MOON);
      hm.controller.resume();

      const nt = this.getSoldierbyUID(Enum.ID_NIGHT_TRAIN);
      nt.controller.gotoPlayer(-32);
      
      return true;
    })
    .addSpeakAndWait(Enum.ID_NIGHT_TRAIN, Icon.HAND_RIGHT, script.NightTrain.storm4, 2500, Sfx.VOICE_EFFORT1)
    .addSave()

    .addInstruction(Instructions.P5B_MISSION)

    .addTitle(" >>> Leave Storm Village and travel toward Green Village - Fight at the Mines", true)

    .add(()=>  player.x >= Vars.AREA_WIDTH * 4.1 )
    .add(()=>{
      const pX = SequenceHelper.GetCameraRight() + Phaser.Math.Between(10, 70);
      SequenceHelper.SpawnEnemiesAt(pX, 6, [Enum.SOLDIER_GR1]);
      return true;
    })

    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.EXCLAIM, script.MoonChief.mines4, 3000, Sfx.VOICE_ATTACK1)

    .addSound(Sfx.VOICE_HO2)
    .addDialogueAndWait(fallen, script.FallenCloud.mines1, 3000)

    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.SKY_SPEAR, script.MoonChief.mines5, 3000, Sfx.VOICE_ATTACK1)

    .add(()=> player.x >= Vars.AREA_WIDTH * 4.3 )
    .add(()=>{
      const left = SequenceHelper.GetCameraLeft() - 28;
      const right = SequenceHelper.GetCameraRight() + 28;
      SequenceHelper.SpawnEnemiesAt(left, 6, [Enum.SOLDIER_GR1]);
      SequenceHelper.SpawnEnemiesAt(right, 6, [Enum.SOLDIER_GR1]);
      return true;
    })
    .add(()=>{
      const boss = SequenceHelper.SpawnEnemy(Vars.AREA_WIDTH * 4.45, Enum.SOLDIER_FALLEN_CLOUD);
      boss.showIcon(Icon.SWORD, 10000);
      boss.setDisplayName(fallen, Enum.TEAM_ENEMY);
      boss.setHP(20, 20);
      boss.setGP(12, 12);
      return true;
    })
    
    .add(()=>{
      return SequenceHelper.CheckEnemiesLessOrEqual(0);
    })
    .addSound(Sfx.VOICE_ANGRY3)
    .addDialogueAndWait(fallen, script.FallenCloud.mines2, 3000)
    .addWait(500)

    .addTitle(" >>> Claim The Mines when Fallen Cloud has been defeated. -", true)

    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.SKY_SPEAR, script.MoonChief.mines6, 3000, Sfx.VOICE_AMUSED3)
    .addSave()

    .addInstruction(Instructions.P5C_CLAIM_MINES)

    .add(()=>{
      this.doOnce(()=>{
        SequenceHelper.SpawnClaimerFlag(Vars.AREA_WIDTH * 4.5);
      });
      return SaveData.Data.claimed.includes(Enum.LOC_MINES);
    })
    .addSave()
    .addWait(3000)
    .addHealing()

    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.HAND_RIGHT, script.MoonChief.mines7, 3000, Sfx.VOICE_HO1)
  }

  //  ===================================================================================================

  /** Spawn Night Train and save soldier data */
  spawnNT() {
    
    const script = Subtitles.GetScript();
    const player = this.scene.player;

    const nighttrain = this.spawnAlly(player.x + 200, Enum.SOLDIER_NIGHTTRAIN, 25, 10, script.Names.NightTrain);
    nighttrain.uid = Enum.ID_NIGHT_TRAIN;
    nighttrain.speed = 128;

    SaveData.SaveSoldierData(nighttrain.getSaveData());
  }

  /** Add code for Night Train to move to position X */
  addNightMove(x) {
    this.add(()=>{
      const nt = this.getSoldierbyUID(Enum.ID_NIGHT_TRAIN);
      nt.controller.gotoX(x);
      return true;
    })
    return this;
  }

}
