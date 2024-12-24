import ActAttack from "../actions/ActAttack";
import ActDefend from "../actions/ActDefend";
import ActMoveToTargetDistance from "../actions/ActMoveToTargetDistance";
import ActSearchForTarget from "../actions/ActSearchForTarget";
import ActWait from "../actions/ActWait";
import ListenAvoidOverlap from "../actions/ListenAvoidOverlap";
import ListenMatchLane from "../actions/ListenMatchLane";
import ListenState from "../actions/ListenState";
import ActionManager from "../classes/ActionManager"
import Enum from "../util/Enum";

export default class Bandit1 extends ActionManager {

  constructor(sprite) {
    super(sprite);
  }

  setDefaultActions() {
    this.searchForNewTarget();
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

  }

  //  - ATTACK functions -

  actionChoice(percent) {
    
    // HP Good - 90% attack
    // HP Med - 50 % attack
    // HP Low - 25% attack
    
    const target = this.sprite.target;
    const isAttack = Math.random() < percent;

    if (isAttack) {
      this.attackTarget(target);
    }
    else {
      this.defendTarget(target);
    }
  }

  attackTarget(target) {

    const attackDelay = Phaser.Math.Between(1000, 1600);
    const attackCooldown = Phaser.Math.Between(500, 1000);

    this.addActions(
      new ActMoveToTargetDistance(this.sprite, target, 42),
      new ActWait(attackDelay),
      new ActAttack(this.sprite),
      new ActWait(attackCooldown)
    );
  }

  defendTarget(target) {

    const defendTime = Phaser.Math.Between(1000, 3000);
    const cooldown = Phaser.Math.Between(750, 1000);

    this.addActions(
      new ActMoveToTargetDistance(this.sprite, target, 42),
      new ActDefend(this.sprite, defendTime),
      new ActWait(cooldown)
    );
  }
}