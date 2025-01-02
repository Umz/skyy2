import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import SaveData from "../util/SaveData";
import Vars from "../const/Vars";
import BlueMoon from "../ai/BlueMoon";
import PartHelper from "./PartHelper";

export default class P4 extends TutorialSequence {

  init() {
    
    const { scene } = this;
    const player = scene.player;

    this
    .add(()=>{ return PartHelper.CheckLocation(Enum.LOC_BLUE_FOREST) })
    .addInstruction(Enum.STORY_2A_CLAIM_BLUE)
    .add(()=>{
      if (player.x < Vars.AREA_WIDTH) {
        PartHelper.SpawnEnemies(3, [Enum.SOLDIER_BANDIT1]);
        return true;
      }
    })
    .addConversation(Enum.BF_TEST)
    .add(()=>{
      if (player.x < Vars.AREA_WIDTH * .75) {
        return this.spawnAndWait(3);
      }
    })
    .add(()=>{
      if (player.x < Vars.AREA_WIDTH * .65) {
        PartHelper.SpawnEnemiesAt(Vars.AREA_WIDTH* .48, 2, [Enum.SOLDIER_BANDIT1, Enum.SOLDIER_BANDIT2]);
        this.spawnWildman();
        this.turnSavingOff();
        return true;
      }
    })
    .addConversation(Enum.BF_BATTLE)
    .add(()=>{
      return PartHelper.CheckEnemiesLessOrEqual(0);
    })

    // Keep spawning until conversation is complete
    .add(()=>{
      PartHelper.SpawnConstant(3, 2, [Enum.SOLDIER_BANDIT1, Enum.SOLDIER_BANDIT2]);
      return PartHelper.CheckConversationComplete();
    })
    .add(()=>{
      return PartHelper.CheckEnemiesLessOrEqual(0);
    })
    
    .addConversation(Enum.BF_WIN)
    .addConversationWait()
    
    .add(()=>{
      this.convertWildman();
      SaveData.Data.hasBlueMoon = true;
      SaveData.SAVE_GAME_DATA();
      this.turnSavingOn();
      return true;
    })

    //  Boss battle   -------------------------------

    .add(()=>{
      return this.checkCount(3000);
    })
    .add(()=>{
      this.doOnce(()=>{
        this.turnSavingOff();
        this.spawnBoss();
        PartHelper.SpawnEnemies(4, [Enum.SOLDIER_BANDIT1, Enum.SOLDIER_BANDIT2]);
      });
      return true;
    })
    .addConversation(Enum.BF_BOSS1)
    .add(()=>{
      return this.checkCount(1000);
    })

    // Second speech when 1/3 life gone
    .add(()=>{
      PartHelper.SpawnConstant(2, 2, [Enum.SOLDIER_BANDIT1, Enum.SOLDIER_BANDIT2]);
      return this.checkBossHP(this.check1);
    })
    .addConversation(Enum.BF_BOSS2)

    // Third speech when 2/3 life gone
    .add(()=>{
      PartHelper.SpawnConstant(2, 2, [Enum.SOLDIER_BANDIT1, Enum.SOLDIER_BANDIT2]);
      return this.checkBossHP(this.check2);
    })
    .addConversation(Enum.BF_BOSS3)
    .addConversationWait()
    
    .add(()=>{
      PartHelper.SpawnEnemies(7, [Enum.SOLDIER_BANDIT1, Enum.SOLDIER_BANDIT2]);
      return true;
    })
    .add(()=>{
      return PartHelper.CheckEnemiesLessOrEqual(0);
    })
    .add(()=>{
      return this.checkCount(3000);
    })

    //  Claim land

    .add(()=>{
      this.turnSavingOn();
      return true;
    })
    .addInstruction(Enum.STORY_2B_PLACE_FLAG)
    .add(()=>{
      this.doOnce(()=>{
        PartHelper.SpawnClaimerFlag(Vars.AREA_WIDTH * .48);
      });
      return SaveData.Data.claimed.includes(Enum.LOC_BLUE_FOREST);
    })
    .add(()=>{
      this.doOnce(()=> {
        SaveData.SAVE_GAME_DATA();
      })
      return this.checkCount(3000);
    })
    .addInstruction(Enum.STORY_2C_LEAVE_FOREST);
    
  }

  //  - Helper functions for P4

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
      PartHelper.SpawnEnemies(amt, [Enum.SOLDIER_BANDIT1, Enum.SOLDIER_BANDIT2]);
    });
    return PartHelper.CheckEnemiesLessOrEqual(0);
  }

}
