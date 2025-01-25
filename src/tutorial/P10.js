import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Vars from "../const/Vars";
import SaveData from "../util/SaveData";
import Subtitles from "../util/Subtitles";
import SequenceHelper from "./SequenceHelper";

export default class P10 extends TutorialSequence {

  init() {

    const { scene } = this;
    const player = this.scene.player;
    const script = Subtitles.GetScript();

    this
    .addStopSaving()  // Temp (dev)

    // Full scale war in the Plains
    // Fight 3 duels (or 2 + 1, etc.)

    // Tall Ash > Falling Willow > Green Meadow

    // Spawn a set number (eg. 300)
    // Complete when all enemies are defeated

  }

}
