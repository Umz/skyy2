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
      return (player.x > Vars.AREA_WIDTH * 1.5);
    })
    .add(()=>{
      
      const spawnDist = .15;
      PartHelper.SpawnAlly(Vars.AREA_WIDTH * (1.5 - spawnDist), Enum.SOLDIER_ALLY_HEAVY1);
      const ally1 = PartHelper.SpawnAlly(Vars.AREA_WIDTH * (1.5 + spawnDist), Enum.SOLDIER_ALLY_HEAVY1);
      scene.showSpeech(ally1, Vars.IC_ALARM, 2000);

      return true;
    })
    .addConversation(Enum.MAM_SOLDIER_ALERT)
    .addWait(3000)

    .addConversation(Enum.MAM_MC_WHO_DARES)
    .add(()=>{
      PartHelper.SpawnEnemiesAt(player.x + 300, 7, [Enum.SOLDIER_RED1]);
      PartHelper.SpawnEnemiesAt(player.x + 340, 2, [Enum.SOLDIER_RED1]);
      PartHelper.SpawnEnemiesAt(player.x + 390, 2, [Enum.SOLDIER_RED1]);
      return true;
    })

    .add(()=>{
      return false;
    })

    
  }

}
