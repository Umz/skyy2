import EnemyBrain from "../ai/EnemyBrain";
import WildmanBrain from "../ai/WildmanBrain";
import Enum from "../util/Enum";
import Vars from "../util/Vars";

export default class Soldier extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    
    this.prefix = texture;  // Prefix for animations
    this.speed = 96;  // Use 72-

    this.movementSpeed = 0;
    this.state = Enum.SS_READY;
    this.lane = 1;

    this.maxHP = 3;
    this.hp = this.maxHP;

    this.maxGuard = 5;
    this.guard = 5;

    this.brain;

    this.hitbox = new Phaser.Geom.Rectangle(0,0,1,1);
    
    this.setOrigin(.5, 1);

    //  Action to perform when attacking animation completes

    this.on('animationcomplete', (animation, frame) => {
      if (animation.key === this.prefix + Vars.ANIM_ATTACK && this.isState(Enum.SS_ATTACK)) {
        this.state = Enum.SS_READY;
        this.movementSpeed = 0;
      }
    });
  }

  update(time, delta) {

    if (this.brain) {
      this.brain.update(delta);
    }

    const isStaticStart = this.body.velocity.x === 0;
    
    //  Speed updating

    this.body.velocity.x = this.movementSpeed !== 0 ? this.movementSpeed : this.body.velocity.x;

    //  Calculate the slow down

    const velX = this.body.velocity.x;
    if (velX !== 0) {
      const newVelocity = velX * .95;
      this.body.velocity.x = Math.abs(newVelocity) < 4 ? 0 : newVelocity;
    }

    //  State updating
    
    if (this.isState(Enum.SS_REBOUND) || this.isState(Enum.SS_HURT)) {
      this.movementSpeed = 0;
      if (velX === 0) {
        this.state = Enum.SS_READY;
      }
    }
    
    //  View updating
    
    const viewVelX = this.body.velocity.x;

    switch (this.state) {
      case Enum.SS_READY:
        if (velX !== 0) {
          this.playRun();

          // Don't always flip tween
    
          if (!this.flipX && velX < 0 && !this.isTweening()) {
            this.flipXTween();
          }
          else if (this.flipX && velX > 0 && !this.isTweening()) {
            this.flipXTween();
          }
          else if (isStaticStart) {
            this.showMovementDust();
          }
        }
        else {
          this.playIdle();
        }
        this.clearTint();
        break;
      case Enum.SS_DEFEND:
        this.playDefend();
        if (!isStaticStart && viewVelX === 0) {
          this.showMovementDust();
        }
        break;
      case Enum.SS_ATTACK:
        this.playAttack();
        break;
      case Enum.SS_HURT:
        this.setTint(0xff5555);
        break;
    }
  }

  setAllyBrain() {
  }

  setWildmanBrain() {
    this.brain = new WildmanBrain(this);
    return this;
  }

  setEnemyBrain() {
    this.brain = new EnemyBrain(this);
    return this;
  }

  isState(state) {
    return this.state === state;
  }

  isLane(lane) {
    return this.lane === lane;
  }

  getAttackPoint() {
    return {x: this.x + (this.flipX ? -14 : 14), y: this.y + 3};
  }

  getHitBox() {

    const offX = this.width * .15;
    const cX = this.x + (this.flipX ? offX : -offX);
    const width = this.width * .4;
    const left = cX - width * .5;

    this.hitbox.setSize(width, this.height);
    this.hitbox.setPosition(left, this.y - this.height);
    
    return this.hitbox;
  }

  hitboxContainsX(x) {

    const box = this.getHitBox();
    const left = box.left;
    const right = box.right;
      
    return (x >= left && x <= right);
  }

  recoil(intensity = 1) {
    const vX = this.body.velocity.x;
    const recoilSpeed = vX > 0 ? -this.getSpeed() : this.getSpeed();

    this.movementSpeed = recoilSpeed * (intensity * .1);
    this.state = Enum.SS_REBOUND;
  }

  kickback(intensity, pX) {
    const speed = pX > this.x ? -this.getSpeed() : this.getSpeed();
    this.body.velocity.x = speed * (intensity * .1);
  }

  hit(attacker) {

    if (!this.isState(Enum.SS_HURT)) {
      this.hp = Math.max(0, this.hp - 1);
      if (this.hp === 0) {
        this.destroy(true);
        if (this.displayName) {
          this.displayName.destroy(true);
        }
      }
    }
    // only do damage if not already HURT state- no double hits
    this.state = Enum.SS_HURT;
    this.movementSpeed = (attacker.x > this.x) ? -this.getSpeed() : this.getSpeed();
  }

  towardsLane(lane) {
    if (this.lane < lane) {
      this.moveDown();
    }
    else if (this.lane > lane) {
      this.moveUp();
    }
  }

  //  Calculated values

  getSpeed() {
    return this.isBlocking ? 0 : this.speed;
  }

  setLane(lane) {
    const laneY = Vars.GROUND_TOP + 1 + lane;
    this.lane = lane;
    this.setY(laneY);
  }

  setDisplayName(n) {
    this.displayName = n;
  }

  //  Controller functions
  //  Add in a backstep with animation

  moveLeft() {
    const moveSpeed = this.isTweening() ? this.getSpeed() * .75 : this.getSpeed();
    if (this.isState(Enum.SS_READY)) {
      this.movementSpeed = -moveSpeed;
    }
    else if (this.isState(Enum.SS_DEFEND) && this.movementSpeed === 0 && !this.flipX) {
      this.body.velocity.x = -moveSpeed * 1.3;
      this.showMovementDust();
    }
  }

  moveRight() {
    const moveSpeed = this.isTweening() ? this.getSpeed() * .75 : this.getSpeed();
    if (this.isState(Enum.SS_READY)) {
      this.movementSpeed = moveSpeed;
    }
    else if (this.isState(Enum.SS_DEFEND) && this.movementSpeed === 0 && this.flipX) {
      this.body.velocity.x = moveSpeed * 1.3;
      this.showMovementDust();
    }
  }

  moveTowards(x) {
    if (x > this.x) {
      this.moveRight();
    }
    else {
      this.moveLeft();
    }
  }

  stopMove() {
    this.movementSpeed = 0;
  }

  moveUp() {
    if (!this.isTweening() && this.state === Enum.SS_READY) {
      this.lane = Math.max(1, this.lane - 1);
    }
  }

  moveDown() {
    if (!this.isTweening() && this.state === Enum.SS_READY) {
      this.lane = Math.min(3, this.lane + 1);
    }
  }

  attack() {
    if (this.state === Enum.SS_READY) {
      this.state = Enum.SS_ATTACK;
      const dir = this.flipX ? -1 : 1;
      this.movementSpeed = this.speed * 1.1 * dir;
      this.showMovementDust();
    }
  }

  defend(isDefending) {
    if (!this.isState(Enum.SS_HURT)) {
      this.state = isDefending ? Enum.SS_DEFEND : Enum.SS_READY;
      this.movementSpeed = isDefending ? 0 : this.movementSpeed;
    }
  }

  //  Viewer functions

  showMovementDust() {
    this.scene.emitDust(this.x, this.y - 2, this.lane);
  }

  isTweening() {
    return this.scene.tweens.isTweening(this);
  }

  stopTweening() {
    this.scene.tweens.killTweensOf(this);
  }

  faceX(x) {
    
    const distance = this.width * .6;
    const isTargetRight = (x > this.x + distance && this.flipX) ? 1 : 0;
    const isTargetLeft = (x < this.x - distance && !this.flipX) ? -1 : 0;

    if (!this.isTweening() && (isTargetLeft || isTargetRight)) {
      const dir = isTargetRight !== 0 ? isTargetRight : isTargetLeft;
      this.flipXTween(dir);
    }
  }

  isFacing(x) {
    const isRight = x > this.x;
    return (isRight && !this.flipX) || (!isRight && this.flipX);
  }

  flipXTween(flipDirection = 0) {
    
    let skipFirst = false;
    const duration = 150;

    this.scene.tweens.chain({
      targets: this,
      tweens: [
        {
          scaleX: .2,
          duration: duration,
          ease: 'Power2'
        },
        {
          onActive: () => {
            if (skipFirst) {
              const velX = this.body.velocity.x;
              const flipX = flipDirection === 0 ? velX < 0 : flipDirection < 0;
              this.setFlipX(flipX);
            }
            skipFirst = true;
          }
        },
        {
          scaleX: 1,
          duration: duration,
          ease: 'Power2'
        }
      ]
    });
  }

  laneSwitchTween() {
    
    const duration = 150;
    this.scene.tweens.chain({
      targets: this,
      tweens: [
        {
          scaleY: .7,
          duration: 150,
          ease: 'Power2'
        },
        {
          scaleY: 1,
          duration: duration,
          ease: 'Bounce'
        }
      ]
    });
  }

  playIdle() {
    this.anims.play(this.prefix + Vars.ANIM_IDLE, true);
  }

  playRun() {
    this.anims.play(this.prefix + Vars.ANIM_WALK, true);
  }

  playAttack() {
    this.anims.play(this.prefix + Vars.ANIM_ATTACK, true);
  }

  playDefend() {
    this.anims.play(this.prefix + Vars.ANIM_DEFEND, true);
  }

  get velocityX() {
    return this.body.velocity.x;
  }

  get velocityY() {
    return this.body.velocity.y;
  }
}