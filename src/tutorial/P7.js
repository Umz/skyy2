import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Vars from "../const/Vars";
import SaveData from "../util/SaveData";
import Subtitles from "../util/Subtitles";
import SequenceHelper from "./SequenceHelper";

let lunar;

export default class P7 extends TutorialSequence {

  init() {
    
    // Take the Architect and return home

    const { scene } = this;
    const player = this.scene.player;
    const script = Subtitles.GetScript();
    const WIDTH = Vars.AREA_WIDTH;

    const villageX = Vars.AREA_WIDTH * 7;

    const soldier = "Soldier";

    this
    .addStopSaving()  // Temp (dev)

    // Clear any local soldiers.

    .add(()=>{
      SequenceHelper.SpawnEnemiesAt(WIDTH * 7.1, 4, [Enum.SOLDIER_WL_HEAVY])
      return true;
    })
    .addDialogueAndWait(soldier, script.Soldier.halt, 2000)

    // spawn Lunar

    .add(()=>{ return player.x >= Vars.AREA_WIDTH * 7.4 })

    .addTitle("Moon Chief meets the Architect and recruits him")

    .addSpeakerAndWait(player, Icon.SPEECH, script.MoonChief.green1, 1500)
    .addWait(500)
    .addSpeakerAndWait(player, Icon.SPEECH, script.Lunar.green1, 1000)
    .addSpeakerAndWait(player, Icon.SPEECH, script.MoonChief.green2, 1000)
    .addSpeakerAndWait(player, Icon.SPEECH, script.Lunar.green2, 1000)

    // Architect goes left with MC

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

  //  ====================================================================================================


}
