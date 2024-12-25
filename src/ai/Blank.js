import ListenStatsRecover from "../actions/ListenStatsRecover";
import ActionManager from "../classes/ActionManager";

/** BLANK - Used by Player (Change name) */
export default class Blank extends ActionManager {

  constructor(sprite) {
    super(sprite);

    this.addBackgroundAction(new ListenStatsRecover(this.sprite));
  }

  setDefaultActions() {
    return 0;
  }
}