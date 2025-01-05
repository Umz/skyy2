import Action from "../classes/Action";
import Vars from "../const/Vars";

/** Soldiers should be slighly tinted when not in the same lane as the Player */
export default class ViewCrowdControl extends Action {

  constructor(sprite) {
    super(Vars.VIEW_CROWD_CONTROL, sprite);
  }

  update(_, delta) {
    
    const isCrowding = this.sprite.scene.isPlayerCrowded;
    const player = this.sprite.scene.player;

    const alpha = (isCrowding && player.lane < this.sprite.lane) ? .2 : 1;
    this.sprite.setAlpha(alpha);
  }

}
