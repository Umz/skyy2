import ActAttack from "../actions/ActAttack";
import ActMoveToTargetDistance from "../actions/ActMoveToTargetDistance";
import ActSearchForTarget from "../actions/ActSearchForTarget";
import ActWait from "../actions/ActWait";
import ListenAvoidOverlap from "../actions/ListenAvoidOverlap";
import ActionManager from "../classes/ActionManager"

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

    const target = this.sprite.target;
    const attackDelay = Phaser.Math.Between(1000, 1600);    // Easy enemies
    const attackCooldown = Phaser.Math.Between(250, 900);

    this.addActions(
      new ActMoveToTargetDistance(this.sprite, target, 42),
      new ActWait(attackDelay),
      new ActAttack(this.sprite),
      new ActWait(attackCooldown)
    );

    // Figure out when NOT to cancel while avoiding- if neeeded?
    // What to do if overlapping - move away and switch lanes

    this.addBackgroundAction(new ListenAvoidOverlap(this.sprite)).addCallback(()=>{
      this.clearAllActions();
      this.sprite.stopMove();
      this.sprite.faceX(target.x);

      this.addAction(new ActWait(150));
    });

    //  Background - match lane of target - with delay

  }

}