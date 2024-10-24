
// Action based (Slime Game) sprites 
// 3- Player Controlled
// 4- Action controller

import Enum from "../util/Enum";
import Vars from "../util/Vars";

export default class Soldier extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    
    this.prefix = texture;  // Prefix for animations

    this.movementSpeed = 0;
    this.speed = 96;  // Use 72-
    this.state = Enum.SS_READY;
    
    this.setOrigin(.5, 1);

    //  Action to perform when attacking animation completes
    
    this.on('animationcomplete', (animation, frame) => {
      if (animation.key === this.prefix + Vars.ANIM_ATTACK) {
        this.state = Enum.SS_READY;
        this.movementSpeed = 0;
      }
    });
  }

  update(time, delta) {

    //  Speed updating
    
    this.body.velocity.x = this.movementSpeed !== 0 ? this.movementSpeed : this.body.velocity.x;

    //  Calculate the slow down

    const velX = this.body.velocity.x;
    if (velX !== 0) {
      const newVelocity = velX * .95;
      this.body.velocity.x = Math.abs(newVelocity) < 4 ? 0 : newVelocity;
    }

    //  View updating

    switch (this.state) {
      case Enum.SS_READY:
        if (velX !== 0) {
          this.playRun();
    
          if (!this.flipX && velX < 0 && !this.isTweening()) {
            this.flipXTween();
          }
          else if (this.flipX && velX > 0 && !this.isTweening()) {
            this.flipXTween();
          }
        }
        else {
          this.playIdle();
        }
        break;
      case Enum.SS_DEFEND:
        this.playDefend();
        break;
      case Enum.SS_ATTACK:
        this.playAttack();
        break;
    }
  }

  //  Calculated values

  getSpeed() {
    return this.isBlocking ? 0 : this.speed;
  }

  //  Controller functions

  moveLeft() {
    const moveSpeed = this.isTweening() ? this.getSpeed() * .75 : this.getSpeed();
    this.movementSpeed = -moveSpeed;
  }

  moveRight() {
    const moveSpeed = this.isTweening() ? this.getSpeed() * .75 : this.getSpeed();
    this.movementSpeed = moveSpeed;
  }

  stopMove() {
    this.movementSpeed = 0;
  }

  moveUp() {
  }

  moveDown() {
  }

  attack() {
    if (this.state === Enum.SS_READY) {
      this.state = Enum.SS_ATTACK;
      const dir = this.flipX ? -1 : 1;
      this.movementSpeed = this.speed * 1.1 * dir;
    }
  }

  defend(isDefending) {
    this.state = isDefending ? Enum.SS_DEFEND : Enum.SS_READY;
    this.movementSpeed = isDefending ? 0 : this.movementSpeed;
  }

  //  Viewer functions

  isTweening() {
    return this.scene.tweens.isTweening(this);
  }

  stopTweening() {
    this.scene.tweens.killTweensOf(this);
  }

  flipXTween() {
    
    let hasFlipped = false;
    const duration = 250;

    this.scene.tweens.chain({
      targets: this,
      tweens: [
        {
          scaleX: 0,
          duration: duration,
          ease: 'Power2'
        },
        {
          onActive: () => {
            if (!hasFlipped) {
              const velX = this.body.velocity.x;
              const fX = velX < 0;
              this.setFlipX(fX);
            }
            hasFlipped = true;
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

}