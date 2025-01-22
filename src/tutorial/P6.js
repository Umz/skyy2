import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Vars from "../const/Vars";
import SaveData from "../util/SaveData";
import Subtitles from "../util/Subtitles";
import SequenceHelper from "./SequenceHelper";

export default class P6 extends TutorialSequence {

  init() {
    
    // 1- Journey from The Mines to Green Village

    const { scene } = this;
    const player = this.scene.player;
    const script = Subtitles.GetScript();

    const minesX = Vars.AREA_WIDTH * 5;

    this
    .addStopSaving()  // Temp (dev)

    .add(()=>{
      return player.x >= Vars.AREA_WIDTH * 4.8
    })

    .addBlueSpeakAndWait(Icon.EXCLAIM, "This is far from the forest", 3000)
    .addSpeakerAndWait(player, Icon.EXCLAIM, "What of it?", 2000)
    .addBlueSpeakAndWait(Icon.EXCLAIM, "What..", 1000)

    .add(()=>{
      return player.x >= Vars.AREA_WIDTH * 5.1
    })

    .addBlueSpeakAndWait(Icon.EXCLAIM, "These lands..", 3000)

    .add(()=>{
      return player.x >= Vars.AREA_WIDTH * 5.5
    })
    .addBlueSpeakAndWait(Icon.EXCLAIM, "What are these chests?", 3000)
    .addSpeakerAndWait(player, Icon.EXCLAIM, "Paying homage.", 2000)

    .add(()=>{
      return player.x >= Vars.AREA_WIDTH * 5.9
    })

    .addBlueSpeakAndWait(Icon.EXCLAIM, "What forest is this?", 3000)
    .addSpeakerAndWait(player, Icon.EXCLAIM, "I don't know of it.", 2000)

    .add(()=>{
      return player.x >= Vars.AREA_WIDTH * 6.4
    })

    .addBlueSpeakAndWait(Icon.EXCLAIM, "Shall we claim this place?", 3000)
    .addSpeakerAndWait(player, Icon.EXCLAIM, "Soon.", 2000)

    .add(()=>{
      return player.x >= Vars.AREA_WIDTH * 6.8
    })

    .addBlueSpeakAndWait(Icon.EXCLAIM, "What is the plan to take the Architect?", 3000)
    .addSpeakerAndWait(player, Icon.EXCLAIM, "Diplomacy.", 2000)

    //.addInstruction()
    // Take the Architect and return home

    .add(()=>false)
  }

  //  -

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

}
