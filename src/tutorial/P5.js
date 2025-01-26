import RedDuel from "../ai/RedDuel";
import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Vars from "../const/Vars";
import SaveData from "../util/SaveData";
import Subtitles from "../util/Subtitles";
import SequenceHelper from "./SequenceHelper";

export default class P5 extends TutorialSequence {

  init() {
    
    // 1- Night train appears from east
    // 2- Discuss Blue silica, safe to transport now
    // 3- Go with him, mine it
    // 4- Take it back to Storm
    // 5- Harvest Moon says this material can be used- we need the Architect
    // 6- Return to find Fallen Cloud in the Mines- looting
    // 7- Go to Green Village

    const { scene } = this;
    const player = this.scene.player;
    const script = Subtitles.GetScript();

    const stormX = Vars.AREA_WIDTH * 3;
    const minX = Vars.AREA_WIDTH * 4;

    let night;
    let king;

    this
    .addStopSaving()  // Temp (dev)

    .add(()=>{
      SequenceHelper.SpawnEnemiesAt(player.x + 100, 4, [Enum.SOLDIER_RED1]);
      return true;
    })

    .add(()=> {
      return SequenceHelper.CheckEnemiesLessOrEqual(0);
    })

    //  Next- goto mines and discover Blue Silica

    .add(()=> {
      night = SequenceHelper.SpawnAlly(player.x + 200, Enum.SOLDIER_NIGHTTRAIN);
      night.speed = 128;
      night.setDisplayName("Night Train", Enum.TEAM_ALLY);
      return true;
    })

    .add(()=>{
      night.controller.gotoPlayer();
      night.speak(Icon.EXCLAIM, "Hey Hey, MC!", 3000);
      return true;
    })
    .addWaitForDialogue()

    .add(()=>{
      night.speak(Icon.EXCLAIM, "Finally took out Red Face!", 3000);
      return true;
    })
    .addWaitForDialogue()

    .add(()=>{
      night.speak(Icon.BANNER, "Come on MC!", 3000);
      night.controller.gotoX(Vars.AREA_WIDTH * 4);
      return true;
    })

    .add(()=>{
      return (player.x > Vars.AREA_WIDTH * 3.9);
    })

    .add(()=>{
      night.speak(Icon.BANNER, "Come on MC!", 3000);
      night.controller.gotoX(Vars.AREA_WIDTH * 4.2);
      return true;
    })

    .add(()=>{
      return (player.x > Vars.AREA_WIDTH * 4.1);
    })

    .add(()=>{
      night.speak(Icon.BANNER, "Come on MC!", 3000);
      night.controller.gotoX(Vars.AREA_WIDTH * 4.4);
      return true;
    })

    .add(()=>{
      return (player.x > Vars.AREA_WIDTH * 4.3);
    })

    .add(()=>{
      night.speak(Icon.EXCLAIM, "Blue Silica!", 3000);
      return true;
    })
    .addWaitForDialogue()

    .addSpeakerAndWait(player, Icon.CONFUSED, "What is it?", 2000)

    .add(()=>{
      night.speak(Icon.EXCLAIM, "Help me break the rocks, the soft ones. Take the blue silica inside. Useful stuff, we can use it building and construction once we refine it.", 3000);
      return true;
    })
    .addWaitForDialogue()

    .addSpeakerAndWait(player, Icon.SLEEP, "Break the rocks", 2000)

    //.addInstruction() Break the rocks to collect Blue Silica
    .addWait(1000)

    .add(()=>{
      scene.spawnRocks(14);
      return true;
    })

    .add(()=>{
      return SaveData.Data.silica > 4;
    })

    .add(()=>{
      night.speak(Icon.EXCLAIM, "Hey! Take me to Moon at Midnight.", 3000);
      return true;
    })
    .addWaitForDialogue()

    .add(()=>{
      night.controller.followPlayer();
      return true;
    })

    .add(()=>{
      return player.x <= Vars.AREA_WIDTH * 3.4;
    })
    .add(()=>{
      night.controller.clearAllActions();
      return true;
    })

    .add(()=>{
      const x = Vars.AREA_WIDTH * 3.3;
      king = scene.spawnCitizen(x, Vars.SHEET_CITIZEN_MAM_KING);
      return true;
    })

    .add(()=>{
      king.speak(Icon.EXCLAIM, "Blue Silica. Incredible", 3000);
      return true;
    })
    .addWaitForDialogue()

    .add(()=>{
      king.speak(Icon.EXCLAIM, "I know a man who knows how to refine this in Green Village. Get him.", 3000);
      return true;
    })
    .addWaitForDialogue()

    //.addInstruction()
    // Head to Green village

    .add(()=>{
      return player.x >= Vars.AREA_WIDTH * 4.1;
    })
    // Spawn soldiers

    .addSpeakerAndWait(player, Icon.EXCLAIM, "Who would dare to loot our mines", 3000)
    .addDialogueAndWait("Fallen Cloud", "Your mines!? Since when!?", 2000)
    .addSpeakerAndWait(player, Icon.EXCLAIM, "These Mines belong to Moon at Midnight now.", 3000)
    
    .add(()=>{
      // All enemies dead
      return true;
    })

    .addDialogueAndWait("Fallen Cloud", "Retreat! Retreat!", 2000)

    //  Claim the land

    .add(()=>{
      this.doOnce(()=>{
        SequenceHelper.SpawnClaimerFlag(Vars.AREA_WIDTH * 4.5);
      });
      return SaveData.Data.claimed.includes(Enum.LOC_MINES);
    })
    .addWait(3000)

    .addInstruction(Enum.STORY_4_CITIZEN_TRIALS)
    // Go to Green Village

    .add(()=>false)
  }

}
