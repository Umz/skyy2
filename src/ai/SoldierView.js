import ViewAnimation from "../actions/ViewAnimations";
import ActionManager from "../classes/ActionManager";

export default class SoldierView extends ActionManager {

  constructor(sprite) {
    super(sprite);

    this.addBackgroundAction(new ViewAnimation(sprite));

    // BG View-HIT
    // Add action to Flash
  }
}