import Action from "../classes/Action";
import Enum from "../util/Enum";
import Vars from "../util/Vars";

export default class ViewHurt extends Action {

  constructor(sprite) {
    super(Vars.VIEW_HURT, sprite);
  }

  update(time, delta) {
    const state = this.sprite.state;
    if (state === Enum.SS_HURT) {
      this.sprite.setTintFill(0xff5555);
    }
  }
}