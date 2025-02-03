import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Vars from "../const/Vars";
import SaveData from "../util/SaveData";
import Subtitles from "../util/Subtitles";
import SequenceHelper from "./SequenceHelper";

let night;
let king;
let boss;

export default class P5 extends TutorialSequence {

  init() {
    
    const { scene } = this;
    const player = this.scene.player;
    const script = Subtitles.GetScript();

    const fallen = "Fallen Cloud";
    const nt = "Night Train";

    this

    .addTitle("Night Train appears from the east to get Moon Chief!")

    .add(()=> {
      night = SequenceHelper.SpawnAlly(player.x + 200, Enum.SOLDIER_NIGHTTRAIN);
      night.speed = 128;
      night.setDisplayName(nt, Enum.TEAM_ALLY);
      return true;
    })

    .add(()=>{
      night.controller.gotoPlayer();
      return true;
    })
    .addSpeakNightAndWait(Icon.HAPPY, script.NightTrain.mines1, 4000)
    .addWait(500)
    .addSpeakNightAndWait(Icon.ANGER, script.NightTrain.mines2, 5000)
    .addIcon(player, Icon.SKY_SPEAR, 3000)

    .addWait(2000)
    .addSpeakNightAndWait(Icon.HAND_UP_RIGHT, script.NightTrain.mines3, 2000)
    .addWait(500)

    .add(()=>{
      night.speak(Icon.EXCLAIM, script.NightTrain.come_on, 2000);
      night.controller.gotoX(Vars.AREA_WIDTH * 4.1);
      return true;
    })

    .add(()=>{
      return (player.x > Vars.AREA_WIDTH * 4);
    })
    .add(()=>{
      night.controller.gotoX(Vars.AREA_WIDTH * 4.2);
      return true;
    })

    .add(()=>{
      return (player.x > Vars.AREA_WIDTH * 4.1);
    })
    .add(()=>{
      night.speak(Icon.EXCLAIM, script.NightTrain.come_on, 2000);
      night.controller.gotoX(Vars.AREA_WIDTH * 4.4);
      return true;
    })
    .add(()=>{
      return (player.x > Vars.AREA_WIDTH * 4.3);
    })

    .addTitle("Moon Chief and Night Train arrive at The Mines together")

    .addSpeakNightAndWait(Icon.BLUE_SILICA, script.NightTrain.mines4, 3000)
    .addSpeakerAndWait(player, Icon.QUESTION, script.MoonChief.mines1, 2000)

    .addSpeakNightAndWait(Icon.BLUE_SILICA, script.NightTrain.mines5, 8000)
    .addSpeakNightAndWait(Icon.EXCLAIM, script.NightTrain.mines6, 7000)

    .addSpeakerAndWait(player, Icon.QUESTION, script.MoonChief.mines2, 3000)
    .addSpeakNightAndWait(Icon.BLUE_SILICA, script.NightTrain.mines7, 3000)

    .add(()=>{
      night.speak(Icon.HAND_DOWN, script.NightTrain.mines8, 7000)
      return true;
    })
    .addWait(500)

    .addIcon(player, Icon.ELLIPSE, 1000)
    .addWait(1000)
    .addSpeakerAndWait(player, Icon.DROPLET, script.MoonChief.mines3, 2000)

    .addWait(500)
    .addInstruction(Enum.STORY_5_BREAK_ROCKS)
    
    .addTitle("Moon Chief breaks the rocks for Night Train and escorts him back")

    .add(()=>{
      return SaveData.Data.silica > 7;
    })

    .addSpeakNightAndWait(Icon.BLUE_SILICA, script.NightTrain.mines9, 4000)
    .add(()=>{
      night.controller.followPlayer();
      return true;
    })

    .add(()=>{
      return player.x <= Vars.AREA_WIDTH * 3.5;
    })
    .add(()=>{
      night.controller.gotoX(Vars.AREA_WIDTH * 3.28);
      return true;
    })

    .addTitle("Harvest Moon appears and instructs Moon Chief to collect more Blue Silica")

    .add(()=>{
      const x = Vars.AREA_WIDTH * 3.3;
      king = scene.spawnCitizen(x, Vars.SHEET_CITIZEN_MAM_KING);
      return true;
    })

    .add(()=>{ return player.x <= Vars.AREA_WIDTH * 3.3 + 100 })
    .addSpeakKingAndWait(Icon.BANNER, script.HarvestMoon.storm1, 4000)

    .add(()=>{
      night.faceX(king.x);
      return true;
    })
    .addSpeakNightAndWait(Icon.EXCLAIM, script.NightTrain.storm1, 5000)
    .addSpeakKingAndWait(Icon.EXCLAIM, script.HarvestMoon.storm2, 1500)
    .addSpeakNightAndWait(Icon.HAPPY, script.NightTrain.storm2, 3500)

    .addIcon(player, Icon.SLEEP, 3000)
    .addSpeakKingAndWait(Icon.SPEECH, script.HarvestMoon.storm3, 5500)
    .addSpeakNightAndWait(Icon.EXCLAIM, script.NightTrain.storm3, 1500)

    .add(()=>{
      night.controller.gotoPlayer(-32)
      return true;
    })
    .addSpeakNightAndWait(Icon.HAND_RIGHT, script.NightTrain.storm4, 2500)

    .addInstruction(Enum.STORY_5_MISSION)

    .addTitle("Leave Storm Village and travel toward Green Village - Fight at the Mines", true)

    .add(()=>{
      return player.x >= Vars.AREA_WIDTH * 4.1;
    })
    .add(()=>{
      const pX = SequenceHelper.GetCameraRight() + Phaser.Math.Between(10, 70);
      SequenceHelper.SpawnEnemiesAt(pX, 6, [Enum.SOLDIER_GR1]);
      return true;
    })
    .addSpeakerAndWait(player, Icon.EXCLAIM, script.MoonChief.mines4, 3000)
    .addDialogueAndWait(fallen, script.FallenCloud.mines1, 3000)
    .addSpeakerAndWait(player, Icon.SKY_SPEAR, script.MoonChief.mines5, 3000)

    .add(()=>{
      return player.x >= Vars.AREA_WIDTH * 4.3;
    })
    .add(()=>{
      const left = SequenceHelper.GetCameraLeft() - 28;
      const right = SequenceHelper.GetCameraRight() + 28;
      SequenceHelper.SpawnEnemiesAt(left, 6, [Enum.SOLDIER_GR1]);
      SequenceHelper.SpawnEnemiesAt(right, 6, [Enum.SOLDIER_GR1]);
      return true;
    })
    .add(()=>{
      boss = SequenceHelper.SpawnEnemy(Vars.AREA_WIDTH * 4.45, Enum.SOLDIER_FALLEN_CLOUD);
      boss.showIcon(Icon.SWORD, 10000);
      boss.setDisplayName(fallen, Enum.TEAM_ENEMY);
      boss.setHP(20, 20);
      boss.setGP(12, 12);
      return true;
    })
    
    .add(()=>{
      return SequenceHelper.CheckEnemiesLessOrEqual(0);
    })
    .addDialogueAndWait(fallen, script.FallenCloud.mines2, 3000)
    .addWait(500)

    .addTitle("Claim The Mines when Fallen Cloud has been defeated.")
    .addSpeakerAndWait(player, Icon.SKY_SPEAR, script.MoonChief.mines6, 3000)

    .addInstruction(Enum.STORY_5_CLAIM_MINES)

    .add(()=>{
      this.doOnce(()=>{
        SequenceHelper.SpawnClaimerFlag(Vars.AREA_WIDTH * 4.5);
      });
      return SaveData.Data.claimed.includes(Enum.LOC_MINES);
    })
    .addWait(3000)

    .addSpeakerAndWait(player, Icon.HAND_RIGHT, "Now. To Green Village in the east.", 3000)
  }

  //  ===================================================================================================

  /** Night train speaking with Icon */
  addSpeakNightAndWait(icon, text, ttl) {
    this.add(()=> {
      night.speak(icon, text, ttl);
      return true;
    })
    .addWaitForDialogue()
    return this;
  }

  /** Night train speaking with Icon */
  addSpeakKingAndWait(icon, text, ttl) {
    this.add(()=> {
      king.speak(icon, text, ttl);
      return true;
    })
    .addWaitForDialogue()
    return this;
  }

  /** Fallen Cloud speaking with Icon */
  addBossSpeakAndWait(icon, text, ttl) {
    this.add(()=> {
      boss.speak(icon, text, ttl);
      return true;
    })
    .addWaitForDialogue()
    return this;
  }

}
