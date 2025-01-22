import ActAttack from "../actions/ActAttack";
import ActComplete from "../actions/ActComplete";
import ActDefend from "../actions/ActDefend";
import ActMoveOffX from "../actions/ActMoveOffX";
import ActMoveToTargetDistance from "../actions/ActMoveToTargetDistance";
import ActMoveToX from "../actions/ActMoveToX";
import ActSearchForTarget from "../actions/ActSearchForTarget";
import ActSearchForTargetLane from "../actions/ActSearchForTargetLane";
import ActWait from "../actions/ActWait";
import ListenCondition from "../actions/ListenCondition";
import ListenMatchLane from "../actions/ListenMatchLane";
import ListenState from "../actions/ListenState";
import ListenStatsRecover from "../actions/ListenStatsRecover";
import ActionManager from "../classes/ActionManager"
import Enum from "../const/Enum";
import { GetClosestEnemyWithinRange, GetCloseX, getOtherLane } from "../util/ActionHelper";

/** Always stay close to target but not really attack (hit and run) */
export default class Bandit3 extends ActionManager {

  setDefaultActions() {
    this.searchForNewTarget();
    this.addStatRecovery();
  }

  //  Action Sets

  addStatRecovery() {
    this.addBackgroundAction(new ListenStatsRecover(this.sprite));
  }

  addHitListener() {
    this.addBackgroundAction(new ListenState(this.sprite, Enum.SS_HURT)).addCallback(()=>{
      this.clearAllActions();
      this.defend();
    });
  }

  //  ---

  searchForNewTarget() {
    
    this.addAction(new ActSearchForTargetLane(this.sprite)).addCallback((action)=>{
      this.sprite.target = action.target;
      this.clearAllActions();
      this.decideAction();
    });

    // Wait certain amount of time then switch lane
    this.addBackgroundAction(new ActWait(3000)).addCallback(()=> {
      this.clearAllActions().switchLane();
    });
  }

  /** Switches lane independently if can't find a target */
  switchLane() {
    const toLane = getOtherLane(this.sprite.lane);
    this.addAction(
      new ActComplete(()=>{ this.sprite.towardsLane(toLane) })
    );
  }

  // - DECISION

  decideAction() {

    const target = this.sprite.target;

    this.addHitListener();
    this.addBackgroundAction(new ListenMatchLane(this.sprite, target));   // Match lane of target
    this.hitAndRun(target);
  }

  //  - BATTLE functions -

  hitAndRun(target) {

    const startX = this.sprite.x;
    const offX = startX > target.x ? 70 : -70;
    const attackCooldown = Phaser.Math.Between(1500, 2500);
    
    this.addActions(
      new ActComplete(()=>this.sprite.faceX(target.x)),
      new ListenCondition(()=> this.sprite.isFacing(target.x), 350),
      new ActMoveToTargetDistance(this.sprite, target, 34),
      new ActAttack(this.sprite),
      new ListenState(this.sprite, Enum.SS_READY),
      new ActMoveOffX(this.sprite, offX),
      new ActWait(attackCooldown),
      new ActComplete(()=>this.clearAllActions())
    );

  }

  //  Defend if hit
  defend() {
    const target = GetClosestEnemyWithinRange(this.sprite, 450);
    this.addActions(
      new ListenState(this.sprite, Enum.SS_READY),
      new ActComplete(()=>this.sprite.faceX(target.x)),
      new ListenCondition(()=> this.sprite.isFacing(target.x), 350),
      new ActDefend(this.sprite, 2000)
    );
  }

}
