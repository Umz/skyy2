import TutorialPart from "../classes/TutorialPart";
import Enum from "../util/Enum";

export default class P3 extends TutorialPart {

  update() {

    switch (this.step) {
      
      case 0:        
        if (this.checkCount(2000)) {
          this.nextStep();
        }
        break;

      case 1:
        if (this.doOnce()) {
          this.parent.showInstructions(Enum.STORY_1B_APPRENTICE);
        }
        break;

      case 2:
        if (this.spawnAndWait(2)) {
          this.nextStep();
        }
        break;

      case 3:
        if (this.checkCount(1000)) {
          this.nextStep();
        }
        break;

      case 4:
        if (this.spawnAndWait(3)) {
          this.nextStep();
        }
        break;

      case 5:
        if (this.checkCount(3000)) {
          this.nextStep();
        }
        break;

      case 6:
        if (this.spawnAndWait(5)) {
          this.nextStep();
        }
        break;

      case 7:
        if (this.checkCount(2000)) {
          this.nextStep();
        }
        break;

      case 8:
        if (this.doOnce()) {
          this.parent.showInstructions(Enum.STORY_1C_BLUEFOREST);
        }
        break;

      case 9:
        return true;
    }

    return false;
  }

  spawnAndWait(amt) {

    const { scene } = this;

    if (this.doOnce()) {
      scene.spawnEnemies(amt);
      return false;
    }
    
    const enemyCount = scene.countEnemies();
    return enemyCount === 0;z

  }

}