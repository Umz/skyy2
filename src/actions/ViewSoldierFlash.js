import Action from "../classes/Action";
import Counter from "../util/Counter";
import Enum from "../const/Enum";
import Vars from "../const/Vars";

export default class ViewSoldierFlash extends Action {

  constructor(sprite) {
    super(Vars.VIEW_SOLDIER_FLASH, sprite);
    this.timer = new Counter(200).setLooping(false);
  }

  update(time, delta) {

    //  Flash when hit or collisions

    switch (this.sprite.state) {

      case Enum.SS_READY:
        this.timer.resetCount();
        break;

      case Enum.SS_HURT:
        this.flash(delta, 0xbb0000);
        break;

      case Enum.SS_REPELLED:
        this.flash(delta, 0xdddddd, true);
        break;
    }
  }

  flash(delta, col, isFill = false) {
    if (this.timer.update(delta)) {
      this.sprite.clearTint();
    }
    else if (isFill) {
      this.sprite.setTintFill(col);
    }
    else {
      this.sprite.setTint(col);
    }
  }

}
