import CitizenController from "../ai/CitizenController";
import CitizenView from "../ai/CitizenView";
import CSSClasses from "../const/CSSClasses";
import Enum from "../const/Enum";
import Vars from "../const/Vars";
import Subtitles from "../util/Subtitles";
import Vfx from "../util/Vfx";

export default class Citizen extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.physics.add.existing(this);
    this.setOrigin(.5, 1);

    this.prefix = texture;  // Prefix for animations
    this.state = Enum.CS_IDLE;

    this.movementSpeed = 48;

    this.controller = new CitizenController().setSprite(this);
    this.viewController = new CitizenView().setSprite(this);
  }

  update(time, delta) {
    this.controller.update(time, delta);
    this.viewController.update(time, delta);
  }

  //  - Physics -

  moveTowards(x) {
    const speed = (x > this.x) ? this.movementSpeed : -this.movementSpeed;
    this.body.velocity.x = speed;
  }

  stopMove() {
    this.body.velocity.x = 0;
  }

  //  - Animations -

  playIdle() {
    this.play(this.prefix + Vars.ANIM_CIT_IDLE, true);
  }
  playIdleSide() {
    this.play(this.prefix + Vars.ANIM_CIT_IDLE_SIDE, true);
  }
  playWalk() {
    this.play(this.prefix + Vars.ANIM_CIT_WALK, true);
  }
  playBow() {
    this.play(this.prefix + Vars.ANIM_CIT_BOW, true);
  }
  playDigging() {
    this.play(this.prefix + Vars.ANIM_CIT_DIGGING, true);
  }

  //  - Getters -

  get velocityX() { return this.body.velocity.x }
  get velocityY() { return this.body.velocity.y }
}
