import ActAttack from "../actions/ActAttack";
import ActComplete from "../actions/ActComplete";
import ActDefend from "../actions/ActDefend";
import ActMoveOffX from "../actions/ActMoveOffX";
import ActMoveToTargetDistance from "../actions/ActMoveToTargetDistance";
import ActMoveToX from "../actions/ActMoveToX";
import ActWait from "../actions/ActWait";
import ListenCondition from "../actions/ListenCondition";
import ListenState from "../actions/ListenState";
import ListenStatsRecover from "../actions/ListenStatsRecover";
import ActionManager from "../classes/ActionManager";
import Enum from "../const/Enum";
import { getAllEnemiesWithinRange, GetClosestAllyWithinRange, GetClosestEnemyWithinRange, getOtherLane, getPlusMinusRange, getPlusOrMinus } from "../util/ActionHelper";

/** Aggressive enemies - desperate to attack back turned otherwise nearby */
export default class Aggressive extends ActionManager {
  
  setDefaultActions() {
    this.findEnemyToAttack();
  }
  
  findEnemyToAttack() {
    
    this.addBackgroundAction(new ListenStatsRecover(this.sprite));
    this.addBackgroundAction(new ListenState(this.sprite, Enum.SS_HURT)).addCallback(()=>{
      this.clearAllActions();
      this.hitResponse();
    });

    //  Try and attack any enemy in range

    const range = 220;
    const allInRange = getAllEnemiesWithinRange(this.sprite, range);
    if (allInRange.length > 0) {
      const facingAway = allInRange.filter(en => !en.isFacing(this.sprite.x));
      if (facingAway.length > 0) {
        const first = facingAway.shift();
        this.gotoAndAttack(first)
      }
      else {
        const closest = GetClosestEnemyWithinRange(this.sprite, range);
        this.gotoAndAttack(closest);
      }
    }
    else {
      this.moveToFreeLane();
    }

    this.addCompleteClear();
  }

  //  - Attacking actions   ------------------------------------------------------------------

  moveToFreeLane() {
    const closest = GetClosestAllyWithinRange(this.sprite, 140);
    if (closest?.lane === this.sprite.lane) {
      const toLane = getOtherLane(closest.lane);
      this.addActions(
        new ListenState(this.sprite, Enum.SS_READY),
        new ActComplete(()=>{ this.sprite.towardsLane(toLane) })
      )
    }
    const cooldown = Phaser.Math.Between(1000, 3000);
    this.addAction(new ActWait(cooldown));
  }

  gotoAndAttack(target) {
    const delay = Phaser.Math.Between(100, 750);
    const offset = getPlusOrMinus(60);
    this.addActions(
      new ActMoveToTargetDistance(this.sprite, target, 40),
      new ActWait(delay),
      new ActComplete(()=>{
        if (this.sprite.isLane(target.lane)) {
          this.sprite.attack();
        }
      }),
      new ListenState(this.sprite, Enum.SS_READY),
      new ActMoveOffX(this.sprite, offset)
    )
  }

  //  - Action when hit ---------------------------------------------------------
  
  hitResponse() {
    this.addActions(
      new ListenState(this.sprite, Enum.SS_READY),
      new ActAttack(this.sprite),
      new ActComplete(()=> true)
    );
  }

  //  -----------------------------------------------------------------------

  addCompleteClear() {
    this.addAction(new ActComplete(()=>{
      this.clearAllActions();
    }))
  }

}
