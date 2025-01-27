import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Vars from "../const/Vars";
import SaveData from "../util/SaveData";
import Subtitles from "../util/Subtitles";
import SequenceHelper from "./SequenceHelper";

export default class P7 extends TutorialSequence {

  init() {
    
    // Take the Architect and return home

    const { scene } = this;
    const player = this.scene.player;
    const script = Subtitles.GetScript();

    const villageX = Vars.AREA_WIDTH * 7;

    this
    .addStopSaving()  // Temp (dev)

    .add(()=>{
      player.x = villageX;
      return true;
    })

    .addInstruction(Enum.STORY_4_CLAIM_STORM)
    // Clear any local soldiers.

    .add(()=>{
      // spawn and wait to 0
      return true;
    })

    .add(()=>{
      return player.x >= Vars.AREA_WIDTH * 7.4;
    })

    .addSpeakerAndWait(player, Icon.SPEECH, "Are you the architect.", 1000)
    .addSpeakerAndWait(player, Icon.SPEECH, "I am.", 1000)
    .addSpeakerAndWait(player, Icon.SPEECH, "Harvest Moon has sent me here for you. Come. Fly with our tribe, Moon at Midnight.", 1000)
    .addSpeakerAndWait(player, Icon.SPEECH, "Gladly. We are oppressed here.", 1000)

    // Architect goes left with MC
    // 

    .add(()=>{
      //  Architect < 7.1
      return player.x <= Vars.AREA_WIDTH * 7.2;
    })

    //
    .addSpeakerAndWait(player, Icon.SPEECH, "Deserter. Traitor. Kill them all!", 1000)
    
    // Spawn and kill all soliders
    
    .addSpeakerAndWait(player, Icon.SPEECH, "Take the architect. I will hold them.", 1000)
    // alone???
    // I am the mighty Moon Chief

    // spawn weak enemeies

    .add(()=>{
      return player.x <= Vars.AREA_WIDTH * 6.6;
    })

    // Spawn Green Sword alone
    // Dialogue and Duel

    .add(()=>{
      return player.x <= Vars.AREA_WIDTH * 4.7;
    })
    .addSpeakerAndWait(player, Icon.SPEECH, "He has gone ahead. Glad to see you made it back.", 1000)

    // (fade in and out) - appear back at MaM

    //  Architect joins and becomes Lunar.

  }

}
