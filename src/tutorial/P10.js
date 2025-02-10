import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Instructions from "../const/Instructions";
import Vars from "../const/Vars";
import SaveData from "../util/SaveData";
import Subtitles from "../util/Subtitles";
import SequenceHelper from "./SequenceHelper";

let ashSprite, willowSprite, meadowSprite;

export default class P10 extends TutorialSequence {

  init() {

    const { scene } = this;
    const player = this.scene.player;
    const script = Subtitles.GetScript();

    const WIDTH = Vars.AREA_WIDTH;

    const MAX = 300;
    let killed = 0;

    //  - Full scale war in The Plains with multiple duels -

    this
    .addStopSaving()  // Temp (dev)

    .addTitle(" >>> Instructions to go and start a war")

    .addInstruction(Instructions.P10_GOTO_WAR)
    .add(()=> player.x >= WIDTH * 5)

    // Full scale war in the Plains
    // Fight 3 duels (or 2 + 1, etc.)

    // Tall Ash > Falling Willow > Green Meadow

    // Spawn a set number (eg. 300)
    // Complete when all enemies are defeated

    .add(()=> false)
  }

  //  ----------------------------------------------------------------------------------------------------

  //  - Sprites -
  // Tall Ash / Falling Willow / Green Meadow
  
  get tallash() {
    if (!ashSprite) {
      const player = this.scene.player;
      ashSprite = SequenceHelper.SpawnEnemy(player.x + 200, Enum.SOLDIER_WL_SPLIT_CLOVER);
      ashSprite.setDisplayName("Tall Ash", Enum.TEAM_ENEMY);
      ashSprite.setHP(25, 25);
      ashSprite.setGP(15, 15);
    }
    return ashSprite;
  }

}
