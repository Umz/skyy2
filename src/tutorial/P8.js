import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Instructions from "../const/Instructions";
import Vars from "../const/Vars";
import Ctr from "../util/Ctr";
import SaveData from "../util/SaveData";
import Subtitles from "../util/Subtitles";
import SequenceHelper from "./SequenceHelper";

let braverSprite;

export default class P8 extends TutorialSequence {

  init() {

    const { scene } = this;
    const player = this.scene.player;
    const script = Subtitles.GetScript();

    const WAIT = 60 * 60 * 1000;

    //  - Battle of Storm Village - Destroy buildings and configure battle -

    this
    .addStopSaving()  // Temp (dev)

    .addTitle(" >>> Soldier comes to tell Moon Chief that Whiteleaf is attacking Storm village")

    .add(()=>{
      Ctr.SetActions(this.braver,
        Ctr.MoveToX(player.x + 80),
        Ctr.Wait(WAIT)
      );
      return true;
    })
    .addBraverSpeakAndWait(Icon.ALARM, "Whiteleaf have sent an army! They are destroying Storm!", 5000)

    .addSpeakerAndWait(player, Icon.ANGER, "What!")
    .addWait(750)
    .addSpeakerAndWait(player, Icon.ANGER, "They dare to attack us!? Do not fear the Moon at Midnight? The dare to dream they can defeat us!?", 8000)
    .addWait(1000)
    .addSpeakerAndWait(player, Icon.SKY_SPEAR, "To battle!", 4000)

    .addInstruction(Instructions.P8A_GOTO)
    .addIcon(player, Icon.BANNER, 30 * 1000)

    .addTitle(" >>> Battles are already taking place in the forest as you pass through")

    .addPositionCheck(1.9)
    .addBattleSpawn(6, 10)

    // spawn soldiers allies and enemies ahead of MC to fight
    // spawn them amongst each other
    // loop (1 by 1) { random(x) }

    // optional fighting, doesn't make any real difference

    .addTitle("Arriving in Storm village to full scale battle")

    .add(()=>{
      return player.x >= Vars.AREA_WIDTH * 2;
    })

    // They are demonlishing Storm Village!

    .add(()=>{
      return player.x >= Vars.AREA_WIDTH * 2.5;
    })

    // Spawn From right

    // Village is already destroyed - buildings down!
    // ALOT of enemies and allies

    // Just a big battle-
    // No Duel - but Split Clover attacks Player only, and bodyguards divert others (AI models - set target with Icon)

    // Split Clover attacking

    // Enemies stop spawning once Split Clover is dead

    .addSpeakerAndWait(player, Icon.BANNER, "Moon Chief has slain the enemy general")
    .addSpeakerAndWait(player, Icon.BANNER, "Push back the rest of them!")

    // battle is over once Split Clover is dead
    // Enemies all retreat - retreat and die

    .addInstruction() // You have won the battle but Storm suffered haeavy damage - we must rebuild

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
      return this.player.x >= Vars.AREA_WIDTH * mul;
    });
    return this;
  }

  addBattleSpawn(allies, enemies) {
    this
    .add(() => {
      for (let i=0; i<allies; i++) {
        const opts = [Enum.SOLDIER_ALLY_INFANTRY1];
        const soldierID = Phaser.Utils.Array.GetRandom(opts);
        const farRight = SequenceHelper.GetCameraRight() + SequenceHelper.GetCameraWidth();
        const posX = Phaser.Math.Between(SequenceHelper.GetCameraRight(), farRight);
        SequenceHelper.SpawnAlly(posX, soldierID);
      }
      return true;
    })
    .add(() => {
      for (let i=0; i<enemies; i++) {
        const opts = [Enum.SOLDIER_WL_INFANTRY];
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

  get braver() {
    if (!braverSprite) {
      const player = this.scene.player;
      braverSprite = SequenceHelper.SpawnAlly(player.x + 200, Enum.SOLDIER_ARCHITECT);
      braverSprite.setDisplayName("Braver", Enum.TEAM_ALLY);
      braverSprite.setHP(15, 15);
      braverSprite.setGP(15, 15);
    }
    return braverSprite;
  }

}
