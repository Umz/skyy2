import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Sfx from "../const/Sfx";
import Vars from "../const/Vars";
import SaveData from "../util/SaveData";
import Subtitles from "../util/Subtitles";
import SequenceHelper from "./SequenceHelper";

export default class P11 extends TutorialSequence {

  init() {

    const player = this.scene.player;
    const script = Subtitles.GetScript();
    const WIDTH = Vars.AREA_WIDTH;

    this
    .addTitle(" >>> End of the game just to claim the final locations -")

    .addInstruction(script.Story.P11_CONQUER)

    .addTitle(" >>> Spawn a claimer flag for Greenleaf forest -")

    .add(()=>{
      this.doOnce(()=>{
        SequenceHelper.SpawnClaimerFlag(WIDTH * 6.5);
      });
      return SaveData.Data.claimed.includes(Enum.LOC_GREEN_FOREST);
    })
    .addSave()
    .addHealing()
    .addWait(4000)

    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.BANNER, script.MoonChief.green9, 5000, Sfx.VOICE_AMUSED1)

    .addTitle(" >>> Spawn a claimer flag for Green village -")

    .add(()=>{
      this.doOnce(()=>{
        SequenceHelper.SpawnClaimerFlag(WIDTH * 6.5);
      });
      return SaveData.Data.claimed.includes(Enum.LOC_GREEN_FOREST);
    })
    .addSave()
    .addHealing()
    .addWait(4000)

    .addSpeakerAndWait(player, Icon.BANNER, script.MoonChief.green10, 5000, Sfx.VOICE_YES1)

    .addInstruction(script.Story.P11_COMPLETE)
    .addSave()

    .add(()=> false)
  }

}
