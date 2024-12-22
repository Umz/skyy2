import ViewAnimation from "../actions/ViewAnimations";
import ViewHurt from "../actions/ViewHurt";
import ActionManager from "../classes/ActionManager";

export default class SoldierView extends ActionManager {

  constructor(sprite) {
    super(sprite);

    this.addBackgroundAction(new ViewAnimation(sprite));
    this.addBackgroundAction(new ViewHurt(sprite));
  }
}