import Action from "../classes/Action";
import Enum from "../const/Enum";
import Vars from "../const/Vars";

export default class ActMatchLane extends Action {

  constructor(sprite, target) {
    super(Vars.ACT_MATCH_LANE, sprite);
    this.target = target;
  }

  update(time, delta) {
    if (this.sprite.isState(Enum.SS_READY)) {
      const isSameLane = this.sprite.isLane(this.target.lane);
      if (!isSameLane) {
        this.sprite.towardsLane(this.target.lane);
        this.setComplete();
      }
      else {
        this.setComplete();
      }
    }
  }

}
