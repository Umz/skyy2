import Action from "../classes/Action";
import Enum from "../const/Enum";
import Vars from "../const/Vars";

export default class ActDefend extends Action {

  constructor(sprite, time) {
    super(Vars.ACT_DEFEND, sprite);
    this.time = time;
  }

  // Stop defending

  update(time, delta) {
    this.sprite.defend(true);
    this.time -= delta;
    if (this.time <= 0) {
      this.sprite.idle();
      if (this.sprite.isState(Enum.SS_READY)) {
        this.setComplete();
      }
    }
  }
}