import Action from "../classes/Action";
import Enum from "../const/Enum";
import Vars from "../const/Vars";

/** Soldiers should be slighly tinted when not in the same lane as the Player */
export default class ViewSoldierLane extends Action {

  constructor(sprite) {
    super(Vars.VIEW_SOLDIER_LANE, sprite);
  }

  update(_, delta) {

    //  Darker when not on the same lane as Player
    const playerLane = this.scene.player.lane;
    const isClear = this.sprite.tint === 0xFFFFFF;
    const offLane = !this.sprite.isLane(playerLane);
    const states = this.sprite.isState(Enum.SS_HURT) || this.sprite.isState(Enum.SS_REPELLED);

    //  Darker the further away
    if (!states && isClear && offLane) {
      const laneDist = Math.abs(this.sprite.lane - playerLane);
      const tint = laneDist === 1 ? 0x999999 : 0x555555;
      this.sprite.setTint(tint);
    }
  }

}
