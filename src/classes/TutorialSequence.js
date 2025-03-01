import Enum from "../const/Enum";
import Sfx from "../const/Sfx";
import Vars from "../const/Vars";
import SequenceHelper from "../tutorial/SequenceHelper";
import Juke from "../util/Juke";
import SaveData from "../util/SaveData";
import Subtitles from "../util/Subtitles";
import Vfx from "../util/Vfx";

export default class TutorialSequence {
  
  constructor(tut) {
    
    this.tutorial = tut;
    this.scene = tut.scene;

    this.sequence = [];
    this.shouldSaveStepID = true;

    this.step = 0;
    this.once = -1;
    this.date = new Date();

    this.init();
  }

  init() {
    console.log("Override the init() function in TutorialSequence subClass");
  }

  startFrom(skipAmt) {
    this.sequence.splice(0, skipAmt);
    this.step = skipAmt;
  }

  update() {

    if (this.sequence.length > 0) {

      const currentStepFn = this.sequence[0];
      if (currentStepFn()) {
        this.sequence.shift();
        this.incStep();
      }
      return false;
    }
    return true;
  }

  add(fn) {
    this.sequence.push(fn);
    return this;
  }

  addWait(time) {
    this.add(()=>{
      return this.checkCount(time);
    });
    return this;
  }

  addInstruction(instruction) {
    this.add(()=>{
      this.doOnce(()=>{
        Juke.PlaySound(Sfx.UI_SHOW_INSTRUCTIONS);
        this.tutorial.showInstructions(instruction);
      });
    });
    return this;
  }

  addDialogue(name, text, ttl) {
    this.add(()=>{
      Subtitles.ShowDialogue(name, text, ttl)
      return true;
    })
    return this;
  }

  addDialogueAndWait(name, text, ttl) {
    this
    .addDialogue(name, text, ttl)
    .add(()=>{ return !Subtitles.IsShowing() })
    return this;
  }

  addWaitForDialogue() {
    this.add(()=>{ return !Subtitles.IsShowing() });
    return this;
  }

  addIcon(uid, icon, ttl) {
    this.add(()=>{
      const sprite = this.getSoldierbyUID(uid);
      sprite.showIcon(icon, ttl);
      return true;
    });
    return this;
  }

  addSpeaker(uid, icon, text, ttl, sfx = null) {
    this.add(()=>{
      const sprite = this.getSoldierbyUID(uid);
      sprite.speak(icon, text, ttl);
      if (sfx) {
        Juke.PlaySound(sfx);
        console.log("Speaking")
      }
      return true;
    })
    return this;
  }

  addSpeakerAndWait(sprite, icon, text, ttl) {
    this
    .addSpeaker(sprite, icon, text, ttl)
    .add(()=>{ return !Subtitles.IsShowing() })
    return this;
  }

  /** Speak (UID) without stopping flow to wait for dialogue */
  addSpeak(uid, icon, text, ttl, sfx = null) {
    this.add(()=>{
      const sprite = this.getSoldierbyUID(uid);
      sprite.speak(icon, text, ttl);
      if (sfx) {
        Juke.PlaySound(sfx);
      }
      return true;
    });
    return this;
  }

  /** Soldier with the specified UID will speak */
  addSpeakAndWait(uid, icon, text, ttl, sfx = null) {
    this.add(()=>{
      const sprite = this.getSoldierbyUID(uid);
      sprite.speak(icon, text, ttl);
      if (sfx) {
        Juke.PlaySound(sfx);
      }
      return true;
    })
    .addWaitForDialogue();
    return this;
  }

  addStopSaving() {
    this.add(()=>{
      this.turnSavingOff();
      return true;
    })
    return this;
  }

  addStartSaving() {
    this.add(()=>{
      this.turnSavingOn();
      return true;
    })
    return this;
  }

  addSave() {
    this.add(()=>{
      SaveData.SAVE_GAME_DATA();
      return true;
    });
    return this;
  }

  addSound(sfx) {
    this.add(()=>{
      Juke.PlaySound(sfx);
      return true;
    });
    return this;
  }

  addShowDuelDOM() {
    this.add(()=>{
      const element = document.getElementById("duel-text");
      element.style.display = "block";
      return true;
    });
    return this;
  }

  addHideDuelDOM() {
    this.add(()=>{
      const element = document.getElementById("duel-text");
      element.style.display = "none";
      return true;
    });
    return this;
  }

  // Just used to add section titles in long sequences
  addTitle(txt, logDetails = false) {
    if (logDetails) {
      this.add(()=>{
        console.log(txt);
        console.log(`Tutorial Step ${this.step}`)
        return true;
      });
    }
    return this;
  }

  /** Heal the whole team back to full health */
  addHealing() {
    this.add(()=> {
      const allies = this.scene.groupAllies.getChildren();
      for (let ally of allies) {
        ally.recoverHP(ally.maxHP);
        Vfx.ShowAnimatedFX(ally, Vars.VFX_CONSUME);
        Juke.PlaySound(Sfx.HEAL);
      }
      return true;
    });
    return this;
  }

  //  -------

  showConversation(en) {
    this.tutorial.showConversation(en);
  }

  checkCount(max) {
    const start = this.date.getTime();
    const comp = new Date();
    const time = comp.getTime();
    const elapsed = time - start;
    return elapsed >= max;
  }

  nextStep() {
    this.sequence.shift();
    this.incStep();
  }

  incStep() {
    this.step ++;
    this.date = new Date();

    if (this.shouldSaveStepID) {
      SaveData.Data.tutorialSequenceStep = this.step;
    }
  }

  /** Perform the given function once per step (first come, first serve) */
  doOnce(fn) {
    if (this.once !== this.step) {
      fn();
      this.once = this.step;
    }
  }

  /** Do not save the next step when complete - skips saveing if setup is required */
  turnSavingOff() {
    this.shouldSaveStepID = false;
  }

  /** Resume saving steps when complete */
  turnSavingOn() {
    this.shouldSaveStepID = true;
  }

  //  -

  /** Spawn an ally soldier */
  spawnAlly(x, soldierEnum, hp, gp, name) {
    const soldier = SequenceHelper.SpawnAlly(x, soldierEnum);
    this.setSoldierStats(soldier, hp, gp, Enum.TEAM_ALLY, name);
    return soldier;
  }

  /** Spawn an enemy soldier */
  spawnEnemy(x, soldierEnum, hp, gp, name) {
    const soldier = SequenceHelper.SpawnEnemy(x, soldierEnum);
    this.setSoldierStats(soldier, hp, gp, Enum.TEAM_ENEMY, name);
    return soldier;
  }

  /** Set the stats for soldier */
  setSoldierStats(soldier, hp, gp, team, name) {
    soldier.setHP(hp, hp);
    soldier.setGP(gp, gp);
    if (name) {
      soldier.setDisplayName(name, team);
    }
  }

  /** Get a specific Soldier by their UID from all existing */
  getSoldierbyUID(uid) {
    const { scene } = this;
    const all = scene.groupSoldiers.getChildren();
    const soldier = all.find(sprite => sprite.uid === uid);
    return soldier;
  }

}