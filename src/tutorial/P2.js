import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import SaveData from "../util/SaveData";
import Vars from "../const/Vars";
import BlueMoon from "../ai/BlueMoon";
import SequenceHelper from "./SequenceHelper";
import Icon from "../const/Icon";
import Subtitles from "../util/Subtitles";

export default class P2 extends TutorialSequence {

  init() {
    
    const { scene } = this;
    const player = scene.player;
    const script = Subtitles.GetScript();

    this
    .add(()=>{ return SequenceHelper.CheckLocation(Enum.LOC_BLUE_FOREST) })
    .addIcon(player, Icon.BANNER, 3000)
    .addInstruction(Enum.STORY_2A_CLAIM_BLUE)

    .add(()=>{
      if (player.x < Vars.AREA_WIDTH) {
        SequenceHelper.SpawnEnemies(3, [Enum.SOLDIER_BANDIT1]);
        return true;
      }
    })
    .addSpeaker(player, Icon.SPEECH, script.MoonChief.bf1, 3000)
    .add(()=>{
      if (player.x < Vars.AREA_WIDTH * .75) {
        return this.spawnAndWait(3);
      }
    })
    .addStopSaving()
    .add(()=>{
      if (player.x < Vars.AREA_WIDTH * .65) {
        SequenceHelper.SpawnEnemiesAt(Vars.AREA_WIDTH* .48, 2, [Enum.SOLDIER_BANDIT1, Enum.SOLDIER_BANDIT2]);
        this.spawnWildman();
        return true;
      }
    })

    .addPlayerSpeak(Icon.ALLY, script.MoonChief.bf2, 4000)
    .add(()=>{ return SequenceHelper.CheckEnemiesLessOrEqual(0) })

    .addSpeakAndSpawn(scene.bluemoon, Icon.SPEECH, script.Wildman.bf1, 2000)
    .addSpeakAndSpawn(scene.bluemoon, Icon.SPEECH, script.Wildman.bf2, 5000)
    .addSpeakAndSpawn(player, Icon.SPEECH, script.MoonChief.bf3, 3000)
    .addSpeakAndSpawn(scene.bluemoon, Icon.EXCLAIM, script.Wildman.bf3, 6000)
    .addIcon(player, Icon.SPARKLE, 2000)
    .add(()=>{
      return SequenceHelper.CheckEnemiesLessOrEqual(0);
    })

    //  - Victory
    
    .addPlayerSpeak(Icon.SPEECH, script.MoonChief.bf4, 3000)
    .addBlueSpeak(Icon.FIST_FIRE, script.Wildman.bf4, 2000)
    .addPlayerSpeak(Icon.SPEECH, script.MoonChief.bf5, 5000)
    .addPlayerSpeak(Icon.SPEECH, script.MoonChief.bf6, 5000)

    .addBlueIcon(Icon.ELLIPSE, 2000).addWait(1000)
    .addBlueSpeak(Icon.SPEECH, script.Wildman.bf5, 5000)
    .addWait(1000)

    .addPlayerSpeak(Icon.SPEECH, script.MoonChief.bf7, 4000)
    .addBlueIcon(Icon.ELLIPSE, 2000).addWait(1000)
    .addIcon(player, Icon.ELLIPSE, 2000).addWait(1000)

    .addPlayerSpeak(Icon.QUESTION, script.MoonChief.bf8, 2000)
    .addWait(1000)
    .addBlueSpeak(Icon.EXCLAIM, script.Wildman.bf6, 5000)
    .addWait(1000)
    .addBlueSpeak(Icon.BANNER, script.Wildman.bf7, 4000)

    .add(()=>{
      this.turnSavingOn();
      return true;
    })
    .addStartSaving()
    
    .add(()=>{
      this.convertWildman();
      SaveData.Data.hasBlueMoon = true;
      SaveData.SAVE_GAME_DATA();
      return true;
    })

    //  - Boss battle   -------------------------------

    .add(()=>{ return true })

    .addWait(3000)
    .addStopSaving()
    .add(()=>{
      this.doOnce(()=>{
        this.spawnBoss();
        SequenceHelper.SpawnEnemies(4, [Enum.SOLDIER_BANDIT1, Enum.SOLDIER_BANDIT2]);
      });
      return true;
    })
    .addSpeakBoss(Icon.ANGER, script.RabidBandit.boss1, 4000)
    .addSpeakBoss(Icon.ANGER, script.RabidBandit.boss2, 4000)
    .addWait(1000)

    // Second speech when 1/3 life gone
    .add(()=>{
      SequenceHelper.SpawnConstant(2, 2, [Enum.SOLDIER_BANDIT1, Enum.SOLDIER_BANDIT2]);
      return this.checkBossHP(this.check1);
    })

    .addSpeakBoss(Icon.ANGER, script.RabidBandit.boss3, 4000)
    .addSpeakBoss(Icon.ANGER, script.RabidBandit.boss4, 4000)

    // Third speech when 2/3 life gone
    .add(()=>{
      SequenceHelper.SpawnConstant(2, 2, [Enum.SOLDIER_BANDIT1, Enum.SOLDIER_BANDIT2]);
      return this.checkBossHP(this.check2);
    })
    .addSpeakBoss(Icon.ANGER, script.RabidBandit.boss5, 4000)
    .addSpeakBoss(Icon.ANGER, script.RabidBandit.boss6, 4000)
    .addSpeakBoss(Icon.FIST_FIRE, script.RabidBandit.boss7, 5000)
    .addWaitForDialogue()
    
    .add(()=>{
      SequenceHelper.SpawnEnemies(7, [Enum.SOLDIER_BANDIT1, Enum.SOLDIER_BANDIT2]);
      return true;
    })
    .add(()=>{
      return SequenceHelper.CheckEnemiesLessOrEqual(0);
    })
    .addWait(3000)

    //  Claim land

    .addStartSaving()
    .addIcon(player, Icon.STANDARD, 15 * 1000)
    .addInstruction(Enum.STORY_2B_PLACE_FLAG)
    .add(()=>{
      this.doOnce(()=>{
        SequenceHelper.SpawnClaimerFlag(Vars.AREA_WIDTH * .48);
      });
      return SaveData.Data.claimed.includes(Enum.LOC_BLUE_FOREST);
    })
    .add(()=>{
      this.doOnce(()=> {
        SaveData.SAVE_GAME_DATA();
      });
      return true;
    })
    .addWait(3000)
    .addInstruction(Enum.STORY_2C_LEAVE_FOREST);
    
  }

