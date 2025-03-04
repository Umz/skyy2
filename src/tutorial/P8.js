import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Instructions from "../const/Instructions";
import Sfx from "../const/Sfx";
import Vars from "../const/Vars";
import Ctr from "../util/Ctr";
import Subtitles from "../util/Subtitles";
import Vfx from "../util/Vfx";
import SequenceHelper from "./SequenceHelper";

let braverSprite, cloverSprite;

export default class P8 extends TutorialSequence {

  init() {

    const { scene } = this;
    const player = this.scene.player;
    const script = Subtitles.GetScript();

    //  - Battle of Storm Village - Destroy buildings and configure battle -
    // Max troops
    // Split and divide after
  
    // - When to save sequence advancements (Die and reload in specific places)
    // - Which enemies drop items
    // - When does NT drop help

    this
    .addTitle(" >>> Soldier comes to tell Moon Chief that Whiteleaf is attacking Storm village")

    .add(()=>{

      player.boostAttack(40);
      Vfx.ShowAnimatedFX(player, Vars.VFX_CONSUME2);

      Ctr.SetActions(this.braver,
        Ctr.MoveToX(player.x + 80)
      );
      return true;
    })
    .addSpeakAndWait(this.braverID, Icon.ALARM, script.Braver.mam1, 5000, Sfx.VOICE_HO1)

    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.ANGER, script.MoonChief.mam3, 2000, Sfx.VOICE_ANGRY3)
    .addWait(750)
    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.ANGER, script.MoonChief.mam4, 8000, Sfx.VOICE_ANGRY2)
    .addWait(1000)
    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.SKY_SPEAR, script.MoonChief.mam5, 4000, Sfx.VOICE_ATTACK1)

    .addInstruction(Instructions.P8A_GOTO)
    .addIcon(Enum.ID_MOON_CHIEF, Icon.BANNER, 30 * 1000)

    .addTitle(" >>> Battles are already taking place in the forest as you pass through")

    .addPositionCheck(1.9)
    .addBattleSpawn(6, 10)

    .addPositionCheck(2)
    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.BANNER, script.MoonChief.rose4, 2000, Sfx.VOICE_ATTACK1)

    .addPositionCheck(2.2)
    .addBattleSpawn(10, 18)

    .addPositionCheck(2.3)
    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.BANNER, script.MoonChief.rose5, 2000, Sfx.VOICE_ATTACK1)

    .addPositionCheck(2.5)
    .addSpeak(Enum.ID_MOON_CHIEF, Icon.SKY_SPEAR, script.MoonChief.rose6, 2000, Sfx.VOICE_ATTACK1)
    .addBattleSpawn(15, 10)

    .addPositionCheck(2.8)
    .addSpeak(Enum.ID_MOON_CHIEF, Icon.SKY_SPEAR, script.MoonChief.rose7, 2000, Sfx.VOICE_ATTACK1)

    .addPositionCheck(2.9)
    .addBattleSpawn(15, 15)

    .addTitle(" >>> Arriving in Storm village to full scale battle -", true)

    .add(()=>{
      scene.resetAllStorm();
      return true;
    })
    .addSave()

    .addPositionCheck(3.1)
    .addBattleSpawn(5, 20)
    .addSpeak(Enum.ID_MOON_CHIEF, Icon.BANNER, script.MoonChief.storm1, 3000, Sfx.VOICE_ANGRY1)

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
    
    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.BANNER, script.MoonChief.storm2, 5000, Sfx.VOICE_HO1)
    .addWait(750)
    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.FIST_FIRE, script.MoonChief.storm3, 3000, Sfx.VOICE_ATTACK1)
    
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
    // Only Spawn if less than X (too many is pointless)
    const maxTroops = 16;
    this
    .add(() => {
      for (let i=0; i<allies; i++) {
        const opts = [Enum.SOLDIER_ALLY_INFANTRY1, Enum.SOLDIER_ALLY_WILDMAN];
        const soldierID = Phaser.Utils.Array.GetRandom(opts);
        const farRight = SequenceHelper.GetCameraRight() + SequenceHelper.GetCameraWidth();
        const posX = Phaser.Math.Between(SequenceHelper.GetCameraRight(), farRight);
        SequenceHelper.SpawnAlly(posX, soldierID);

        if (this.scene.countAllies() > maxTroops) {
          break;
        }
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

        if (this.scene.countEnemies() > maxTroops) {
          break;
        }
      }
      return true;
    });
    return this;
  }

  //  - Creation of Sprites -

  get clover() {
    if (!cloverSprite) {
      const script = Subtitles.GetScript();
      const player = this.scene.player;
      cloverSprite = this.spawnEnemy(player.x + 200, Enum.SOLDIER_WL_SPLIT_CLOVER, 25, 15, script.Names.SplitClover);
    }
    return cloverSprite;
  }

  get braver() {
    if (!braverSprite) {
      const script = Subtitles.GetScript();
      const player = this.scene.player;
      braverSprite = this.spawnAlly(player.x + 200, Enum.SOLDIER_ALLY_LANCER1, 20, 12, script.Names.Braver);
    }
    return braverSprite;
  }

  get braverID() {
    const braver = this.braver;
    return braver.uid;
  }

}
