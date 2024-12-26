import Action from "../classes/Action";
import Vars from "../util/Vars";

export default class ActMoveToX extends Action {

  constructor(sprite, toX, distance) {
    super(Vars.ACT_MOVE_TO_X, sprite);
    this.toX = toX;
    this.minDistance = distance;
  }

  update(time, delta) {
    
    const sprite = this.sprite;
    const distanceToX = Math.abs(sprite.x - this.toX);

    if (distanceToX > this.minDistance) {
      sprite.moveTowards(this.toX);
    }
    else {
      sprite.stopMove();
      this.setComplete();
    }
  }
}