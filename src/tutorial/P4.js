import TutorialPart from "../classes/TutorialPart";
import Enum from "../util/Enum";
import SaveData from "../util/SaveData";
import Vars from "../util/Vars";

export default class P4 extends TutorialPart {

  update() {

    const { scene } = this;
    const player = scene.player;

    switch (this.step) {
      
      case 0:
        if (SaveData.Data.location === Enum.LOC_BLUE_FOREST) {
          if (this.doOnce()) {
            this.parent.showInstructions(Enum.STORY_2A_CLAIM_BLUE);
          }
        }
        break;

      case 1:
        if (player.x < Vars.AREA_WIDTH) {
          this.spawnEnemies(6);
          this.nextStep();
        }
        break;

      case 2:
        if (player.x < Vars.AREA_WIDTH * .8) {
          this.spawnEnemies(4);
          this.nextStep();
        }
        break;

      case 3:
        if (player.x < Vars.AREA_WIDTH * .65) {
          this.spawnEnemies(3);
          this.nextStep();
        }
        
      case 4:
        if (this.doOnce()) {
          scene.spawnWildman();
        }
        this.nextStep();
        break;

      case 5:
        if (player.x < Vars.AREA_WIDTH * .5 && this.spawnAndWait(8)) {
          this.nextStep();
        }
        break;

      case 6:
        if (this.doOnce()) {
          // Convert Wildman to Blue Moon
          this.parent.showInstructions(Enum.STORY_2B_GO_EAST);
        }
        break;

      case 7:
        return true;
    }

    return false;
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

}