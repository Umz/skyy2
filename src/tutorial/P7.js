import Lunar1 from "../ai/Lunar1";
import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Vars from "../const/Vars";
import SaveData from "../util/SaveData";
import Subtitles from "../util/Subtitles";
import SequenceHelper from "./SequenceHelper";

let lunar, green, nighttrain, hmoon;

export default class P7 extends TutorialSequence {

  init() {
    
    // Take the Architect and return home

    const { scene } = this;
    const player = this.scene.player;
    const script = Subtitles.GetScript();
    const WIDTH = Vars.AREA_WIDTH;

    const villageX = Vars.AREA_WIDTH * 7;

    const soldier = "Soldier";

    this
    .addStopSaving()  // Temp (dev)

    // Clear any local soldiers.

    .add(()=>{
      SequenceHelper.SpawnEnemiesAt(WIDTH * 7.1, 3, [Enum.SOLDIER_WL_HEAVY]);
      player.x = WIDTH * 6.9;
      return true;
    })
    .addDialogueAndWait(soldier, script.Soldier.halt, 2000)

    .add(()=>{
      lunar = SequenceHelper.SpawnAlly(WIDTH * 7.5, Enum.SOLDIER_ARCHITECT);
      lunar.setDisplayName("The Architect", Enum.TEAM_ALLY);
      return true;
    })
    .add(()=>{ return player.x >= Vars.AREA_WIDTH * 7.4 })

    .addTitle("Moon Chief meets the Architect and recruits him")

    .addSpeakerAndWait(player, Icon.SPEECH, script.MoonChief.green1, 1500)
    .addWait(500)
    .add(()=>{
      lunar.faceX(player.x);
      return true;
    })
    .addLunarSpeakAndWait(Icon.QUESTION, script.Lunar.green1, 2000)
    .addWait(500)
    .addSpeakerAndWait(player, Icon.BANNER, script.MoonChief.green2, 6000)
    .addWait(500)
    .addLunarSpeakAndWait(Icon.BANNER, script.Lunar.green2, 2000)

    .addTitle("The Architect joins Moon Chief and leaves with him")

    .add(()=>{
      lunar.controller.gotoX(WIDTH * 7.19)
      return true;
    })
    .add(()=>{
      lunar.showIcon(Icon.BANNER, 60 * 1000)
      return true;
    })
    .add(()=>{ return lunar.x <= Vars.AREA_WIDTH * 7.2 })
    .addDialogue(soldier, script.Soldier.traitor, 2000)
    
    .addTitle("Soldiers to try and stop The Architect from defecting")

    .add(()=>{
      const pX = Math.min(player.x - 140, lunar.x - 140);
      SequenceHelper.SpawnEnemiesAt(pX, 6, [Enum.SOLDIER_WL_HEAVY])
      return true;
    })
    .add(()=> SequenceHelper.CheckEnemiesLessOrEqual(0))

    .addSpeakerAndWait(player, Icon.SPEECH, "Go to Moon at Midnight. I will hold them!", 4000)
    .addLunarSpeakAndWait(Icon.EXCLAIM, "You. Alone?", 1500)
    .addSpeakerAndWait(player, Icon.SPEAR2, "I am the mighty Moon Chief! I will hold them!", 4000)

    .add(()=>{
      const blue = scene.bluemoon;
      blue.setController(new Lunar1());
      blue.controller.gotoX(WIDTH * 4.7);
      lunar.controller.gotoX(WIDTH * 1.5);
      return true;
    })
    .addInstruction(Enum.STORY_6_HOLD)

    .addTitle("Moon Chief stays in Green Village to hold back the enemies")

    .add(()=>{
      SequenceHelper.SpawnEnemiesAt(player.x + 100, 6, [Enum.SOLDIER_WL_INFANTRY]);
      return true;
    })
    .add(()=> SequenceHelper.CheckEnemiesLessOrEqual(0))

    .add(()=>{
      SequenceHelper.SpawnEnemiesAt(player.x - 100, 2, [Enum.SOLDIER_WL_HEAVY]);
      SequenceHelper.SpawnEnemiesAt(player.x + 100, 4, [Enum.SOLDIER_WL_INFANTRY]);
      return true;
    })
    .add(()=> SequenceHelper.CheckEnemiesLessOrEqual(0))

    .addSpeakerAndWait(player, Icon.HOME, "Time to head back now.", 2000)

    .add(()=>{ return player.x <= Vars.AREA_WIDTH * 7 })
    .add(()=>{
      SequenceHelper.SpawnEnemiesAt(player.x - 100, 2, [Enum.SOLDIER_WL_INFANTRY]);
      return true;
    })
    .add(()=> SequenceHelper.CheckEnemiesLessOrEqual(0))

    .add(()=>{ return player.x <= Vars.AREA_WIDTH * 6.9 })

    .add(()=>{
      SequenceHelper.SpawnEnemiesAt(player.x - 100, 2, [Enum.SOLDIER_WL_HEAVY]);
      SequenceHelper.SpawnEnemiesAt(player.x - 140, 3, [Enum.SOLDIER_WL_INFANTRY]);
      return true;
    })
    .add(()=> SequenceHelper.CheckEnemiesLessOrEqual(0))

    .addTitle("Moon Chief leaves the village and runs into Green Sword.", true)

    .add(()=>{ return player.x <= Vars.AREA_WIDTH * 6.4 })
    .add(()=>{
      green = SequenceHelper.SpawnEnemy(WIDTH * 6.3, Enum.SOLDIER_WL_GREEN_SWORD);
      green.setDisplayName("Green Sword", Enum.TEAM_ENEMY);
      green.setHP(20, 20);
      return true;
    })

    .addGreenSwordSpeakAndWait(Icon.SWORD, "Moon Chief. I am Green Sword of Green Village.", 3000)
    .addSpeakerAndWait(player, Icon.SPEAR2, "A true warrior. Let us battle to the bitter end.", 3000)

    .addTitle("Fade out the screen to black and jump to Moon at Midnight with everyone.")

    .add(()=>{ return player.x <= Vars.AREA_WIDTH * 5.5 })

    .add(() => {
      const ele = document.getElementById("blackout-container");
      ele.style.display = "block";
      ele.classList.add("fade-to-black");
      return true;
    })
    .addWait(2000)
    .add(() => {
      lunar.changeTexture(Vars.SHEET_LUNAR);
      lunar.setHP(15, 15);

      const mam = WIDTH * 1.5;
      // move location
      lunar.x = mam + 20;
      player.x = mam + 80;

      nighttrain = SequenceHelper.SpawnAlly(mam - 60, Enum.SOLDIER_NIGHTTRAIN);
      nighttrain.setController(new Lunar1());
      nighttrain.faceX(lunar.x);

      return true;
    })
    
    .addWait(500)
    .add(() => {
      const ele = document.getElementById("blackout-container");
      ele.classList.remove("fade-to-black");
      ele.classList.add("fade-from-black");
      return true;
    })
    .addWait(2000)
    .add(() => {
      const ele = document.getElementById("blackout-container");
      ele.style.display = "none";
      return true;
    })

    .addTitle("The Architect joins Moon at Midnight and becomes Lunar")

    .addSpeakerAndWait(player, Icon.EXCLAIM, "We have returned!", 2000)
    .addLunarSpeakAndWait(Icon.HAPPY, "Finally. I am free of Whiteleaf.", 3000)
    .addNTSpeakAndWait(Icon.HOME, "Architect. Welcome to Moon at Midnight!", 4000)
    .addLunarSpeakAndWait(Icon.BANNER, "I am honoured to fly with the tribe!", 3000)

    .addWait(500)
    .addSpeakerAndWait(player, Icon.EXCLAIM, "Do you have a name for him?", 2000)
    .addNTSpeakAndWait(Icon.HOME, "Lunar.", 1000)
    .addWait(1000)
    
    .add(() => {
      lunar.attack();
      lunar.setDisplayName("Lunar", Enum.TEAM_ALLY);
      return true;
    })
    .addLunarSpeakAndWait(Icon.BANNER, "I am Lunar the Architect of Moon at Midnight!", 5000)
    .addWait(1000)
    
    .add(() => {
      return false;
    })

  }

  //  ====================================================================================================

  /** Add speech for Lunar and wait for completion */
  addLunarSpeakAndWait(icon, text, ttl) {
    this
    .add(()=>{
      lunar.speak(icon, text, ttl);
      return true;
    })
    .addWaitForDialogue();
    return this;
  }

  /** Add speech for Night Train and wait for completion */
  addNTSpeakAndWait(icon, text, ttl) {
    this
    .add(()=>{
      nighttrain.speak(icon, text, ttl);
      return true;
    })
    .addWaitForDialogue();
    return this;
  }

  /** Add speech for Green Sword and wait for completion */
  addGreenSwordSpeakAndWait(icon, text, ttl) {
    this
    .add(()=>{
      green.speak(icon, text, ttl);
      return true;
    })
    .addWaitForDialogue();
    return this;
  }
}
