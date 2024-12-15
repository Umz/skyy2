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
          this.nextStep();    // When in Blue Forest
        }
        break;

      case 1:
        if (player.x < Vars.AREA_WIDTH) {
          this.spawnEnemies(6);
          this.nextStep();
        }
        break;

      case 2:
        // Next point
        break;

        
      case 3:
        // Spawn Wildman
        // Spawn enemies + 1 with boss title
        // Run a dialogue script
        break;

      // Wait for all enemies to die
      // Wildman joins team as Blue Moon

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
    const camera = scene.cameras.main;
    const view = camera.worldView;

    if (this.doOnce()) {
      scene.spawnEnemies(amt, view.left);
      return false;
    }
    
    const enemyCount = scene.countEnemies();
    return enemyCount === 0;z

  }

}