import Action from "../classes/Action";
import Counter from "../util/Counter";
import Enum from "../util/Enum";
import Vars from "../util/Vars";

export default class ListenMatchLane extends Action {

  constructor(sprite, target) {
    super(Vars.LISTEN_MATCH_LANE, sprite);
    this.target = target;
    this.timer = new Counter(550);
  }

  update(time, delta) {
    if (this.sprite.isState(Enum.SS_READY)) {
      const isSameLane = this.sprite.isLane(this.target.lane);
      if (!isSameLane) {
        if (this.timer.update(delta)) {
          this.sprite.towardsLane(this.target.lane);
        }
      }
    }
  }

}
