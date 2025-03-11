import Action from "../classes/Action";
import Vars from "../const/Vars";
import Counter from "../util/Counter";

export default class ActRepeatAtIntervals extends Action {

  constructor(fn, interval = 1000) {
    super(Vars.ACT_REPEAT_INTERVALS);
    this.fn = fn;
    this.counter = new Counter(interval);
  }

  update(time, delta) {
    let isRepeatComplete = false;
    if (this.counter.update(delta)) {
      isRepeatComplete = this.fn(this);
    }
    if (isRepeatComplete) {
      this.setComplete();
    }
  }
}
