import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Vars from "../const/Vars";
import Subtitles from "../util/Subtitles";

export default class P6 extends TutorialSequence {

  init() {
    
    // Journey from The Mines to Green Village

    const player = this.scene.player;
    const script = Subtitles.GetScript();

    this
    .addTitle("Just generic conversation till Green Village")

    .addPlayerDistanceCheck(4.8)
    .addBlueSpeakAndWait(Icon.EXCLAIM, script.BlueMoon.plains1, 3000)
    .addSpeakerAndWait(player, Icon.QUESTION, script.MoonChief.plains1, 2000)
    .addBlueSpeakAndWait(Icon.QUESTION, script.BlueMoon.plains2, 1000)

    .addPlayerDistanceCheck(5.1)
    .addBlueSpeakAndWait(Icon.SPEECH, script.BlueMoon.plains3, 2000)
    
    .addPlayerDistanceCheck(5.5)
    .addBlueSpeakAndWait(Icon.QUESTION, script.BlueMoon.plains4, 3000)
    .addSpeakerAndWait(player, Icon.STAR_THREE, script.MoonChief.plains2, 2000)

    .addPlayerDistanceCheck(5.9)
    .addBlueSpeakAndWait(Icon.QUESTION, script.BlueMoon.plains5, 3000)
    .addSpeakerAndWait(player, Icon.EXCLAIM, script.MoonChief.plains3, 2000)

    .addTitle("Blue Moon - Should we claim these lands")
    .addPlayerDistanceCheck(6.4)
    .addBlueSpeakAndWait(Icon.BANNER, script.BlueMoon.plains6, 3000)
    .addSpeakerAndWait(player, Icon.SPEECH, script.MoonChief.plains4, 2000)

    .addTitle("Blue Moon - How are we going to get the Architect")
    .addPlayerDistanceCheck(6.8)
    .addBlueSpeakAndWait(Icon.QUESTION, script.BlueMoon.plains7, 4000)
    .addSpeakerAndWait(player, Icon.SPEAR2, script.MoonChief.plains5, 2000)

    .addInstruction(Enum.STORY_5_GREEN_VILLAGE)
  }

  //  =================================================================================================

  /** Add speech for Blue Moon and wait for completion */
  addBlueSpeakAndWait(icon, text, ttl) {
    const { scene } = this;
    this
    .add(()=>{
      const bluemoon = scene.bluemoon;
      bluemoon.speak(icon, text, ttl);
      return true;
    })
    .addWaitForDialogue();
    return this;
  }

  /** Add distance check for Player */
  addPlayerDistanceCheck(mul) {
    const player = this.scene.player;
    this.add(()=>{
      return player.x >= Vars.AREA_WIDTH * mul;
    });
    return this;
  }

}
