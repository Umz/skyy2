import RedDuel from "../ai/RedDuel";
import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Vars from "../const/Vars";
import SaveData from "../util/SaveData";
import Subtitles from "../util/Subtitles";
import SequenceHelper from "./SequenceHelper";

export default class P4 extends TutorialSequence {

  init() {

    const { scene } = this;
    const player = this.scene.player;
    const script = Subtitles.GetScript();

    const stormX = Vars.AREA_WIDTH * 3;
    const minX = Vars.AREA_WIDTH * 4;

    this.enemies = [];
    this.allies = [];

    this
    .addStopSaving()  // Temp (dev)

    //  Next- goto mines and discover Blue Silica

    // 1- Night train appears from east with small contingent
    // 2- Discuss Blue silica, safe to transport now
    // 3- Go with him, mine it
    // 4- Take it back to Storm
    // 5- Harvest Moon says this material can be used- we need the Architect
    // 6- Return to find Fallen Cloud in the Mines- looting
    // 7- Chase him to Green Village
    // 8- He escapes

  }

}
