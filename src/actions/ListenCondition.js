import Action from "../classes/Action";
import Vars from "../const/Vars";

export default class ListenCondition extends Action {

  constructor(fn, maxTime = -1) {
    super(Vars.LISTEN_CONDITION);
    this.listenerFn = fn;
    this.isTimed = maxTime > 0;
    this.timer = maxTime;
  }

  update(time, delta) {
    this.timer -= delta;
    if (this.listenerFn(delta) || this.isTimeUp()) {
      this.setComplete();
    }
  }

  isTimeUp() {
    if (this.isTimed) {
      return this.timer <= 0;
    }
    return false;
  }
}