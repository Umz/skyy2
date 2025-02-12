import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Instructions from "../const/Instructions";
import Vars from "../const/Vars";
import SaveData from "../util/SaveData";
import Subtitles from "../util/Subtitles";
import SequenceHelper from "./SequenceHelper";

export default class P11 extends TutorialSequence {

  init() {

    const { scene } = this;
    const player = this.scene.player;
    const script = Subtitles.GetScript();

    this
    .addStopSaving()  // Temp (dev)

    .addInstruction(Instructions.P11_CONQUER)
    // Claim the forest

    // Claim the village

    // Stick around to build Storm
    // Talk to NPCs
    // Collect rocks

    // Game is over- just allow roaming.

  }

}
