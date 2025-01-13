import ActAttack from "../actions/ActAttack";
import ActComplete from "../actions/ActComplete";
import ActDefend from "../actions/ActDefend";
import ActMoveToTargetDistance from "../actions/ActMoveToTargetDistance";
import ActMoveToX from "../actions/ActMoveToX";
import ActWait from "../actions/ActWait";
import ListenCondition from "../actions/ListenCondition";
import ListenState from "../actions/ListenState";
import ActionManager from "../classes/ActionManager";
import Enum from "../const/Enum";

export default class RedDuel extends ActionManager {

  setSprite(sprite) {
    super.setSprite(sprite);
    return this;
  }

  setDefaultActions() {
    const player = this.player;
    if (player.isAlive()) {
      this.decideAttack();
    }
    else {
      this.addAction(new ActWait(60 * 1000));
    }
  }

  //  - Cancel Action -

  //  -

  decideAttack() {

    const red = this.sprite;
    const tar = this.player;
    
    // Variables to decide the next attack
    // Random, player position, GP

    const isGPLow = red.gp <= 2;
    const isPlayerClose = false;
    
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

    // 4 switch lanes trap
    // GP low - evade mode
  }

  //  - Attack Sequences -

  // Remember when to match lane and when not to.
  // Clear everything on finish

  attackBlockAttack() {
    const red = this.sprite;

    this.addfaceTarget();
    this.addAttackAction();
    this.addAction(new ActDefend(red));
    this.addAttackAction();
  }

  blockToTripleAttack() {
    
    const red = this.sprite;
    const startX = red.x;

    this.addAction(new ActDefend(red, 1500));
    this.addGotoTarget();
    this.addAttackAction();
    this.addAttackAction();
    this.addAttackAction();
    this.addAction(new ActMoveToX(red, startX, 8));
    this.addfaceTarget();
  }

  blockToCounter() {

    const red =  this.sprite;
    const tar = this.player;

    // BG listener for actions
    this.addBackgroundAction(new ListenState(tar, Enum.SS_REPELLED)).addCallback(()=>{
      this.clearAllActions();
      red.idle();
      console.log("Counter");
      this.counterAttack();
    })

    this.addfaceTarget();
    this.addAction(new ActDefend(red, 3000));
    this.addFinalAction();
  }

  counterAttack() {
    this.addAction(new ActWait(100));
    this.addAttackAction();
  }

  // - Ease of Use functions / Components

  addGotoTarget() {
    const red = this.sprite;
    const tar = this.player;

    this.addfaceTarget();
    this.addActions(
      new ActMoveToTargetDistance(red, tar, 28)
    )
  }

  addfaceTarget() {
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

  get player() { return this.scene.player }
}
