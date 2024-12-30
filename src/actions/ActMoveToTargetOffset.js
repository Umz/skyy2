import Action from "../classes/Action";
import Vars from "../const/Vars";

export default class ActMoveToTargetOffset extends Action {

  constructor(sprite, target, offsetX, distance = 4) {
    super(Vars.ACT_MOVE_TO_TARGET_OFFSET, sprite);
    this.target = target;
    this.offset = offsetX;
    this.minDistance = distance;
  }

  update(time, delta) {
    
    const sprite = this.sprite;
    const toX = this.target.x + this.offset;
    const distanceToX = Math.abs(sprite.x - toX);

    if (distanceToX > this.minDistance) {
      sprite.moveTowards(toX);
    }
    else {
      sprite.stopMove();
      this.setComplete();
    }
  }
}