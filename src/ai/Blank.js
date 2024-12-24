import ActionManager from "../classes/ActionManager";

export default class Blank extends ActionManager {

  constructor(sprite) {
    super(sprite);
  }

  setDefaultActions() {
    return 0;
  }
}