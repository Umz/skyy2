import ActAttack from "../actions/ActAttack";
import ActComplete from "../actions/ActComplete";
import ActDefend from "../actions/ActDefend";
import ActMoveToTargetDistance from "../actions/ActMoveToTargetDistance";
import ActMoveToX from "../actions/ActMoveToX";
import ActWait from "../actions/ActWait";
import ListenCondition from "../actions/ListenCondition";
import ListenState from "../actions/ListenState";
import ListenStatsRecover from "../actions/ListenStatsRecover";
import ActionManager from "../classes/ActionManager";
import Enum from "../const/Enum";
import { GetClosestAllyWithinRange, GetClosestEnemyWithinRange, getOtherLane } from "../util/ActionHelper";

/** Defensive enemies - stick to formation */
export default class Defensive extends ActionManager {
  
  setDefaultActions() {
    this.getIntoFormation();
    this.addBackgroundAction(new ListenStatsRecover(this.sprite));
  }

  getIntoFormation() {

    this.posX = this.sprite.x;
    
    this.addBackgroundAction(new ListenState(this.sprite, Enum.SS_HURT)).addCallback(()=>{
      this.clearAllActions();
      this.hitResponse();
    });
    
    // Just stay close to allies in a free lane

    this.moveToFreeLane();
    this.waitForEnemies();
  }

  //  - Attacking actions   ------------------------------------------------------------------

  // Wait for enemy to come close
  // Attack if enemy gets too close
  // Go back to position

  moveToFreeLane() {
    const closest = GetClosestAllyWithinRange(this.sprite, 240);
    if (closest) {
      const toLane = getOtherLane(closest.lane);
      this.addActions(
        new ListenState(this.sprite, Enum.SS_READY),
        new ActComplete(()=>{ this.sprite.towardsLane(toLane) })
      )
    }
  }

  waitForEnemies() {

    this.addBackgroundAction(new ListenCondition(()=>{
      const closest = GetClosestEnemyWithinRange(this.sprite, 80);
      if (this.sprite.isLane(closest?.lane)) {
        this.clearAllActions();
        this.gotoAndAttack(closest);
      }
    }));

    this.addAction(new ActWait(3000));
    this.addCompleteClear();
  }

  gotoAndAttack(target) {
    this.addActions(
      new ActMoveToTargetDistance(this.sprite, target, 16)
    )
    this.addAttack();
    this.returnToPosition(target);
  }

  returnToPosition(target) {
    this.addActions(
      new ActMoveToX(this.sprite, this.posX, 4)
    )
    this.addFaceTarget(target);
  }

  //  - Action when hit ---------------------------------------------------------
  
  hitResponse() {
    const response = Phaser.Math.Between(1, 2);
    if (response === 1) {
      this.reactDefendCounter();
    }
    else {
      this.reactAttackDouble();
    }
  }

  reactDefendCounter() {
    
    const target = GetClosestEnemyWithinRange(this.sprite, 64);

    this.addBackgroundAction(new ListenState(target, Enum.SS_REPELLED)).addCallback(()=>{
      this.clearAllActions();
      this.sprite.idle();
      this.addAttack();
    });

    this.addFaceTarget(target)
    this.addActions(
      new ActDefend(this.sprite, 750)
    );
    this.addCompleteClear();
  }

  reactAttackDouble() {
    const target = GetClosestEnemyWithinRange(this.sprite, 64);
    this.addFaceTarget(target);
    this.addAction(new ActComplete(()=>{
      if (this.sprite.isLane(target.lane)) {
        this.addAttack();
        this.addAction(new ActWait(350));
        this.addAttack();
      }
    }));
    this.addCompleteClear();
  }

  //  -----------------------------------------------------------------------

  addFaceTarget(target) {
    this.addActions(
      new ActComplete(()=>this.sprite.faceX(target.x)),
      new ListenState(this.sprite, Enum.SS_READY),
      new ActComplete(()=>this.sprite.faceX(target.x)),
      new ListenCondition(()=>{this.sprite.isFacing(target.x)}, 500)
    );
  }

  addAttack() {
    this.addActions(
      new ListenState(this.sprite, Enum.SS_READY),
      new ActAttack(this.sprite)
    )
  }

  addCompleteClear() {
    this.addAction(new ActComplete(()=>{
      this.clearAllActions();
    }))
  }

}
