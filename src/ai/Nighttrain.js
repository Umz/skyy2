import ActMoveOffX from "../actions/ActMoveOffX";
import ActMoveToTargetDistance from "../actions/ActMoveToTargetDistance";
import ActMoveToTargetOffset from "../actions/ActMoveToTargetOffset";
import ActMoveToX from "../actions/ActMoveToX";
import ListenCondition from "../actions/ListenCondition";
import ListenPlayerDistance from "../actions/ListenPlayerDistance";
import ActionManager from "../classes/ActionManager";
import Vars from "../const/Vars";

/** BLANK - Used by Player (Change name) */
export default class NightTrain extends ActionManager {

  setDefaultActions() {
    return 0;
  }

  gotoPlayer(offset = 48) {
    const player = this.scene.player;
    this.addAction(new ActMoveToTargetOffset(this.sprite, player, offset));
  }

  gotoX(x) {
    this.addAction(new ActMoveToX(this.sprite, x))
  }

  followPlayer() {
    const player = this.scene.player;
    this.addBackgroundAction(new ListenCondition(()=>{
      return this.sprite.x >= player.x - 40;
    }))
    .addCallback(()=>{
      this.moveLeftWithPlayer();
    });
  }

  moveLeftWithPlayer() {
    this.addAction(new ActMoveOffX(this.sprite, -240)).addCallback(()=>{
      this.followPlayer();
    });
  }

}
