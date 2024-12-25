import Action from "../classes/Action";
import Vars from "../util/Vars";
import { GetClosestEnemyWithinRange } from "../util/ActionHelper";

export default class ActSearchForTarget extends Action {

  constructor(sprite, distance = 400) {
    super(Vars.ACT_SEARCH_FOR_TARGET, sprite);
    this.maxDistance = distance;
    this.target = null;
  }

  update(time, delta) {
    const target = GetClosestEnemyWithinRange(this.sprite, 120);
    if (target) {
      this.target = target;
      this.setComplete();
    }
  }
}
