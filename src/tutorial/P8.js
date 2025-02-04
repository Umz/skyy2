import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
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

    //  - Battle of Storm Village - Destroy buildings and configure battle -

    this
    .addStopSaving()  // Temp (dev)

    .addTitle("Soldier comes to tell Moon Chief that Whiteleaf is attacking Storm")

    // announcement from Soldier (The Whiteleaf tribe is attacking)

    .add(()=>{
      Ctr.ClearActions(this.braver);
      Ctr.MoveToX(this.braver);
      return true;
    })
    .addBraverSpeakAndWait(Icon.ALARM, "Whiteleaf have sent an army! They are destroying Storm!", 5000)

    // spawn solder
    // run to Moon Chief

    // Annoucement

    .addSpeakerAndWait(player, Icon.SKY_SPEAR, "They dare to attack us!? Moon at Midnight!")
    .addSpeakerAndWait(player, Icon.SKY_SPEAR, "To battle!")

    // Instructions - Head to Storm village! Quickly.

    .addTitle("Battles are already taking place in the forest as you pass through")

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
