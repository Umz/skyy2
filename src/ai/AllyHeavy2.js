import ListenStatsRecover from "../actions/ListenStatsRecover";
import ActionManager from "../classes/ActionManager";
import ActAttack from "../actions/ActAttack";
import ActMoveToTargetDistance from "../actions/ActMoveToTargetDistance";
import ActSearchForTarget from "../actions/ActSearchForTarget";
import ActWait from "../actions/ActWait";
import ListenPlayerDistance from "../actions/ListenPlayerDistance";
import ActComplete from "../actions/ActComplete";
import ActDefend from "../actions/ActDefend";
import ActMatchLane from "../actions/ActMatchLane";
import Enum from "../const/Enum";
import ListenState from "../actions/ListenState";

export default class AllyHeavy2 extends ActionManager {
  
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

    const distamce = Phaser.Math.Between(90, 190);
    this.addBackgroundAction(new ListenPlayerDistance(this.sprite, distamce)).addCallback(()=>{
      this.clearAllActions();
      this.gotoPlayer();
    });

    this.addBackgroundAction(new ListenStatsRecover(this.sprite));
    this.addAction(new ActWait(10 * 60 * 60));  // Instead of call fn repeatedly
  }

  //  - ACTIONS -

  gotoPlayer() {
    const distance = Phaser.Math.Between(32, 70);
    const player = this.scene.player;
    this.addBackgroundAction(new ListenStatsRecover(this.sprite));
    this.addAction(new ActMoveToTargetDistance(this.sprite, player, distance));
    
  }

  engageTarget(target) {

    if (this.sprite.hp > 2) {
      this.attackTarget(target);
    }
    else {
      this.counterTarget(target);
    }
  }
  
  attackTarget(target) {
  
    const attackDelay = Phaser.Math.Between(350, 750);
    const attackCooldown = Phaser.Math.Between(1000, 1500);

    this.addActions(
      new ActMatchLane(this.sprite, target),
      new ActMoveToTargetDistance(this.sprite, target, 36),
      new ActWait(attackDelay),
      new ActAttack(this.sprite),
      new ActWait(attackCooldown)
    );
  }

  counterTarget(target) {

    this.addBackgroundAction(new ListenState(target, Enum.SS_REPELLED)).addCallback(()=>{
      this.clearAllActions();
      this.sprite.idle();
      this.directActtack(target);
    })

    // Wait to counter - then attack 
  
    const defendTime = Phaser.Math.Between(2000, 4000);

    this.addActions(
      
      new ActMoveToTargetDistance(this.sprite, target, 34),
      new ActMatchLane(this.sprite, target),
      new ActDefend(this.sprite, defendTime),
      new ActComplete(()=>{this.sprite.idle()}),

      new ActMatchLane(this.sprite, target),
      new ActMoveToTargetDistance(this.sprite, target, 30),
      new ActWait(150),
      new ActAttack(this.sprite),
      new ActWait(500)
    );
  }

  directActtack(target) {
    this.addActions(
      new ActMatchLane(this.sprite, target),
      new ActMoveToTargetDistance(this.sprite, target, 36),
      new ActAttack(this.sprite),
      new ActComplete(()=>{})
    );
  }

}
