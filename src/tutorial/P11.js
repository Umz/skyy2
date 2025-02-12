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
    const WIDTH = Vars.AREA_WIDTH;

    this
    .addStopSaving()  // Temp (dev)

    .addInstruction(Instructions.P11_CONQUER)

    .addTitle(" >>> Spawn a claimer flag for Greenleaf forest")

    .add(()=>{
      this.doOnce(()=>{
        SequenceHelper.SpawnClaimerFlag(WIDTH * 6.5);
      });
      return SaveData.Data.claimed.includes(Enum.LOC_GREEN_FOREST);
    })
    .addSave()
    .addWait(4000)
    .addSpeakerAndWait(player, Icon.BANNER, "The village is next.", 5000)

    .addTitle(" >>> Spawn a claimer flag for Green village")

    .add(()=>{
      this.doOnce(()=>{
        SequenceHelper.SpawnClaimerFlag(WIDTH * 6.5);
      });
      return SaveData.Data.claimed.includes(Enum.LOC_GREEN_FOREST);
    })
    .addSave()
    .addWait(4000)

    .addSpeakerAndWait(player, Icon.BANNER, "All the land belongs to Moon at Midnight!", 5000)

    .addInstruction(Instructions.P11_COMPLETE)
    .addSave()

    .add(()=> false)
  }

}
