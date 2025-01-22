import Action from "../classes/Action";
import Vars from "../const/Vars";
import { getAnyEnemyWithinRange } from "../util/ActionHelper";

export default class ActSearchForRandomTarget extends Action {

  constructor(sprite, distance = 400) {
    super(Vars.ACT_SEARCH_FOR_RANDOM, sprite);
    this.maxDistance = distance;
    this.target = null;
  }

  update(_, delta) {
    const target = getAnyEnemyWithinRange(this.sprite, this.maxDistance);
    if (target) {
      this.target = target;
      this.setComplete();
    }
  }
}
