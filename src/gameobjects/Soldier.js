
// Action based (Slime Game) sprites 
// 3- Player Controlled
// 4- Action controller

import Vars from "../util/Vars";

export default class Soldier extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    
    this.prefix = texture;  // Prefix for animations

    this.speed = 48;

    this.setOrigin(.5, 1);
  }

  update(time, delta) {

    //  View updating

    const velX = this.body.velocity.x;
   
    if (velX !== 0) {
      this.playRun();

      if (!this.flipX && velX < 0) {
        this.setFlipX(true);
      }
      else if (this.flipX && velX > 0) {
        this.setFlipX(false);
      }
    }
    else {
      this.playIdle();
    }
    
  }

  //  Controller functions

  moveLeft() {
    this.body.velocity.x = -this.speed;
  }

  moveRight() {
    this.body.velocity.x = this.speed;
  }

  moveUp() {}

  moveDown() {
    this.body.velocity.x = 0;
  }

  attack() {}
  defend() {}

  //  Viewer functions

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