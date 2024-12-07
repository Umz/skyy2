import TutorialPart from "../classes/TutorialPart";
import Enum from "../util/Enum";

export default class P4 extends TutorialPart {

  update() {

    const { scene } = this;

    switch (this.step) {
      
      case 0:
        // Wait until in Blue Forest-
        break;

      case 1:
        //  Spawn more based on X position.
        // if (x < point) < point -= 100
        break;
    }

    return false;
  }

}