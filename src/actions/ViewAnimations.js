import Action from "../classes/Action";
import Enum from "../util/Enum";
import Vars from "../util/Vars";

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

          // Don't always flip tween
    
          if (!this.sprite.flipX && velX < 0 && !this.sprite.isTweening() && this.sprite.movePressed) {
            this.sprite.flipXTween();
          }
          else if (this.sprite.flipX && velX > 0 && !this.sprite.isTweening() && this.sprite.movePressed) {
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

      case Enum.SS_HURT:
        this.sprite.setTint(0xff5555);
        break;
    }
  }
}