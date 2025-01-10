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
import ListenCondition from "../actions/ListenCondition";
import ActMoveToTargetOffset from "../actions/ActMoveToTargetOffset";
import ActDefend from "../actions/ActDefend";
import ActMatchLane from "../actions/ActMatchLane";

export default class AllyHeavy1 extends ActionManager {
  
  setSprite(sprite) {
    super.setSprite(sprite);
    return this;
  }

  setDefaultActions() {
    this.listenForPlayerAndEnemies();
  }

   //  -
  
  listenForPlayerAndEnemies() {
    
    this.addBackgroundAction(new ActSearchForTarget(this.sprite)).addCallback((action)=>{
      this.clearAllActions();
      this.sprite.target = action.target;
      this.engageTarget(action.target);
    });

    const distamce = Phaser.Math.Between(70, 120);
    this.addBackgroundAction(new ListenPlayerDistance(this.sprite, distamce)).addCallback(()=>{
      this.clearAllActions();
      this.gotoPlayer();
    });

    this.addBackgroundAction(new ListenStatsRecover(this.sprite));
    this.addAction(new ActWait(10 * 60 * 60));  // Instead of call fn repeatedly
  }

  //  - ACTIONS -

  gotoPlayer() {
    const distamce = Phaser.Math.Between(32, 70);
    const player = this.scene.player;
    this.addBackgroundAction(new ListenStatsRecover(this.sprite));
    this.addAction(new ActMoveToTargetDistance(this.sprite, player, distamce));
    
  }

  engageTarget(target) {

    // Go to and sheild against - if no GP become aggressive
    if (this.sprite.gp > 0) {
      this.defendTarget(target);
    }
    else {
      this.attackTarget(target);
    }
  }

  defendTarget(target) {
  
    const defendTime = Phaser.Math.Between(1000, 2000);

    this.addActions(
      new ActMoveToTargetDistance(this.sprite, target, 34),
      new ActMatchLane(this.sprite, target),
      new ActDefend(this.sprite, defendTime),
      new ActComplete(()=>{this.sprite.idle()}),
      new ActWait(500)
    );
  }

  attackTarget(target) {
  
    const attackDelay = Phaser.Math.Between(750, 1000);
    const attackCooldown = Phaser.Math.Between(1000, 1500);

    this.addActions(
      new ActMatchLane(this.sprite, target),
      new ActMoveToTargetDistance(this.sprite, target, 36),
      new ActWait(attackDelay),
      new ActAttack(this.sprite),
      new ActWait(attackCooldown)
    );
  }

}