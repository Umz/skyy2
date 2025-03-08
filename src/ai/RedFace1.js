import ActAttack from "../actions/ActAttack";
import ActComplete from "../actions/ActComplete";
import ActMoveToTargetDistance from "../actions/ActMoveToTargetDistance";
import ActMoveToX from "../actions/ActMoveToX";
import ActSearchForTarget from "../actions/ActSearchForTarget";
import ActWait from "../actions/ActWait";
import ActDefend from "../actions/ActDefend";
import ListenMatchLane from "../actions/ListenMatchLane";
import ListenState from "../actions/ListenState";
import ListenStatsRecover from "../actions/ListenStatsRecover";
import ActionManager from "../classes/ActionManager"
import Enum from "../const/Enum";
import { GetCloseX } from "../util/ActionHelper";
import Vars from "../const/Vars";

export default class RedFace1 extends ActionManager {

  setDefaultActions() {
    this.searchForNewTarget();
    this.addStatRecovery();
  }

  //  ---

  addStatRecovery() {
    this.addBackgroundAction(new ListenStatsRecover(this.sprite));
  }

  //  ---

  searchForNewTarget() {

    if (this.sprite.x > Vars.AREA_WIDTH * 2) {
      this.addActions(
        new ActMoveToX(this.sprite, Vars.AREA_WIDTH * 1.65)
      );
    }

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

    const attackDelay = Phaser.Math.Between(500, 1000);
    const attackCooldown = Phaser.Math.Between(250, 750);

    this.addActions(
      new ActMoveToTargetDistance(this.sprite, target, 42),
      new ActWait(attackDelay),
      new ActAttack(this.sprite),
      new ActWait(350),
      new ActComplete(()=> { this.sprite.faceX(target.x) }),
      new ActDefend(this.sprite, 750),
      new ActComplete(()=> { this.sprite.faceX(target.x) }),
      new ActAttack(this.sprite),
      new ActWait(attackCooldown),
      new ActComplete(()=>{
        if (Math.random() > .5) {
          this.switchLane();
        }
      }),
      new ActComplete(()=> { this.sprite.faceX(target.x) }),
      new ActDefend(this.sprite, 500)
    );
  }

  switchLane() {

    const targetLanes = [1,2,3].filter(l => l !== this.sprite.lane);
    const toLane = Phaser.Utils.Array.GetRandom(targetLanes);

    this.addActions(
      new ListenState(this.sprite, Enum.SS_READY),
      new ActComplete(()=>{ this.sprite.towardsLane(toLane) })
    );
  }

  evade() {

    const target = this.sprite.target;

    const toX = GetCloseX(this.sprite.x, 60, 90, true);
    const targetLanes = [1,2,3].filter(l => l !== this.sprite.lane);
    const toLane = Phaser.Utils.Array.GetRandom(targetLanes);

    this.addActions(
      new ListenState(this.sprite, Enum.SS_READY),
      new ActComplete(()=>{ this.sprite.towardsLane(toLane) }),
      new ActMoveToX(this.sprite, toX),
      new ActComplete(()=> { this.sprite.faceX(target.x) }),
      new ActDefend(this.sprite, 1500)
    );
  }
}
