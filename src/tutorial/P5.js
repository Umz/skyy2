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
    
    .add(()=>{
      return (player.x > Vars.AREA_WIDTH * 1.45 && SaveData.Data.hasBlueMoon);
    })
    .addConversation(Enum.MAM_BM_FIRST)

    .add(()=>{
      return false;
    })
  }

}
