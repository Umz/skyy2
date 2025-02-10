import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Instructions from "../const/Instructions";
import Vars from "../const/Vars";
import Ctr from "../util/Ctr";
import Subtitles from "../util/Subtitles";
import SequenceHelper from "./SequenceHelper";

let braverSprite, cloverSprite;

export default class P8 extends TutorialSequence {

  init() {

    const { scene } = this;
    const player = this.scene.player;
    const script = Subtitles.GetScript();

    //  - Battle of Storm Village - Destroy buildings and configure battle -

    this

    .addTitle(" >>> Soldier comes to tell Moon Chief that Whiteleaf is attacking Storm village")

    .add(()=>{
      Ctr.SetActions(this.braver,
        Ctr.MoveToX(player.x + 80)
      );
      return true;
    })
    .addBraverSpeakAndWait(Icon.ALARM, "Whiteleaf have sent an army! They are destroying Storm!", 5000)

    .addSpeakerAndWait(player, Icon.ANGER, "What!")
    .addWait(750)
    .addSpeakerAndWait(player, Icon.ANGER, "They dare to attack us!? Do they not fear the Moon at Midnight? They dare to dream they can defeat us!?", 8000)
    .addWait(1000)
    .addSpeakerAndWait(player, Icon.SKY_SPEAR, "To battle!", 4000)

    .addInstruction(Instructions.P8A_GOTO)
    .addIcon(player, Icon.BANNER, 30 * 1000)

    .addTitle(" >>> Battles are already taking place in the forest as you pass through")

    .addPositionCheck(1.9)
    .addBattleSpawn(6, 10)

    .addPositionCheck(2)
    .addSpeakerAndWait(player, Icon.BANNER, "Give no ground!", 2000)

    .addPositionCheck(2.2)
    .addBattleSpawn(10, 18)

    .addPositionCheck(2.3)
    .addSpeakerAndWait(player, Icon.BANNER, "Press onward!", 2000)

    .addPositionCheck(2.5)
    .addSpeaker(player, Icon.SKY_SPEAR, "Fight! Fight!", 2000)
    .addBattleSpawn(15, 10)

    .addPositionCheck(2.8)
    .addSpeaker(player, Icon.SKY_SPEAR, "To the village!", 2000)

    .addPositionCheck(2.9)
    .addBattleSpawn(15, 15)

    .addTitle(" >>> Arriving in Storm village to full scale battle", true)

    .add(()=>{
      scene.resetAllStorm();
      return true;
    })
    .addSave()

    .addPositionCheck(3.1)
    .addBattleSpawn(5, 20)
    .addSpeaker(player, Icon.BANNER, "Now you face the Moon at Midnight!", 3000)

    .add(()=>{
      this.clover.setHP(25, 25);
      return true;
    })

    .add(()=> {
      const ens = [Enum.SOLDIER_WL_INFANTRY, Enum.SOLDIER_WL_HEAVY];
      SequenceHelper.SpawnConstant(7, 3, ens);
      
      this.spawnAlliesConstant(11);
      
      return this.clover.isDead();
    })
    
    .addSpeakerAndWait(player, Icon.BANNER, "Moon Chief has slain the enemy general", 5000)
    .addWait(750)
    .addSpeakerAndWait(player, Icon.FIST_FIRE, "Push back the rest of them!", 3000)
    
    .add(()=>{

      const allEns = this.scene.groupEnemies.getChildren();
      for (let en of allEns) {
        Ctr.SetActions(en,
          Ctr.Do(()=> en.idle()),
          Ctr.MoveToX(en.x + 640),
          Ctr.Die()
        )
      }

      const allies = this.scene.groupAllies.getChildren();
      for (let ally of allies) {
        const icon = Phaser.Utils.Array.GetRandom([Icon.BANNER, Icon.STANDARD, Icon.FIST_SHIELD, Icon.FIST_FIRE])
        const iconWait = Phaser.Math.Between(1000, 6000);
        Ctr.SetActions(ally,
          Ctr.Do(()=> ally.idle()),
          Ctr.Wait(iconWait),
          Ctr.Do(()=>{ ally.showIcon(icon, 7000) }),
          Ctr.Wait(20 * 1000)
        )
      }

      return true;
    })

    .addWait(1000)
    .addInstruction(Instructions.P8B_VICTORY)
  }

  //  ====================================================================================================

  /** Add speech for Lunar and wait for completion */
  addBraverSpeakAndWait(icon, text, ttl) {
    this
    .add(()=>{
      this.braver.speak(icon, text, ttl);
      return true;
    })
    .addWaitForDialogue()
    .addWait(500);
    return this;
  }

  addPositionCheck(mul) {
    this.add(()=>{
      return this.scene.player.x >= Vars.AREA_WIDTH * mul;
    });
    return this;
  }

  spawnAlliesConstant(min) {
    const player = this.scene.player;
    const allies = this.scene.countAllies();
    if (allies < min) {
      const ally = Phaser.Utils.Array.GetRandom([Enum.SOLDIER_ALLY_LANCER1, Enum.SOLDIER_ALLY_HEAVY1, Enum.SOLDIER_ALLY_INFANTRY1]);
      SequenceHelper.SpawnAlly(player.x - 120, ally);
    }
  }

  addBattleSpawn(allies, enemies) {
    this
    .add(() => {
      for (let i=0; i<allies; i++) {
        const opts = [Enum.SOLDIER_ALLY_INFANTRY1, Enum.SOLDIER_ALLY_WILDMAN];
        const soldierID = Phaser.Utils.Array.GetRandom(opts);
        const farRight = SequenceHelper.GetCameraRight() + SequenceHelper.GetCameraWidth();
        const posX = Phaser.Math.Between(SequenceHelper.GetCameraRight(), farRight);
        SequenceHelper.SpawnAlly(posX, soldierID);
      }
      return true;
    })
    .add(() => {
      for (let i=0; i<enemies; i++) {
        const opts = [Enum.SOLDIER_WL_INFANTRY, Enum.SOLDIER_WL_HEAVY];
        const soldierID = Phaser.Utils.Array.GetRandom(opts);
        const farRight = SequenceHelper.GetCameraRight() + SequenceHelper.GetCameraWidth();
        const posX = Phaser.Math.Between(SequenceHelper.GetCameraRight(), farRight);
        SequenceHelper.SpawnEnemy(posX, soldierID);
      }
      return true;
    });
    return this;
  }

  //  - Creation of Sprites -

  get clover() {
    if (!cloverSprite) {
      const player = this.scene.player;
      cloverSprite = SequenceHelper.SpawnEnemy(player.x + 200, Enum.SOLDIER_WL_SPLIT_CLOVER);
      cloverSprite.setDisplayName("Split Clover", Enum.TEAM_ENEMY);
      cloverSprite.setHP(25, 25);
      cloverSprite.setGP(15, 15);
    }
    return cloverSprite;
  }

  get braver() {
    if (!braverSprite) {
      const player = this.scene.player;
      braverSprite = SequenceHelper.SpawnAlly(player.x + 200, Enum.SOLDIER_ALLY_LANCER1);
      braverSprite.setDisplayName("Braver", Enum.TEAM_ALLY);
      braverSprite.setHP(15, 15);
      braverSprite.setGP(15, 15);
    }
    return braverSprite;
  }

}
