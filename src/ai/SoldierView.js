import ViewAnimation from "../actions/ViewAnimations";
import ViewCrowdControl from "../actions/ViewCrowdControl";
import ViewSoldierFlash from "../actions/ViewSoldierFlash";
import ViewSoldierLane from "../actions/ViewSoldierLane";
import ActionManager from "../classes/ActionManager";

export default class SoldierView extends ActionManager {

  setSprite(sprite) {
    super.setSprite(sprite);

    this.addBackgroundAction(new ViewAnimation(sprite));
    this.addBackgroundAction(new ViewSoldierFlash(sprite));

    if (!sprite.isPlayer) {
      this.addBackgroundAction(new ViewSoldierLane(sprite));
      this.addBackgroundAction(new ViewCrowdControl(sprite));
    }

    return this;
  }

}