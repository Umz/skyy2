import ActAttack from "../actions/ActAttack";
import ActComplete from "../actions/ActComplete";
import ActMoveToTargetDistance from "../actions/ActMoveToTargetDistance";
import ActSearchForTarget from "../actions/ActSearchForTarget";
import ActWait from "../actions/ActWait";
import ListenAvoidOverlap from "../actions/ListenAvoidOverlap";
import ListenMatchLane from "../actions/ListenMatchLane";
import ListenState from "../actions/ListenState";
import ListenStatsRecover from "../actions/ListenStatsRecover";
import ActionManager from "../classes/ActionManager"
import Enum from "../const/Enum";

export default class Wildman extends ActionManager {

  constructor(sprite) {
    super(sprite);
  }

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
    this.addAction(new ActSearchForTarget(this.sprite)).addCallback((action)=>{
      this.sprite.target = action.target;
      this.gotoTargetAndAttack();
    });
  }

  gotoTargetAndAttack() {

    const sprite = this.sprite;
    const target = this.sprite.target;
    const percentHP = sprite.hp / sprite.maxHP;

    this.actionChoice(percentHP);

    this.addBackgroundAction(new ListenState(this.sprite, Enum.SS_HURT)).addCallback(()=>{
      this.clearAllActions();
    });

    this.addBackgroundAction(new ListenAvoidOverlap(this.sprite)).addCallback(()=>{
      this.clearAllActions();
      this.sprite.stopMove();
      this.sprite.faceX(target.x);

      this.addAction(new ActWait(150));
    });

    this.addBackgroundAction(new ListenMatchLane(this.sprite, target));   // Match lane of target

    this.attackTarget(target);  // Always attack
  }

  //  - ATTACK functions -

  attackTarget(target) {

    const attackDelay = Phaser.Math.Between(750, 1000);
    const attackCooldown = Phaser.Math.Between(1000, 1500);

    this.addActions(
      new ActMoveToTargetDistance(this.sprite, target, 42),
      new ActWait(attackDelay),
      new ActAttack(this.sprite),
      new ActWait(attackCooldown),
      new ActComplete(()=> {
        if (!target || target?.isDead()) {
          this.sprite.recoverHP(3);
        }
      })
    );
  }
}