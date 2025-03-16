import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import SaveData from "../util/SaveData";
import Vars from "../const/Vars";
import BlueMoon from "../ai/BlueMoon";
import SequenceHelper from "./SequenceHelper";
import Icon from "../const/Icon";
import Subtitles from "../util/Subtitles";
import Sfx from "../const/Sfx";
import Juke from "../util/Juke";

export default class P2 extends TutorialSequence {

  init() {
    
    const { scene } = this;
    const player = scene.player;
    const script = Subtitles.GetScript();

    this
    .addTitle(" >>> Moon Chief arrived in Blue Forest and defeats initial enemies")

    .add(()=>{ return SequenceHelper.CheckLocation(Enum.LOC_BLUE_FOREST) })
    .addIcon(Enum.ID_MOON_CHIEF, Icon.BANNER, 3000)
    .addUpdateSaveStep()
    .addInstruction(script.Story.P2A_CLAIM_BLUE)

    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.SPEECH, script.MoonChief.bf1, 3000, Sfx.VOICE_AMUSED3)
    .add(()=>{
      if (player.x < Vars.AREA_WIDTH) {
        SequenceHelper.SpawnEnemies(3, [Enum.SOLDIER_BANDIT1]);
        return true;
      }
    })
    .add(()=>{
      if (player.x < Vars.AREA_WIDTH * .75) {
        return this.spawnAndWait(3);
      }
    })
    .addSave()

    .addTitle(" >>> Wildman appears and Moon Chief comes in to help him")

    .add(()=>{
      if (player.x < Vars.AREA_WIDTH * .65) {
        SequenceHelper.SpawnEnemiesAt(Vars.AREA_WIDTH * .48, 2, [Enum.SOLDIER_BANDIT1, Enum.SOLDIER_BANDIT2]);
        this.spawnWildman();
        return true;
      }
    })

    .addSpeakWithDelay(Enum.ID_MOON_CHIEF, Icon.ALLY, script.MoonChief.bf2, 4000, Sfx.VOICE_ATTACK1)
    .add(()=>{ return SequenceHelper.CheckEnemiesLessOrEqual(0) })

    .addSpeakAndSpawn(Enum.ID_BLUE_MOON, Icon.SPEECH, script.Wildman.bf1, 2000, Sfx.VOICE_THANKFUL1)
    .addSpeakAndSpawn(Enum.ID_BLUE_MOON, Icon.SPEECH, script.Wildman.bf2, 5000, Sfx.VOICE_AMUSED3)
    .addSpeakAndSpawn(Enum.ID_MOON_CHIEF, Icon.SPEECH, script.MoonChief.bf3, 3000, Sfx.VOICE_AMUSED3)
    .addSpeakAndSpawn(Enum.ID_BLUE_MOON, Icon.EXCLAIM, script.Wildman.bf3, 6000, Sfx.VOICE_THANKFUL1)
    .addIcon(Enum.ID_MOON_CHIEF, Icon.SPARKLE, 2000)
    .add(()=>{
      return SequenceHelper.CheckEnemiesLessOrEqual(0);
    })
    .addUpdateSaveStep()

    .addTitle(" >>> Enemies are defeated and Moon Chief recruits Wildman to Moon at Midnight")

    .addSpeakWithDelay(Enum.ID_MOON_CHIEF, Icon.SPEECH, script.MoonChief.bf4, 3000, Sfx.VOICE_AMUSED3)
    .addSpeakWithDelay(Enum.ID_BLUE_MOON, Icon.FIST_FIRE, script.Wildman.bf4, 2000, Sfx.VOICE_AMUSED1)
    .addSpeakWithDelay(Enum.ID_MOON_CHIEF, Icon.SPEECH, script.MoonChief.bf5, 5000, Sfx.VOICE_AMUSED3)
    .addSpeakWithDelay(Enum.ID_MOON_CHIEF, Icon.SPEECH, script.MoonChief.bf6, 5000, Sfx.VOICE_AMUSED3)

    .addIcon(Enum.ID_BLUE_MOON, Icon.ELLIPSE, 2000)
    .addWait(1000)
    .addSpeakWithDelay(Enum.ID_BLUE_MOON, Icon.SPEECH, script.Wildman.bf5, 5000, Sfx.VOICE_AMUSED1)
    .addWait(1000)

    .addSpeakWithDelay(Enum.ID_MOON_CHIEF, Icon.SPEECH, script.MoonChief.bf7, 4000, Sfx.VOICE_ATTACK1)
    .addIcon(Enum.ID_BLUE_MOON, Icon.ELLIPSE, 2000)
    .addWait(1000)
    .addIcon(Enum.ID_MOON_CHIEF, Icon.ELLIPSE, 2000)
    .addWait(1000)

    .addSpeakWithDelay(Enum.ID_MOON_CHIEF, Icon.QUESTION, script.MoonChief.bf8, 2000, Sfx.VOICE_HO2)
    .addWait(1000)
    .addSpeakWithDelay(Enum.ID_BLUE_MOON, Icon.EXCLAIM, script.Wildman.bf6, 5000, Sfx.VOICE_LAUGH1)
    .addWait(1000)
    .addSpeakWithDelay(Enum.ID_BLUE_MOON, Icon.BANNER, script.Wildman.bf7, 4000, Sfx.VOICE_HO1)

    .add(()=>{
      this.convertWildman();
      return true;
    })
    .addSave()

    .addTitle(" >>> Rabid Bandit appears to start the boss battle")

