import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Vars from "../const/Vars";
import SaveData from "../util/SaveData";
import PartHelper from "./PartHelper";

export default class P5 extends TutorialSequence {

  init() {
    const { scene } = this;
    const player = scene.player;

    this
    .add(()=>{
      return PartHelper.CheckLocation(Enum.LOC_MAM);
    })

    //  - The rumours are true, they are as beautiful as they say..
    .add(()=>{
      if (player.x > Vars.AREA_WIDTH * 1.6 && SaveData.Data.hasBlueMoon) {
        return PartHelper.ShowConversation(Enum.MC_TAUNT);
      }
      return true;
    })
    .add(()=>{
      return PartHelper.ShowConversation(Enum.MC_TAUNT);
    })
    .add(()=>{
      return false;
    })
  }

}
