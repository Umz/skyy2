import ListenStatsRecover from "../actions/ListenStatsRecover";
import ActionManager from "../classes/ActionManager";

/** BLANK - Used by Player (Change name) */
export default class Blank extends ActionManager {
  
  setSprite(sprite) {
    super.setSprite(sprite);
    this.addBackgroundAction(new ListenStatsRecover(this.sprite));
    return this;
  }

  setDefaultActions() {
    return 0;
  }
}