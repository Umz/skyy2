import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../util/Enum";
import SaveData from "../util/SaveData";
import Vars from "../util/Vars";

export default class P4 extends TutorialSequence {

  init() {
    
    const { scene } = this;
    const player = scene.player;

    this.add(()=>{
      if (SaveData.Data.location === Enum.LOC_BLUE_FOREST) {
        if (this.doOnce()) {
          this.tutorial.showInstructions(Enum.STORY_2A_CLAIM_BLUE);
        }
      }
    })
    .add(()=>{
      if (player.x < Vars.AREA_WIDTH) {
        this.spawnEnemies(3);
        this.showConversation(Enum.BF_TEST);
        return true;
      }
    })
    .add(()=>{
      if (player.x < Vars.AREA_WIDTH * .75) {
        return this.spawnAndWait(3);
      }
    })
    .add(()=>{
      if (player.x < Vars.AREA_WIDTH * .65) {
        this.spawnEnemies(2);
        scene.spawnWildman();
        scene.convo.showConversation(Enum.BF_BATTLE);
        return true;
      }
    })
    .add(()=>{
      return this.countEnemies() === 0;
    })
    // Keep spawning until conversation is complete
    .add(()=>{
      this.spawnConstant(3, 2);
      return this.tutorial.isConversationComplete();
    })
    .add(()=>{
      return this.countEnemies() === 0;
    })

    .add(()=>{
      this.showConversation(Enum.BF_WIN);
      return true;
    })

    // Claim the land-  place a flag - while conversation is happening

    .add(()=>{
      return this.tutorial.isConversationComplete();
    })
    .add(()=>{
      if (this.doOnce()) {
        this.tutorial.showInstructions(Enum.STORY_2B_PLACE_FLAG);
      }
    });

  } // init()

  //  - Helper functions for P4

  countEnemies() {
    return this.scene.countEnemies();
  }

  spawnEnemies(amt) {

    const { scene } = this;
    const camera = scene.cameras.main;
    const view = camera.worldView;

    scene.spawnEnemies(amt, view.left);
  }

  spawnAndWait(amt) {

    const { scene } = this;

    if (this.doOnce()) {
      scene.spawnEnemies(amt);
      return false;
    }
    
    const enemyCount = scene.countEnemies();
    return enemyCount === 0;

  }

  spawnConstant(minEns, amt = 2) {
    const { scene } = this;
    const enemyCount = scene.countEnemies();
    if (enemyCount < minEns) {
      scene.spawnEnemies(amt);
    }
  }

}