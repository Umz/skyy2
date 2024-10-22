

// Action based (Slime Game) sprites 
// 1- Display
// 2- Animate
// 3- Player Controlled
// 4- Action controller

import Vars from "../util/Vars";

export default class Soldier extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    
    this.prefix = texture;  // Prefix for animations

    this.setOrigin(.5, 1);
  }

  //  Viewer functions

  playIdle() {
    this.anims.play(this.prefix + Vars.ANIM_IDLE, true);
  }

}