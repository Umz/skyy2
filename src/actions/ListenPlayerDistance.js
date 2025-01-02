import Action from "../classes/Action";
import Vars from "../const/Vars";

export default class ListenPlayerDistance extends Action {

  constructor(sprite, distance = 100) {
    super(Vars.LISTEN_PLAYER_DISTANCE, sprite);
    this.player = this.scene.player;
    this.maxDistance = distance;
  }

  update(time, delta) {
    if (!this.isPlayerInRange()) {
      this.setComplete();
    }
  }

  isPlayerInRange() {
    const distanceToTarget = Math.abs(this.sprite.x - this.player.x);
    return (distanceToTarget <= this.maxDistance);
  }
}
