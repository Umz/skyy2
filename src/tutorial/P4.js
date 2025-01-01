import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import SaveData from "../util/SaveData";
import Vars from "../const/Vars";
import BlueMoon from "../ai/BlueMoon";

export default class P4 extends TutorialSequence {

  init() {
    
    const { scene } = this;
    const player = scene.player;

    this.add(()=>{
      if (SaveData.Data.location === Enum.LOC_BLUE_FOREST) {
        this.doOnce(()=>{
          this.tutorial.showInstructions(Enum.STORY_2A_CLAIM_BLUE);
        });
      }
    })
    .add(()=>{
      if (player.x < Vars.AREA_WIDTH) {
        this.spawnEnemies(3);
        this.showConversation(Enum.BF_TEST);
        return true;
      }
    })
    .add(()=>{
      if (player.x < Vars.AREA_WIDTH * .75) {
        return this.spawnAndWait(3);
      }
    })
    .add(()=>{
      if (player.x < Vars.AREA_WIDTH * .65) {
        this.spawnEnemies(2);
        scene.spawnWildman();
        scene.convo.showConversation(Enum.BF_BATTLE);
        this.turnSavingOff();
        return true;
      }
    })
    .add(()=>{
      return this.countEnemies() === 0;
    })

    // Keep spawning until conversation is complete
    .add(()=>{
      this.spawnConstant(3, 2);
      return this.tutorial.isConversationComplete();
    })
    .add(()=>{
      return this.countEnemies() === 0;
    })
    
    .add(()=>{
      this.showConversation(Enum.BF_WIN);
      return true;
    })
    .add(()=>{
      return this.tutorial.isConversationComplete();
    })
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
        this.spawnEnemies(4);
        scene.convo.showConversation(Enum.BF_BOSS1);
      });
      return true;
    })
    .add(()=>{
      return this.checkCount(1000);
    })

    // Second speech when 1/3 life gone
    .add(()=>{
      this.spawnConstant(2, 2);
      return this.checkBossHP(this.check1);
    })
    .add(()=>{
      this.doOnce(()=>{
        scene.convo.showConversation(Enum.BF_BOSS2);
      });
      return true;
    })

    // Third speech when 2/3 life gone
    .add(()=>{
      this.spawnConstant(2, 2);
      return this.checkBossHP(this.check2);
    })
    .add(()=>{
      this.doOnce(()=>{
        scene.convo.showConversation(Enum.BF_BOSS3);
      });
      return true;
    })
    .add(()=>{
      return this.tutorial.isConversationComplete();
    })
    .add(()=>{
      this.spawnEnemies(7);
      return true;
    })
    .add(()=>{
      return this.countEnemies() === 0;
    })
    .add(()=>{
      return this.checkCount(3000);
    })

    //  Claim land

    .add(()=>{
      this.doOnce(()=>{
        this.turnSavingOn();
        this.tutorial.showInstructions(Enum.STORY_2B_PLACE_FLAG);
      });
    })
    .add(()=>{
      this.doOnce(()=>{
        const posX = Vars.AREA_WIDTH * .48;
        scene.spawnClaimerFlag(posX);
      });
      return SaveData.Data.claimed.includes(Enum.LOC_BLUE_FOREST);
    })
    .add(()=>{
      this.doOnce(()=> {
        SaveData.SAVE_GAME_DATA();
      })
      return this.checkCount(3000);
    })
    .add(()=>{
      this.doOnce(()=>{
        this.tutorial.showInstructions(Enum.STORY_2C_LEAVE_FOREST);
      });
    });

  }

  //  - Helper functions for P4

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
    const { scene } = this;
    this.doOnce(()=>{
      this.spawnEnemies(amt);
    });
    const enemyCount = scene.countEnemies();
    return enemyCount === 0;
  }

  spawnConstant(minEns, amt = 2) {
    const { scene } = this;
    const enemyCount = scene.countEnemies();
    if (enemyCount < minEns) {
      for (let i=0; i<amt; i++) {
        const type = Phaser.Utils.Array.GetRandom([Enum.SOLDIER_BANDIT1, Enum.SOLDIER_BANDIT2]);
        scene.spawnEnemy(null, type);
      }
    }
  }

  spawnEnemies(amt) {
    const { scene } = this;
    for (let i=0; i<amt; i++) {
      const type = Phaser.Utils.Array.GetRandom([Enum.SOLDIER_BANDIT1, Enum.SOLDIER_BANDIT2]);
      scene.spawnEnemy(null, type);
    }
  }

}