import ActAttack from "../actions/ActAttack";
import ActComplete from "../actions/ActComplete";
import ActMoveOffX from "../actions/ActMoveOffX";
import ActMoveToTargetDistance from "../actions/ActMoveToTargetDistance";
import ActMoveToX from "../actions/ActMoveToX";
import ActSearchForTarget from "../actions/ActSearchForTarget";
import ActSearchForTargetLane from "../actions/ActSearchForTargetLane";
import ActWait from "../actions/ActWait";
import ListenMatchLane from "../actions/ListenMatchLane";
import ListenState from "../actions/ListenState";
import ListenStatsRecover from "../actions/ListenStatsRecover";
import ActionManager from "../classes/ActionManager"
import Enum from "../const/Enum";
import { GetCloseX, getOtherLane } from "../util/ActionHelper";

/** Always stay close to target but not really attack (hit and run) */
export default class Bandit3 extends ActionManager {

  setDefaultActions() {
    this.searchForNewTarget();
    this.addStatRecovery();
  }

  /*
  1) Find closest ally in lane
  If none - attack and wait - switch lane

  Move away from overlapping allies (switch lanes if ally is closer)
  Defend if attacked-
  */

  //  ---

  addStatRecovery() {
    this.addBackgroundAction(new ListenStatsRecover(this.sprite));
  }

  //  ---

  searchForNewTarget() {
    
    this.addAction(new ActSearchForTargetLane(this.sprite)).addCallback((action)=>{
      this.sprite.target = action.target;
      this.clearAllActions();
      this.gotoTargetAndAttack();
    });

    // Wait certain amount of time then switch lane
    this.addBackgroundAction(new ActWait(3000)).addCallback(()=> {
      this.clearAllActions()
      this.switchLane();
    });

  }

  /** Switches lane independently if can't find a target */
  switchLane() {
    const toLane = getOtherLane(this.sprite.lane);
    this.addAction(
      new ActComplete(()=>{ this.sprite.towardsLane(toLane) })
    );
  }

  // -

  gotoTargetAndAttack() {

    const target = this.sprite.target;

    this.addBackgroundAction(new ListenState(this.sprite, Enum.SS_HURT)).addCallback(()=>{
      this.clearAllActions();
      //this.evade();
    });

    this.addBackgroundAction(new ListenMatchLane(this.sprite, target));   // Match lane of target

    this.fullAttackMotion(target);
  }

  //  - BATTLE functions -

  fullAttackMotion(target) {

    const startX = this.sprite.x;
    const offX = startX > target.x ? 100 : -100;
    const attackCooldown = Phaser.Math.Between(1500, 2500);
    
    this.addActions(
      new ActMoveToTargetDistance(this.sprite, target, 34),
      new ActAttack(this.sprite),
      new ListenState(this.sprite, Enum.SS_READY),
      new ActMoveOffX(this.sprite, offX),
      new ActWait(attackCooldown),
      new ActComplete(()=>this.clearAllActions())
    );

  }

  defend() {

    //  Defend if hit attacked

  }

}
