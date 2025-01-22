import Action from "../classes/Action";
import Vars from "../const/Vars";

export default class ActComplete extends Action {

  constructor(fn) {
    super(Vars.ACT_COMPLETE);
    this.fn = fn;
  }

  update(time, delta) {
    if (this.fn) {
      this.fn();
    }
    this.setComplete();
  }
}