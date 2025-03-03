import Lunar1 from "../ai/Lunar1";
import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Instructions from "../const/Instructions";
import Vars from "../const/Vars";
import Subtitles from "../util/Subtitles";
import SequenceHelper from "./SequenceHelper";

let green, nighttrain, spriteLunar;

export default class P7 extends TutorialSequence {

  init() {
    
    const { scene } = this;
    const player = this.scene.player;
    const script = Subtitles.GetScript();
    const WIDTH = Vars.AREA_WIDTH;  // Green Village x7

    const soldier = "Soldier";
    const nameGreen = "Green Sword";
    const nameLunar = "Lunar";

    this
    .addTitle(" >>> Section to take the Architect and fight the way home -")

    .add(()=>{ return player.x >= Vars.AREA_WIDTH * 6.8 })
    .add(()=>{
      SequenceHelper.SpawnEnemiesAt(WIDTH * 7.1, 3, [Enum.SOLDIER_WL_HEAVY]);
      return true;
    })
    .add(()=>{ return player.x >= Vars.AREA_WIDTH * 6.9 })
    .addDialogueAndWait(soldier, script.Soldier.halt, 2000)

    .add(()=>{
      this.lunar.setDisplayName("The Architect", Enum.TEAM_ALLY);
      return true;
    })
    .add(()=>{ return player.x >= Vars.AREA_WIDTH * 7.4 })

    .addTitle("Moon Chief meets the Architect and recruits him")

    .addSpeakerAndWait(player, Icon.SPEECH, script.MoonChief.green1, 1500)
    .addWait(500)
    .add(()=>{
      this.lunar.faceX(player.x);
      return true;
    })
    .addLunarSpeakAndWait(Icon.QUESTION, script.Lunar.green1, 2000)
    .addWait(500)
    .addSpeakerAndWait(player, Icon.BANNER, script.MoonChief.green2, 6000)
    .addWait(500)
    .addLunarSpeakAndWait(Icon.BANNER, script.Lunar.green2, 2000)

    .addTitle("The Architect joins Moon Chief and leaves with him")

    .add(()=>{
      this.lunar.controller.gotoX(WIDTH * 7.19)
      return true;
    })
    .add(()=>{
      this.lunar.showIcon(Icon.BANNER, 60 * 1000)
      return true;
    })
    .add(()=>{ return this.lunar.x <= Vars.AREA_WIDTH * 7.2 })
    .addDialogue(soldier, script.Soldier.traitor, 2000)
    
    .addTitle("Soldiers to try and stop The Architect from defecting")

    .add(()=>{
      const pX = Math.min(player.x - 140, this.lunar.x - 140);
      SequenceHelper.SpawnEnemiesAt(pX, 6, [Enum.SOLDIER_WL_HEAVY])
      return true;
    })
    .add(()=> SequenceHelper.CheckEnemiesLessOrEqual(0))

    .addSpeakerAndWait(player, Icon.SPEECH, script.MoonChief.green3, 4000)
    .addLunarSpeakAndWait(Icon.EXCLAIM, script.Lunar.green3, 1500)
    .addSpeakerAndWait(player, Icon.SKY_SPEAR, script.MoonChief.green4, 4000)

    .add(()=>{
      const blue = scene.bluemoon;
      blue.setController(new Lunar1());
      blue.controller.gotoX(WIDTH * 4.7);
      this.lunar.controller.gotoX(WIDTH * 1.5);
      return true;
    })
    .addInstruction(Instructions.P7A_HOLD)

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

    .addSpeakerAndWait(player, Icon.HOME, script.MoonChief.green5, 2000)

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
      green.setDisplayName(nameGreen, Enum.TEAM_ENEMY);
      green.setHP(20, 20);
      return true;
    })

    .addGreenSwordSpeakAndWait(Icon.SWORD, script.GreenSword.green1, 3000)
    .addSpeakerAndWait(player, Icon.SKY_SPEAR, script.MoonChief.green6, 3000)
    .add(() => green.isDead())

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
      this.lunar.changeTexture(Vars.SHEET_LUNAR);
      this.lunar.setHP(15, 15);

      const mam = WIDTH * 1.5;
      // move location
      this.lunar.x = mam + 20;
      player.x = mam + 80;

      nighttrain = SequenceHelper.SpawnAlly(mam - 60, Enum.SOLDIER_NIGHTTRAIN);
      nighttrain.setController(new Lunar1());
      nighttrain.faceX(this.lunar.x);

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

    .addSpeakerAndWait(player, Icon.EXCLAIM, script.MoonChief.green7, 2000)
    .addLunarSpeakAndWait(Icon.HAPPY, script.Lunar.green4, 3000)
    .addNTSpeakAndWait(Icon.HOME, script.NightTrain.green1, 4000)
    .addLunarSpeakAndWait(Icon.BANNER, script.Lunar.green5, 3000)

    .addWait(500)
    .addSpeakerAndWait(player, Icon.QUESTION, script.MoonChief.green8, 2000)
    .addNTSpeakAndWait(Icon.EXCLAIM, nameLunar, 1000)
    .addWait(1000)
    
    .add(() => {
      this.lunar.attack();
      this.lunar.setDisplayName(nameLunar, Enum.TEAM_ALLY);
      return true;
    })
    .addLunarSpeakAndWait(Icon.BANNER, script.Lunar.green6, 5000)
    .addWait(1000)
    
  }

  //  ====================================================================================================

  /** Add speech for Lunar and wait for completion */
  addLunarSpeakAndWait(icon, text, ttl) {
    this
    .add(()=>{
      this.lunar.speak(icon, text, ttl);
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

  //  - Creation of Sprites -

  get lunar() {
    if (!spriteLunar) {
      spriteLunar = SequenceHelper.SpawnAlly(Vars.AREA_WIDTH * 7.5, Enum.SOLDIER_ARCHITECT);
      spriteLunar.setDisplayName("The Architect", Enum.TEAM_ALLY);
    }
    return spriteLunar;
  }
}
