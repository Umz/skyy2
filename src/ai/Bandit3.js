import ActAttack from "../actions/ActAttack";
import ActComplete from "../actions/ActComplete";
import ActMoveToTargetDistance from "../actions/ActMoveToTargetDistance";
import ActMoveToX from "../actions/ActMoveToX";
import ActSearchForTarget from "../actions/ActSearchForTarget";
import ActWait from "../actions/ActWait";
import ListenMatchLane from "../actions/ListenMatchLane";
import ListenState from "../actions/ListenState";
import ListenStatsRecover from "../actions/ListenStatsRecover";
import ActionManager from "../classes/ActionManager"
import Enum from "../const/Enum";
import { GetCloseX } from "../util/ActionHelper";


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
  
  Get close and attack immediately.
  Run back away towards the starting direction.
  Wait (vulnerable)
  */

  //  ---

  addStatRecovery() {
    this.addBackgroundAction(new ListenStatsRecover(this.sprite));
  }

  //  ---

  searchForNewTarget() {
    this.addAction(new ActSearchForTarget(this.sprite)).addCallback((action)=>{
      this.sprite.target = action.target;
      this.gotoTargetAndAttack();
    });
  }

  gotoTargetAndAttack() {

    const target = this.sprite.target;

    this.addBackgroundAction(new ListenState(this.sprite, Enum.SS_HURT)).addCallback(()=>{
      this.clearAllActions();
      this.evade();
    });

    this.addBackgroundAction(new ListenMatchLane(this.sprite, target));   // Match lane of target
    this.attackTarget(target);
  }

  //  - ATTACK functions -

  attackTarget(target) {

    const attackDelay = Phaser.Math.Between(1000, 1600);
    const attackCooldown = Phaser.Math.Between(500, 1000);

    this.addActions(
      new ActMoveToTargetDistance(this.sprite, target, 42),
      new ActWait(attackDelay),
      new ActAttack(this.sprite),
      new ActWait(500),
      new ActAttack(this.sprite),
      new ActWait(attackCooldown),
      new ActComplete(()=>{
        this.evade();
      })
    );
  }

  evade() {

    const target = this.sprite.target;

    const toX = GetCloseX(this.sprite.x, 80, 120, true);
    const toLane = Phaser.Math.Between(1, 3);

    this.addActions(
      new ListenState(this.sprite, Enum.SS_READY),
      new ActComplete(()=>{ this.sprite.towardsLane(toLane) }),
      new ActMoveToX(this.sprite, toX),
      new ActComplete(()=> { this.sprite.faceX(target.x) }),
      new ActWait(1000)
    );
  }
}
