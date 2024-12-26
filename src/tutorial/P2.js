import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../util/Enum";

export default class P2 extends TutorialSequence {

  update() {

    const { scene } = this;

    switch (this.step) {
      
      case 0:        
        if (this.checkCount(2000)) {
          this.nextStep();
        }
        break;

      case 1:
        if (this.doOnce()) {
          this.tutorial.showInstructions(Enum.STORY_1A_APPRENTICE);
        }
        break;

      // Kill enemies
      case 2:
        scene.spawnEnemies(2);
        this.nextStep();
        break;

      case 3:
        const enemyCount = scene.countEnemies();
        return enemyCount === 0;
    }

    return false;
  }

}