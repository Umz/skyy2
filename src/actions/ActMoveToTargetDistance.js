import Action from "../classes/Action";
import Vars from "../const/Vars";

export default class ActMoveToTargetDistance extends Action {

  constructor(sprite, target, distance = 100) {
    super(Vars.ACT_MOVE_TO_TARGET_DISTANCE, sprite);
    this.target = target;
    this.maxDistance = distance;
  }

  update(time, delta) {
    
    const sprite = this.sprite;
    const target = this.target;

    const distanceToTarget = Math.abs(sprite.x - target.x);

    if (distanceToTarget > this.maxDistance) {
      sprite.moveTowards(target.x);
    }
    else {
      sprite.stopMove();
      sprite.faceX(target.x);
      this.setComplete();
    }
  }

}