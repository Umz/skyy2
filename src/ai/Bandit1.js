import ActionManager from "../classes/ActionManager"

export default class Bandit1 extends ActionManager {

  constructor(sprite) {
    super(sprite);

    //  Listen for enemies
  }

  setDefaultActions() {
    return true;
  }

}