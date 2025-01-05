import ActAttack from "../actions/ActAttack";
import ActMoveToTargetDistance from "../actions/ActMoveToTargetDistance";
import ActSearchForTarget from "../actions/ActSearchForTarget";
import ActWait from "../actions/ActWait";
import ActionManager from "../classes/ActionManager"
import ListenMatchLane from "../actions/ListenMatchLane";
import ListenPlayerDistance from "../actions/ListenPlayerDistance";
import ListenState from "../actions/ListenState";
import Enum from "../const/Enum";
import ActComplete from "../actions/ActComplete";
import ListenCondition from "../actions/ListenCondition";
import ActMoveToTargetOffset from "../actions/ActMoveToTargetOffset";
import Vars from "../const/Vars";
import ListenStatsRecover from "../actions/ListenStatsRecover";

export default class BlueMoon extends ActionManager {

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

    this.addBackgroundAction(new ListenPlayerDistance(this.sprite, 64)).addCallback(()=>{
      this.clearAllActions();
      this.gotoPlayer();
    });

    this.addBackgroundAction(new ListenStatsRecover(this.sprite));
    this.addAction(new ActWait(10 * 60 * 60));  // Instead of call fn repeatedly
  }

  //  - ACTIONS -

  gotoPlayer() {
    const player = this.scene.player;
    this.addBackgroundAction(new ListenStatsRecover(this.sprite));
    this.addAction(new ActMoveToTargetDistance(this.sprite, player, 46));
  }

  // - Battle related -

  engageTarget(target) {

    this.addBackgroundAction(new ListenState(this.sprite, Enum.SS_HURT)).addCallback(()=>{
      this.clearAllActions();
    });
    
    this.addBackgroundAction(new ListenCondition(()=>{ return (!target || target?.isDead()) })).addCallback(()=> {
      this.clearAllActions();
    });
    
    this.addBackgroundAction(new ListenMatchLane(this.sprite, target));   // Match lane of target

    this.battleDecision(target);
  }
  
  battleDecision(target) {
    
    // Defend- timed (exhausted init)

    const defendChance = Phaser.Math.Between(1, 4) == 1;
    const hpLow = this.sprite.getHPPercent() <= .5;
    const gpHigh = this.sprite.getGPPercent() >= .5;
    
    if (target.isFacing(this.sprite.x) && target.isState(Enum.SS_DEFEND)) {
      this.flankEnemy(target);
    }
    else if (hpLow && gpHigh && defendChance) {
      this.defendCounter();
    }
    else {
      const att = Phaser.Math.Between(1, 2);
      switch (att) {
        case 1: this.attackTarget(target); break;
        case 2: this.attackImmediate(target); break;
      }
    }
  }

  attackTarget(target) {
  
    const attackDelay = Phaser.Math.Between(250, 750);
    const attackCooldown = Phaser.Math.Between(500, 1000);

    this.addActions(
      
      new ActMoveToTargetDistance(this.sprite, target, 42),
      new ActWait(attackDelay).addCallback(()=>{
        if (target?.isAlive()) {
          this.sprite.faceX(target.x);
        }
      }),
      new ActWait(150),
      new ActAttack(this.sprite),
      new ActWait(attackCooldown).addCallback(()=>{
        if (target?.isAlive()) {
          this.engageTarget(target);
        }
      })
    );
  }

  attackImmediate(target) {
    const attackCooldown = Phaser.Math.Between(1000, 2000);
    this.addActions(
      new ActMoveToTargetDistance(this.sprite, target, 42),
      new ActAttack(this.sprite),
      new ActWait(attackCooldown).addCallback(()=>{
        if (target?.isAlive()) {
          this.engageTarget(target);
        }
      })
    );
  }

  flankEnemy(target) {

    this.removeBackgroundAction(Vars.LISTEN_MATCH_LANE);

    const offset = target.x < this.sprite.x ? -20 : 20;
    
    this.addActions(
      new ActMoveToTargetDistance(this.sprite, target, 42),
      new ListenCondition(()=>{ return !this.sprite.isTweening() }),
      new ActComplete(() => {
        const lane = target.lane;
        const toLane = lane === 1 || lane === 3 ? 2 : 1;
        this.sprite.towardsLane(toLane);
      }),
      new ActMoveToTargetOffset(this.sprite, target, offset),
      new ActWait(500),
      new ListenCondition(()=>{ return !this.sprite.isTweening() }),
      new ActComplete(() => { this.sprite.towardsLane(target.lane) }),
      new ListenCondition(()=>{
        this.sprite.faceX(target?.x);
        return this.sprite.isFacing(target?.x);
      }),
      new ActWait(300),
      new ActAttack(this.sprite),
      new ActWait(500),
      new ActComplete(() => { this.engageTarget(target) })
    );
  }

  defendTimed() {
    // Blue Moon hates defending
  }

  defendCounter(target) {

    const startingGP = this.sprite.gp;

    this.addActions(
      new ListenCondition(()=>{
        this.sprite.faceX(target?.x);
        return this.sprite.isFacing(target?.x);
      }),
      new ListenCondition(()=>{
        this.sprite.defend(true);
        return this.sprite.gp !== startingGP;
      }, 3000),
      new ActComplete(() => { this.sprite.idle() }),
      new ActWait(150),
      new ActAttack(this.sprite),
      new ActWait(500)
    )
  }

}