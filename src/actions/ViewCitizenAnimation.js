import Action from "../classes/Action";
import Enum from "../const/Enum";
import Vars from "../const/Vars";

export default class ViewCitizenAnimation extends Action {

  constructor(sprite) {
    super(Vars.VIEW_CITIZEN_ANIMATION, sprite);
  }

  update(time, delta) {

    if (!this.sprite)
      return;

    const sprite = this.sprite;
    const velX = sprite.velocityX;
    const state = sprite.state;

    switch (state) {

      case Enum.CS_CHEERING:
        sprite.playCheering();
        break;

      case Enum.CS_FORAGING:
        sprite.playIdleBack();
        break;

      case Enum.CS_CONVERSATION:
        sprite.playIdleSide();
        break;

      case Enum.CS_BOWING:
        sprite.playBow();
        break;

      case Enum.CS_DIGGING:
        sprite.playDigging();
        break;

      default:
        if (velX !== 0) {
          sprite.playWalk();
          sprite.setFlipX(velX < 0);
        }
        else {
          sprite.playIdle();
        }
        break;
    }
  }
}
