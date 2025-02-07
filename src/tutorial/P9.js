import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Vars from "../const/Vars";
import SaveData from "../util/SaveData";
import Subtitles from "../util/Subtitles";
import SequenceHelper from "./SequenceHelper";

export default class P9 extends TutorialSequence {

  init() {

    const { scene } = this;
    const player = this.scene.player;
    const script = Subtitles.GetScript();

    this
    .addStopSaving()  // Temp (dev)

    //  - Rebuild the village  -------------
    
    // Repeat 2 times then war breaks out before village is complete

    // Lunar comes - Need materials to rebuild

    // Night train goes to mine to wait
    // Break all rocks at the mines
    // Back to storm - interact with Lunar
    // Go around and speak to citizens (optional)

    // Go back to Mines 
    // Break all rocks in mines

    // Back to Storm - see some progress.

    // Soldier comes running- Whiteleaf are attacking

  }

}
