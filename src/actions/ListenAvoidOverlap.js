import Action from "../classes/Action";
import { GetClosestAllyWithinRange } from "../util/ActionHelper";
import Vars from "../const/Vars";

export default class ListenAvoidOverlap extends Action {

  constructor(sprite) {
    super(Vars.LISTEN_AVOID_OVERLAP, sprite);
  }

  update(time, delta) {

    const closest = GetClosestAllyWithinRange(this.sprite, 32);
    const target = this.target || this.sprite.target;
    const closestTarget = closest?.target;

    if (closest && this.isSameTarget(target, closestTarget)) {
      
      const distanceToTarget = Math.abs(this.sprite.x - target.x);
      const allyDistanceToTarget = Math.abs(closest.x - target.x);
      
      // Stop and allow ally to go ahead if overlapped and they are closer to the target
      if (allyDistanceToTarget < distanceToTarget) {
        this.sprite.stopMove();
        this.sprite.faceX(target.x);
        this.setComplete();
      }
    }
  }

  isSameTarget(t1, t2) {
    return t1 && t2 && t1 === t2;
  }
}
