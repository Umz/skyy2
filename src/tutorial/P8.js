import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Vars from "../const/Vars";
import SaveData from "../util/SaveData";
import Subtitles from "../util/Subtitles";
import SequenceHelper from "./SequenceHelper";

export default class P8 extends TutorialSequence {

  init() {

    const { scene } = this;
    const player = this.scene.player;
    const script = Subtitles.GetScript();

    this
    .addStopSaving()  // Temp (dev)

    .addTitle("Soldier comes to tell Moon Chief that Whiteleaf is attacking Storm")
    // Full scale war destroys Storm Village

    // announcement from Soldier (The Whiteleaf tribe is attacking)
    .addSpeakerAndWait(player, Icon.SKY_SPEAR, "They dare to attack us!? Moon at Midnight!")
    .addSpeakerAndWait(player, Icon.SKY_SPEAR, "To battle!")

    .add(()=>{
      return player.x >= Vars.AREA_WIDTH * 2.1;
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

    // All enemies = 0 

    .addInstruction() // You have won the battle but Storm suffered haeavy damage - we must rebuild

  }

}
