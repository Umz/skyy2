import Action from "../classes/Action";
import Enum from "../const/Enum";
import Vars from "../const/Vars";

export default class ViewAnimation extends Action {

  constructor(sprite) {
    super(Vars.VIEW_ANIMATION, sprite);
  }

  update(time, delta) {

    const velX = this.sprite.velocityX;
    const state = this.sprite.state;

    switch (state) {

      case Enum.SS_READY:

        if (velX !== 0) {
          this.sprite.playRun();
          const isFacingRight = this.sprite.flipX;

          if (!isFacingRight && velX < 0 && !this.sprite.isTweening() && this.sprite.movePressed) {
            this.sprite.flipXTween();
          }
          else if (isFacingRight && velX > 0 && !this.sprite.isTweening() && this.sprite.movePressed) {
            this.sprite.flipXTween();
          }
          else if (this.sprite.staticMoveStart) {
            this.sprite.showMovementDust();
          }
        }
        else {
          this.sprite.playIdle();
        }
        this.sprite.clearTint();
        break;

      case Enum.SS_DEFEND:
        this.sprite.playDefend();
        if (!this.sprite.staticMoveStart && velX === 0) {
          this.sprite.showMovementDust();
        }
        break;

      case Enum.SS_ATTACK:
        this.sprite.playAttack();
        break;
    }
  }
}