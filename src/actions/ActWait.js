import Action from "../classes/Action";
import Vars from "../const/Vars";

export default class ActWait extends Action {

  constructor(time) {
    super(Vars.ACT_WAIT_TIME);
    this.waitTime = time;
  }

  update(time, delta) {
    this.waitTime -= delta;
    if (this.waitTime <= 0) {
      this.setComplete();
    }
  }
}