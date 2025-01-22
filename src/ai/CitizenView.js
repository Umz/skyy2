import ViewCitizenAnimation from "../actions/ViewCitizenAnimation";
import ActionManager from "../classes/ActionManager";

export default class CitizenView extends ActionManager {

  setSprite(sprite) {
    super.setSprite(sprite);
    this.addBackgroundAction(new ViewCitizenAnimation(sprite));
    return this;
  }

}