    .addWait(3000)
    .add(()=>{
      this.doOnce(()=>{
        this.spawnRabidBandit();
        SequenceHelper.SpawnEnemies(4, [Enum.SOLDIER_BANDIT1, Enum.SOLDIER_BANDIT2]);
      });
      return true;
    })
    .addSpeakWithDelay(Enum.ID_BOSS, Icon.ANGER, script.RabidBandit.boss1, 4000, Sfx.VOICE_ANGRY1)
    .addSpeakWithDelay(Enum.ID_BOSS, Icon.ANGER, script.RabidBandit.boss2, 4000, Sfx.VOICE_ANGRY3)
    .addWait(1000)

    .addTitle(" >>> Second boss speech starts when HP is 2/3")

    .add(()=>{
      SequenceHelper.SpawnConstant(2, 2, [Enum.SOLDIER_BANDIT1, Enum.SOLDIER_BANDIT2]);
      return this.checkBossHP(this.bossHpCheck1);
    })

    .addSpeakWithDelay(Enum.ID_BOSS, Icon.ANGER, script.RabidBandit.boss3, 4000, Sfx.VOICE_ANGRY3)
    .addSpeakWithDelay(Enum.ID_BOSS, Icon.ANGER, script.RabidBandit.boss4, 4000, Sfx.VOICE_ANGRY1)

    .addTitle(" >>> Last boss speech starts when HP is 1/3")

    .add(()=>{
      SequenceHelper.SpawnConstant(2, 2, [Enum.SOLDIER_BANDIT1, Enum.SOLDIER_BANDIT2]);
      return this.checkBossHP(this.bossHPCheck2);
    })
    .addSpeakWithDelay(Enum.ID_BOSS, Icon.ANGER, script.RabidBandit.boss5, 4000, Sfx.VOICE_ANGRY1)
    .addSpeakWithDelay(Enum.ID_BOSS, Icon.ANGER, script.RabidBandit.boss6, 4000, Sfx.VOICE_ANGRY2)
    .addSpeakWithDelay(Enum.ID_BOSS, Icon.FIST_FIRE, script.RabidBandit.boss7, 5000, Sfx.VOICE_ANGRY3)
    
    .add(()=>{
      SequenceHelper.SpawnEnemies(7, [Enum.SOLDIER_BANDIT1, Enum.SOLDIER_BANDIT2]);
      return true;
    })
    .add(()=>{
      return SequenceHelper.CheckEnemiesLessOrEqual(0);
    })
    .addSpeak(Enum.ID_MOON_CHIEF, Icon.BANNER, script.MoonChief.victory, 2000, Sfx.VOICE_ATTACK1)
    .addSave()
    .addWait(3000)

    .addTitle(" >>> Claim the Blue Forest and place a flag near the teal tree")

    .addIcon(Enum.ID_MOON_CHIEF, Icon.STANDARD, 15 * 1000)
    .addInstruction(script.Story.P2B_PLACE_FLAG)
    .add(()=>{
      this.doOnce(()=>{
        SequenceHelper.SpawnClaimerFlag(Vars.AREA_WIDTH * .48);
      });
      return SaveData.Data.claimed.includes(Enum.LOC_BLUE_FOREST);
    })
    .addSave()

    .addWait(1000)
    .addHealing()
    
    .addWait(3000)
    .addInstruction(script.Story.P2C_LEAVE_FOREST);
    
  }

  //  ---------------------------------------------------

  addSpeakAndSpawn(uid, icon, text, ttl, sfx) {
    this
    .add(()=>{
      const sprite = this.getSoldierbyUID(uid);
      sprite.speak(icon, text, ttl);
      if (sfx) {
        Juke.PlaySound(sfx);
      }
      return true;
    })
    .addWait(ttl)
    .add(()=>{
      SequenceHelper.SpawnConstant(3, 2, [Enum.SOLDIER_BANDIT1, Enum.SOLDIER_BANDIT2]);
      return true;
    })
    .addWait(750);

    return this;
  }

  addSpeakWithDelay(uid, icon, text, ttl, sfx) {
    this
    .addSpeakAndWait(uid, icon, text, ttl, sfx)
    .addWait(500);
    return this;
  }

  //  -----------------------------------

  spawnWildman() {
    const script = Subtitles.GetScript();
    const pX = Vars.AREA_WIDTH * .5;
    const wildman = this.spawnAlly(pX, Enum.SOLDIER_WILDMAN, 25, 10, script.Names.Wildman);
    wildman.uid = Enum.ID_BLUE_MOON;
    SaveData.SaveSoldierData(wildman.getSaveData());
  }

  convertWildman() {
    const script = Subtitles.GetScript();
    const bm = this.getSoldierbyUID(Enum.ID_BLUE_MOON);
    if (bm) {
      bm.setHP(45, 45);
      bm.setGP(10, 10);
      bm.setDisplayName(script.Names.BlueMoon, Enum.TEAM_ALLY);
      bm.setController(new BlueMoon());
      SaveData.SaveSoldierData(bm.getSaveData());
    }
  }

  checkBossHP(amt) {
    return this.boss.hp <= amt;
  }

  countEnemies() {
    return this.scene.countEnemies();
  }

  spawnRabidBandit() {

    const script = Subtitles.GetScript();

    const boss = this.spawnEnemy(null, Enum.SOLDIER_RABID_BANDIT, 20, 7, script.Names.RabidBandit);
    boss.uid = Enum.ID_BOSS;

    this.bossHpCheck1 = 20 - 6;
    this.bossHPCheck2 = 20 - 12;

    this.boss = boss;
  }

  spawnAndWait(amt) {
    this.doOnce(()=>{
      SequenceHelper.SpawnEnemies(amt, [Enum.SOLDIER_BANDIT1, Enum.SOLDIER_BANDIT2]);
    });
    return SequenceHelper.CheckEnemiesLessOrEqual(0);
  }

}