  //  ---------------------------------------------------
  
  addPlayerSpeak(ic, text, ttl) {
    this.add(()=>{
      const { scene } = this;
      const player = scene.player;
      player.speak(ic, text, ttl);
      return true;
    })
    .addWait(ttl + 750)
    return this;
  }

  addBlueSpeak(ic, text, ttl) {
    this.add(()=>{
      const { scene } = this;
      const bm = scene.bluemoon;
      bm.speak(ic, text, ttl);
      return true;
    })
    .addWait(ttl + 750)
    return this;
  }

  addSpeakBoss(ic, text, ttl) {
    this.add(()=>{
      this.boss.speak(ic, text, ttl);
      return true;
    })
    .addWait(ttl + 750)
    return this;
  }

  addSpeakAndSpawn(soldier, icon, text, ttl) {

    this
    .add(()=>{
      const sprite = soldier || this.scene.bluemoon;
      sprite.speak(icon, text, ttl);
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

  addBlueIcon(icon, ttl) {
    this.add(()=>{
      const sprite = this.scene.bluemoon;
      sprite.showIcon(icon, ttl);
      return true;
    })
    .addWait(750)
    return this;
  }

  //  -----------------------------------

  spawnWildman() {
    const { scene } = this;
    scene.spawnWildman();
  }

  convertWildman() {
    const { scene } = this;
    const bm = scene.bluemoon;
    if (bm) {
      bm.setHP(45, 45);
      bm.setGP(10, 10);
      bm.setDisplayName("Blue Moon", Enum.TEAM_ALLY);
      bm.setController(new BlueMoon());
    }
  }

  checkBossHP(amt) {
    return this.boss.hp <= amt;
  }

  countEnemies() {
    return this.scene.countEnemies();
  }

  spawnBoss() {
    const { scene } = this;
    const boss = scene.spawnEnemy(null, Enum.SOLDIER_BANDIT_BOSS);

    boss.setDisplayName("Rabid Bandit", Enum.TEAM_ENEMY);
    boss.setHP(18, 18);
    boss.setGP(7, 7);

    this.check1 = 18 - 6;
    this.check2 = 18 - 12;

    this.boss = boss;
  }

  spawnAndWait(amt) {
    this.doOnce(()=>{
      SequenceHelper.SpawnEnemies(amt, [Enum.SOLDIER_BANDIT1, Enum.SOLDIER_BANDIT2]);
    });
    return SequenceHelper.CheckEnemiesLessOrEqual(0);
  }

}
