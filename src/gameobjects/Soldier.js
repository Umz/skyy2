
// Action based (Slime Game) sprites 
// 3- Player Controlled
// 4- Action controller

import Vars from "../util/Vars";

export default class Soldier extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    
    this.prefix = texture;  // Prefix for animations

    this.speed = 96;  // Use 72-
    this.isBlocking = false;

    this.setOrigin(.5, 1);
  }

  update(time, delta) {

    const velX = this.body.velocity.x;

    //  Speed updating

    if (velX !== 0) {
      const newVelocity = velX * .95;
      this.body.velocity.x = Math.abs(newVelocity) < 4 ? 0 : newVelocity;
    }

    //  View updating

    // Add a State Check here . Blocking - Attacking -
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
  }

  //  Calculated values

  getSpeed() {
    return this.isBlocking ? 0 : this.speed;
  }

  //  Controller functions

  moveLeft() {
    const moveSpeed = this.isTweening() ? this.getSpeed() * .75 : this.getSpeed();
    this.body.velocity.x = -moveSpeed;
  }

  moveRight() {
    const moveSpeed = this.isTweening() ? this.getSpeed() * .75 : this.getSpeed();
    this.body.velocity.x = moveSpeed;
  }

  moveUp() {}

  moveDown() {
    this.body.velocity.x = 0;
  }

  attack() {
    this.isBlocking = false;
  }

  defend() {
    this.isBlocking = true;
    this.anims.play(this.prefix + Vars.ANIM_DEFEND, true);
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

}