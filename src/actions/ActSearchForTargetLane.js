import Action from "../classes/Action";
import Vars from "../const/Vars";
import { GetClosestEnemyWithinRange } from "../util/ActionHelper";

export default class ActSearchForTargetLane extends Action {

  constructor(sprite, distance = 400) {
    super(Vars.ACT_SEARCH_FOR_SAME_LANE, sprite);
    this.maxDistance = distance;
    this.target = null;
  }

  update(_, delta) {
    const target = GetClosestEnemyWithinRange(this.sprite, this.maxDistance);
    if (target && this.sprite.isLane(target.lane)) {
      this.target = target;
      this.setComplete();
    }
  }
}
