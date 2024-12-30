import Vars from "../const/Vars";

export default class Rock extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y) {
    super(scene, x, y, "atlas", "rock_purple");
    this.lane = 1;
    this.setOrigin(.5, 1);
  }

  update(t, delta) {
    const player = this.scene.player;
    if (player) {
      //const alpha = this.lane === player.lane ? 1 : 1;
      //this.setAlpha(alpha);
    }
  }

  /** Sets the lane, and by extension, Y and depth */
  setLane(lane) {
    this.lane = lane;
    this.setY(Vars.GROUND_TOP + lane + 1);
    this.setDepth(lane * 10);
  }
}