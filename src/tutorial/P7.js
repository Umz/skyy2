import BlueMoon from "../ai/BlueMoon";
import CitizenMaM from "../ai/CitizenMaM";
import Lunar1 from "../ai/Lunar1";
import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Sfx from "../const/Sfx";
import Vars from "../const/Vars";
import Juke from "../util/Juke";
import SaveData from "../util/SaveData";
import Subtitles from "../util/Subtitles";
import Vfx from "../util/Vfx";
import SequenceHelper from "./SequenceHelper";

let green;

export default class P7 extends TutorialSequence {

  init() {
    
    const player = this.scene.player;
    const script = Subtitles.GetScript();
    const WIDTH = Vars.AREA_WIDTH;  // Green Village x7

    const soldier = script.Names.Soldier;
    const nameGreen = script.Names.GreenSword;
    const nameLunar = script.Names.Lunar;

    this
    .addTitle(" >>> Section to take the Architect and fight the way home -")

    .add(()=> player.x >= Vars.AREA_WIDTH * 6.8 )
    .add(()=>{
      SequenceHelper.SpawnEnemiesAt(WIDTH * 7.1, 3, [Enum.SOLDIER_WL_HEAVY]);
      return true;
    })
    .add(()=>{ return player.x >= Vars.AREA_WIDTH * 6.9 })
    .addSound(Sfx.VOICE_HO1)
    .addDialogue(soldier, script.Soldier.halt, 2000)

    .add(()=>{
      this.spawnLunar();
      return true;
    })
    .addSave()
    .add(()=>{ return player.x >= Vars.AREA_WIDTH * 7.4 })

    .addTitle(" >>> Moon Chief meets the Architect and recruits him -", true)
    
    .add(()=>{
      const lunar = this.getSoldierbyUID(Enum.ID_LUNAR);
      lunar.faceX(player.x);
      return true;
    })
    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.SPEECH, script.MoonChief.green1, 1500, Sfx.VOICE_EFFORT1)
    .addWait(500)
    .addSpeakAndWait(Enum.ID_LUNAR, Icon.QUESTION, script.Lunar.green1, 2000, Sfx.VOICE_YES1)
    .addWait(500)
    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.BANNER, script.MoonChief.green2, 6000, Sfx.VOICE_ATTACK1)
    .addWait(500)
    .addSpeakAndWait(Enum.ID_LUNAR, Icon.BANNER, script.Lunar.green2, 2000, Sfx.VOICE_AMUSED1)
    .addUpdateSaveStep()

    .addTitle(" >>> The Architect joins Moon Chief and leaves with him -")

    .add(()=>{
      const lunar = this.getSoldierbyUID(Enum.ID_LUNAR);
      lunar.controller.gotoX(WIDTH * 7.19)
      return true;
    })
    .addIcon(Enum.ID_LUNAR, Icon.BANNER, 60 * 1000)
    .add(()=>{
      const lunar = this.getSoldierbyUID(Enum.ID_LUNAR);
      return lunar.x <= Vars.AREA_WIDTH * 7.2
    })

    .addDialogue(soldier, script.Soldier.traitor, 2000)
    .addSound(Sfx.VOICE_ANGRY2)
    
    .addTitle(" >>> Soldiers to try and stop The Architect from defecting -")

    .add(()=>{
      const lunar = this.getSoldierbyUID(Enum.ID_LUNAR);
      const pX = Math.min(player.x - 140, lunar.x - 140);
      SequenceHelper.SpawnEnemiesAt(pX, 6, [Enum.SOLDIER_WL_HEAVY])
      return true;
    })
    .add(()=> SequenceHelper.CheckEnemiesLessOrEqual(0))

    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.SPEECH, script.MoonChief.green3, 4000, Sfx.VOICE_ATTACK1)
    .addSpeakAndWait(Enum.ID_LUNAR, Icon.EXCLAIM, script.Lunar.green3, 1500, Sfx.VOICE_HO2)
    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.SKY_SPEAR, script.MoonChief.green4, 4000, Sfx.VOICE_EFFORT1)

    .add(()=>{
      Juke.PlaySound(Sfx.HEAL);

      player.recoverHP(10);
      player.recoverGP(player.maxGP);

      Vfx.ShowAnimatedFX(player, Vars.VFX_CONSUME);
      Juke.PlaySound(Sfx.HEAL);
      return true;
    })
    .addSave()

    .add(()=>{
      const lunar = this.getSoldierbyUID(Enum.ID_LUNAR);
      const blue = this.getSoldierbyUID(Enum.ID_BLUE_MOON);
      blue.setController(new Lunar1());
      blue.controller.gotoX(WIDTH * 4.7);
      lunar.controller.gotoX(WIDTH * 1.5);
      return true;
    })
    .add(()=>{
      const lunar = this.getSoldierbyUID(Enum.ID_LUNAR);
      return lunar.x < player.x - 200;
    })
    .addInstruction(script.Story.P7A_HOLD)

    .addTitle(" >>> Moon Chief stays in Green Village to hold back the enemies -")

    .add(()=>{
      SequenceHelper.SpawnEnemiesAt(player.x + 140, 6, [Enum.SOLDIER_WL_INFANTRY]);
      return true;
    })
    .add(()=> SequenceHelper.CheckEnemiesLessOrEqual(0))

    .add(()=>{
      SequenceHelper.SpawnEnemiesAt(player.x - 100, 2, [Enum.SOLDIER_WL_HEAVY]);
      SequenceHelper.SpawnEnemiesAt(player.x + 100, 4, [Enum.SOLDIER_WL_INFANTRY]);
      return true;
    })
    .add(()=> SequenceHelper.CheckEnemiesLessOrEqual(0))

    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.HOME, script.MoonChief.green5, 2000, Sfx.VOICE_SIGH1)
    .add(()=>{
      Juke.PlaySound(Sfx.HEAL);

      player.recoverHP(10);
      player.recoverGP(player.maxGP);

      Vfx.ShowAnimatedFX(player, Vars.VFX_CONSUME);
      Juke.PlaySound(Sfx.HEAL);
      return true;
    })

    .add(()=> player.x <= Vars.AREA_WIDTH * 7 )
    .add(()=>{
      SequenceHelper.SpawnEnemiesAt(player.x - 100, 2, [Enum.SOLDIER_WL_INFANTRY]);
      return true;
    })
    .add(()=> SequenceHelper.CheckEnemiesLessOrEqual(0))

    .add(()=>{
      const all = scene.groupCitizens.getChildren();
      const citizens = all.filter(ss => ss.tribe === Enum.TRIBE_WHITELEAF);
      for (let citi of citizens) {
        citi.setController(new CitizenMaM());
        SaveData.SaveCitizenData(citi.getSaveData())
      }
      return true;
    })
    .addSave()

    .add(()=> player.x <= Vars.AREA_WIDTH * 6.9 )

    .add(()=>{
      SequenceHelper.SpawnEnemiesAt(player.x - 100, 2, [Enum.SOLDIER_WL_HEAVY]);
      SequenceHelper.SpawnEnemiesAt(player.x - 140, 3, [Enum.SOLDIER_WL_INFANTRY]);
      return true;
    })
    .add(()=> SequenceHelper.CheckEnemiesLessOrEqual(0))
    .addUpdateSaveStep()

    .addTitle(" >>> Moon Chief leaves the village and runs into Green Sword. -", true)

    .add(()=> player.x <= Vars.AREA_WIDTH * 6.4 )
    .add(()=>{
      green = SequenceHelper.SpawnEnemy(WIDTH * 6.3, Enum.SOLDIER_WL_GREEN_SWORD);
      green.setDisplayName(nameGreen, Enum.TEAM_ENEMY);
      green.setHP(20, 20);
      return true;
    })

    .addGreenSwordSpeakAndWait(Icon.SWORD, script.GreenSword.green1, 3000)
    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.SKY_SPEAR, script.MoonChief.green6, 3000, Sfx.VOICE_AMUSED3)
    .add(() => green.isDead())
    .addSave()

    .addTitle(" >>> Fade out the screen to black and jump to Moon at Midnight with everyone. -")

    .add(()=> player.x <= Vars.AREA_WIDTH * 5.5 )

    .add(() => {
      const ele = document.getElementById("blackout-container");
      ele.style.display = "block";
      ele.classList.add("fade-to-black");
      return true;
    })
    .addWait(2000)
    .add(() => {

      const lunar = this.getSoldierbyUID(Enum.ID_LUNAR);
      const nighttrain = this.getSoldierbyUID(Enum.ID_NIGHT_TRAIN);
      
      lunar.changeTexture(Vars.SHEET_LUNAR);
      lunar.setHP(15, 15);

      // move location
      const mam = WIDTH * 1.5;
      lunar.x = mam + 20;
      player.x = mam + 80;
      nighttrain.x = mam - 60;

      nighttrain.faceX(lunar.x);

      const blue = this.getSoldierbyUID(Enum.ID_BLUE_MOON);
      blue.setController(new BlueMoon());

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
    .addSave()

    .addTitle(" >>> The Architect joins Moon at Midnight and becomes Lunar -")

    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.EXCLAIM, script.MoonChief.green7, 2000, Sfx.VOICE_HO1)
    .addSpeakAndWait(Enum.ID_LUNAR, Icon.HAPPY, script.Lunar.green4, 3000, Sfx.VOICE_AMUSED3)
    .addSpeakAndWait(Enum.ID_NIGHT_TRAIN, Icon.HOME, script.NightTrain.green1, 4000, Sfx.VOICE_AMUSED1)
    .addSpeakAndWait(Enum.ID_LUNAR, Icon.BANNER, script.Lunar.green5, 3000, Sfx.VOICE_YES1)

    .addWait(500)
    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.QUESTION, script.MoonChief.green8, 2000, Sfx.VOICE_HO2)
    .addSpeakAndWait(Enum.ID_NIGHT_TRAIN, Icon.EXCLAIM, nameLunar, 1000, Sfx.VOICE_HO1)
    .addWait(1000)
    
    .add(() => {
      const lunar = this.getSoldierbyUID(Enum.ID_LUNAR);
      lunar.attack();
      lunar.setDisplayName(nameLunar, Enum.TEAM_ALLY);
      return true;
    })
    .addSpeakAndWait(Enum.ID_LUNAR, Icon.BANNER, script.Lunar.green6, 5000, Sfx.VOICE_ATTACK1)
    .addWait(1000)
  }

  //  ====================================================================================================

  /** Add speech for Green Sword and wait for completion */
  addGreenSwordSpeakAndWait(icon, text, ttl) {
    this
    .add(()=>{
      green.speak(icon, text, ttl);
      Juke.PlaySound(Sfx.VOICE_AMUSED1)
      return true;
    })
    .addWaitForDialogue();
    return this;
  }

  //  -

  spawnLunar() {
    const script = Subtitles.GetScript();
    const lunar = this.spawnAlly(Vars.AREA_WIDTH * 7.5, Enum.SOLDIER_ARCHITECT, 25, 10, script.Names.Architect)
    lunar.uid = Enum.ID_LUNAR;
    SaveData.SaveSoldierData(lunar.getSaveData());
  }
}
