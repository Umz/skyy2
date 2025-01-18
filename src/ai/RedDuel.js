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
import Icon from "../const/Icon";
import Vars from "../const/Vars";
import { getDistanceFrom, getOtherLane } from "../util/ActionHelper";

export default class RedDuel extends ActionManager {

  setSprite(sprite) {
    super.setSprite(sprite);
    return this;
  }

  setDefaultActions() {
    
    this.sprite.idle();   // Resume idle action
    
    const player = this.player;

    if (player.isAlive()) {
      this.addRecoverGP();
      this.addCancelAction();
      this.decideAttack();
    }
    else {
      this.addAction(new ActWait(30 * 1000));
    }
  }

  addCancelAction() {
    this.addBackgroundAction(new ListenState(this.sprite, Enum.SS_HURT)).addCallback(()=>{
      this.clearAllActions();
      this.moveAway();
    });
  }

  addRecoverGP() {
    this.addBackgroundAction(new ListenStatsRecover(this.sprite));
  }

  //  -

  decideAttack() {

    const red = this.sprite;
    const tar = this.player;

    const isGPLow = red.gp <= 2;
    const isFar = getDistanceFrom(red.x, tar.x) > 80;

    if (isGPLow) {
      this.evadeToRecover();
    }
    else if (isFar) {
      this.waitIfTooFar();
    }
    else {
      this.addAction(new ActDefend(this.sprite, 1 * 1000));
      const rand = Phaser.Math.Between(1, 3);
      switch (rand) {
        case 1:
          this.attackBlockAttack();
          break;
        case 2:
          this.blockToTripleAttack();
          break;
        case 3:
          this.blockToCounter();
          break;
      }
    }
  }

  // - Attack Sequences - Match lanes when necessary

  attackBlockAttack() {
    const red = this.sprite;

    this.addFaceTarget();
    this.addMatchLane();
    this.addAttackAction();
    this.addAction(new ActDefend(red));
    this.addAttackAction();
    this.addFinalAction();
  }

  blockToTripleAttack() {
    
    const red = this.sprite;
    const startX = red.x;

    this.addAction(new ActDefend(red, 1500));
    this.addMatchLane();
    this.addGotoTarget();
    this.addAttackAction();
    this.addAttackAction();
    this.addAttackAction();
    this.addAction(new ActMoveToX(red, startX, 8));
    this.addFaceTarget();
    this.addFinalAction();
  }

  blockToCounter() {

    const red =  this.sprite;
    const tar = this.player;

    // BG listener for actions
    this.addBackgroundAction(new ListenState(tar, Enum.SS_REPELLED)).addCallback(()=>{
      this.clearAllActions();
      red.idle();
      this.counterAttack();
    })

    this.addFaceTarget();
    this.addAction(new ActDefend(red, 3000));
    this.addFinalAction();
  }

  waitIfTooFar() {
    
    const red = this.sprite;
    const tar = this.player;

    this.addBackgroundAction(new ListenCondition(()=>{
      const distance = getDistanceFrom(red.x, tar.x);
      if (distance < 80) {
        this.clearAllActions();
        return true;
      }
    }));

    this.addFaceTarget();
    this.addActions(
      new ActComplete(()=>{
        red.showIcon(Icon.BLOOD, 6000);
      }),
      new ActWait(20 * 1000)
    );
    this.addFinalAction();
  }

  counterAttack() {
    this.addAction(new ActWait(100));
    this.addAttackAction();
  }

  /** Smart action */
  evadeToRecover() {

    const red = this.sprite;
    const tar = this.player;

    const moveDistance = 120;
    const centerX = Vars.AREA_WIDTH * 3.5;
    const destX = Phaser.Math.Between(centerX - moveDistance, centerX + moveDistance);
    const destLane = getOtherLane(tar.lane);

    this.addActions(
      new ActMoveToX(red, centerX),
      new ActComplete(() => red.towardsLane(destLane)),
      new ActWait(500),
      new ActMoveToX(red, destX),
      new ActWait(750)
    );
    this.addFinalAction();
  }

  moveAway() {
    
    const red = this.sprite;
    const tar = this.player;

    const moveDist = red.x > tar.x ? 80 : -80;
    const moveTo = tar.x + moveDist;

    this.addActions(
      new ActMoveToX(red, moveTo)
    );
    this.addFaceTarget();
    this.addFinalAction();
  }

  // - Ease of Use functions / Components

  addGotoTarget() {
    const red = this.sprite;
    const tar = this.player;

    this.addFaceTarget();
    this.addActions(
      new ActMoveToTargetDistance(red, tar, 28)
    )
  }

  addFaceTarget() {
    const red = this.sprite;
    const tar = this.player;
    this.addActions(
      new ActComplete(()=>red.faceX(tar.x)),
      new ListenCondition(()=>{red.isFacing(tar.x)}, 500)
    );
  }

  addAttackAction(cooldown = 0) {
    const red = this.sprite;
    this.addActions(
      new ActAttack(red),
      new ListenState(red, Enum.SS_READY),
      new ActWait(cooldown)
    )
  }

  addFinalAction() {
    this.addAction(new ActComplete(()=>this.clearAllActions()));
  }
  
  addMatchLane() {
    const red = this.sprite;
    const tar = this.player;
    this.addAction(new ActComplete(() => red.towardsLane(tar.lane)));
  }

  get player() { return this.scene.player }
}
