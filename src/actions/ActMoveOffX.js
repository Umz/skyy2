import Action from "../classes/Action";
import Vars from "../const/Vars";

export default class ActMoveOffX extends Action {

  constructor(sprite, distance = 16) {
    super(Vars.ACT_MOVE_OFF_X, sprite);
    this.offset = distance;
  }

  update(time, delta) {
    
    const sprite = this.sprite;
    const targetDistance = Math.abs(this.offset); // The distance the sprite should move
    const distanceFromStart = Math.abs(sprite.x - this.fromX);

    if (distanceFromStart < targetDistance) { 
      const toX = this.fromX + this.offset; // Calculate the target position
      sprite.moveTowards(toX); 
    }
    else {
      sprite.stopMove();
      this.setComplete();
    }
  }

  init() {
    this.fromX = this.sprite.x;

    console.log(`From ${this.fromX} - to ${this.fromX + this.offset}`);
  }

}
