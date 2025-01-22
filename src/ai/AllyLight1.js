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
import ActDefend from "../actions/ActDefend";
import ActMoveOffX from "../actions/ActMoveOffX";
import { getOtherLane, getPlusOrMinus } from "../util/ActionHelper";
import ListenCondition from "../actions/ListenCondition";
import ActSearchForRandomTarget from "../actions/ActSearchForRandomTarget";

export default class AllyLight1 extends ActionManager {
  
  setDefaultActions() {
    this.listenForPlayerAndEnemies();
  }

   //  -
  
  listenForPlayerAndEnemies() {
    
    this.addBackgroundAction(new ActSearchForRandomTarget(this.sprite)).addCallback((action)=>{
      this.clearAllActions();
      this.sprite.target = action.target;
      this.decideAction(action.target);
    });

    const distamce = Phaser.Math.Between(70, 120);
    this.addBackgroundAction(new ListenPlayerDistance(this.sprite, distamce)).addCallback(()=>{
      this.clearAllActions();
      this.gotoPlayer();
    });

    this.addBackgroundAction(new ListenStatsRecover(this.sprite));
    this.addAction(new ActWait(10 * 60 * 60));  // Instead of call fn repeatedly
  }

  //  - Action Sets -

  addHitResponse() {
    this.addBackgroundAction(new ListenState(this.sprite, Enum.SS_HURT)).addCallback(()=>{
      this.clearAllActions();
      this.switchLane();
    });
  }

  //  - ACTIONS -

  gotoPlayer() {
    const distamce = Phaser.Math.Between(32, 70);
    const player = this.scene.player;
    this.addBackgroundAction(new ListenStatsRecover(this.sprite));
    this.addHitResponse();
    this.addAction(new ActMoveToTargetDistance(this.sprite, player, distamce));
  }

  switchLane() {
    const toLane = getOtherLane(this.sprite.lane);
    this.addAction(
      new ActComplete(()=>{ this.sprite.towardsLane(toLane) })
    );
  }

  //  - Battle -

  decideAction(target) {

    this.addHitResponse();
    this.addBackgroundAction(new ListenMatchLane(this.sprite, target));

    const isBackTurned = !target.isFacing(this.sprite.x);
    if (isBackTurned) {
      this.shortDoubleAttack(target);
    }
    else {
      this.attackThenDefend(target);
    }
  }

  shortDoubleAttack(target) {
    this.addActions(
      new ActComplete(()=>this.sprite.faceX(target.x)),
      new ListenCondition(()=> this.sprite.isFacing(target.x), 350),
      new ActMoveToTargetDistance(this.sprite, target, 36),
      new ActAttack(this.sprite),
      new ActWait(600),
      new ActAttack(this.sprite)
    );
  }

  /** Attack, Defend in front of target then run ahead in new lane */
  attackThenDefend(target) {

    const attackDelay = Phaser.Math.Between(550, 850);
    const attackCooldown = Phaser.Math.Between(1000, 1500);
    const defendTime = Phaser.Math.Between(1000, 2000);
    const offX = getPlusOrMinus(40);

    this.addActions(

      new ActMoveToTargetDistance(this.sprite, target, 36),
      new ActWait(attackDelay),
      new ActAttack(this.sprite),
      new ListenState(this.sprite, Enum.SS_READY),
      new ActDefend(this.sprite, defendTime),

      new ActComplete(()=>{
        const toLane = getOtherLane(this.sprite.lane);
        this.sprite.towardsLane(toLane);
      }),
      new ActMoveOffX(this.sprite, offX),
      new ActWait(attackCooldown)
    );
  }

}