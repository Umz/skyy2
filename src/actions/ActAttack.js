import Action from "../classes/Action";
import Vars from "../const/Vars";

export default class ActAttack extends Action {

  constructor(sprite) {
    super(Vars.ACT_ATTACK, sprite);
  }

  update(time, delta) {
    this.sprite.attack();
    this.setComplete();
  }
}