import ActAttack from "../actions/ActAttack";
import ActDefend from "../actions/ActDefend";
import ActMoveToTargetDistance from "../actions/ActMoveToTargetDistance";
import ActWait from "../actions/ActWait";
import ListenCondition from "../actions/ListenCondition";
import ListenMatchLane from "../actions/ListenMatchLane";
import ListenState from "../actions/ListenState";
import ListenStatsRecover from "../actions/ListenStatsRecover";
import ActionManager from "../classes/ActionManager";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import { getDistanceFrom } from "../util/ActionHelper";

/** Attack Player continuously and recklessly */
export default class CloverBoss extends ActionManager {
  
  setDefaultActions() {
    this.addBackgroundAction(new ListenStatsRecover(this.sprite));
    this.attackSpree();
  }
  
  attackSpree() {
    
    const player = this.scene.player;

    this.addBackgroundAction(new ListenMatchLane(this.sprite, player));

    this.addActions(
      new ActMoveToTargetDistance(this.sprite, player, 32),
      new ActAttack(this.sprite),
      new ListenState(this.sprite, Enum.SS_READY),
      new ActAttack(this.sprite),
      new ActWait(1050),
      new ActDefend(this.sprite, 300),
      new ActAttack(this.sprite),
      new ListenState(this.sprite, Enum.SS_READY)
    );

    this.addBackgroundAction(new ListenState(this.sprite, Enum.SS_HURT)).addCallback(()=>{
      this.clearAllActions();

      let OPT = Phaser.Math.Between(1, 6);
      if (OPT <= 3) {
        this.blockAndEvade();
      }
      else if (OPT <= 5) {
        this.blockCounter();
      }
      else {
        this.hitStunned();
      }
    })
  }

  // Counter, block, stunned

  hitStunned() {

    const TIME = 2 * 1000;
    this.sprite.showIcon(Icon.CONFUSED, TIME);

    this.addAction(new ActWait(TIME)).addCallback(()=>{
      this.clearAllActions();
    });
  }

  blockCounter() {

    const player = this.scene.player;
    const TIME = 3 * 1000;

    this.sprite.showIcon(Icon.SHIELDED_REFLECT, TIME);
    
    this.addBackgroundAction(new ListenCondition(()=>{
      this.sprite.faceX(player.x);
      this.sprite.defend(true);
    }));

    this.addBackgroundAction(new ActWait(TIME)).addCallback(()=>{
      this.clearAllActions();
      this.sprite.defend(false);
    });
    
    this.addAction(new ListenState(player, Enum.SS_REPELLED)).addCallback(()=>{
      this.clearAllActions();
      this.sprite.idle();
      this.addAction(new ActWait(500));
      this.attackSpree();
    });
  }
  
  blockAndEvade() {
    
    const player = this.scene.player;
    this.addBackgroundAction(new ListenCondition(()=>{
      
      this.sprite.faceX(player.x);
      this.sprite.defend(true);

      if (getDistanceFrom(this.sprite.x, player.x) < 30) {
        const move = this.sprite.x > player.x ? 1 : -1;
        this.sprite.moveDirection(move);
      }

    }));

    this.addAction(new ActWait(3 * 1000)).addCallback(()=>{
      this.sprite.defend(false);
      this.clearAllActions();
    });
  }

}