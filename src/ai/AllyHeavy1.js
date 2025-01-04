import ListenStatsRecover from "../actions/ListenStatsRecover";
import ActionManager from "../classes/ActionManager";
import ActAttack from "../actions/ActAttack";
import ActMoveToTargetDistance from "../actions/ActMoveToTargetDistance";
import ActSearchForTarget from "../actions/ActSearchForTarget";
import ActWait from "../actions/ActWait";
import ListenMatchLane from "../actions/ListenMatchLane";
import ListenPlayerDistance from "../actions/ListenPlayerDistance";
import ListenState from "../actions/ListenState";
import Enum from "../const/Enum";
import ActComplete from "../actions/ActComplete";
import ListenCondition from "../actions/ListenCondition";
import ActMoveToTargetOffset from "../actions/ActMoveToTargetOffset";
import Vars from "../const/Vars";

/** BLANK - Used by Player (Change name) */
export default class AllyHeavy1 extends ActionManager {
  
  setSprite(sprite) {
    super.setSprite(sprite);
    this.addBackgroundAction(new ListenStatsRecover(this.sprite));
    return this;
  }

  setDefaultActions() {
    this.listenForPlayerAndEnemies();
  }

   //  -
  
  listenForPlayerAndEnemies() {
    
    this.addBackgroundAction(new ActSearchForTarget(this.sprite)).addCallback((action)=>{
      //this.clearAllActions();
      //this.sprite.target = action.target;
      //this.engageTarget(action.target);
    });

    this.addBackgroundAction(new ListenPlayerDistance(this.sprite, 64)).addCallback(()=>{
      this.clearAllActions();
      this.gotoPlayer();
    });

    this.addBackgroundAction(new ListenStatsRecover(this.sprite));
    this.addAction(new ActWait(10 * 60 * 60));  // Instead of call fn repeatedly
  }

  //  - ACTIONS -

  gotoPlayer() {
    const player = this.scene.player;
    this.addBackgroundAction(new ListenStatsRecover(this.sprite));
    this.addAction(new ActMoveToTargetDistance(this.sprite, player, 46));
    
  }

}