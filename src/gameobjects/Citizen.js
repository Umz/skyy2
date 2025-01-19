import CitizenCaptive from "../ai/CitizenCaptive";
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

    this.prefix = texture;
    this.state = Enum.CS_IDLE;
    this.name = "Citizen";

    this.home = Enum.LOC_STORM;
    this.tribe = Enum.TRIBE_STORM;

    this.movementSpeed = 48;

    this.controller = new CitizenController().setSprite(this);
    this.viewController = new CitizenView().setSprite(this);

    this.controller = new CitizenCaptive().setSprite(this);
  }

  update(time, delta) {
    this.controller?.update(time, delta);
    this.viewController?.update(time, delta);
  }

  //  -

  kill() {
    this.controller = null;
    this.viewController = null;
    this.destroy(true);
  }

  //  - Dialogue -

  speak(icon, text, ttl = 4000) {
    this.showIcon(icon, ttl);
    this.showDialogue(text, ttl);
  }
  
  showIcon(icon, ttl) {
    Vfx.ShowIcon(this, icon, ttl);
  }
  
  showDialogue(text, ttl) {
    Subtitles.ShowDialogue(this.name, text, ttl);
  }

  //  - Controllers -

  setController(c) {
    this.controller = c;
    this.controller.setSprite(this);
  }

  //  - State -

  setHome(h) {
    this.home = h;
  }

  setTribe(t) {
    this.tribe = t;
  }

  setState(s) {
    this.state = s;
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