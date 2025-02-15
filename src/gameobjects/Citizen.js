import CitizenBattle from "../ai/CitizenBattle";
import CitizenCaptive from "../ai/CitizenCaptive";
import CitizenController from "../ai/CitizenController";
import CitizenStorm from "../ai/CitizenStorm";
import CitizenView from "../ai/CitizenView";
import CSSClasses from "../const/CSSClasses";
import Enum from "../const/Enum";
import Vars from "../const/Vars";
import SaveData from "../util/SaveData";
import Subtitles from "../util/Subtitles";
import Vfx from "../util/Vfx";
import ControllerMap, { getControllerSaveName } from "../const/ControllerMap";

export default class Citizen extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.physics.add.existing(this);
    this.setOrigin(.5, 1);

    this.prefix = texture;
    this.state = Enum.CS_IDLE;
    this.name = "Citizen";
    this.uid = SaveData.NewUID;

    this.home = Enum.LOC_STORM;
    this.tribe = Enum.TRIBE_STORM;
    this.setData("role", "citizen");

    this.movementSpeed = 40;

    this.controller = new CitizenController().setSprite(this);
    this.viewController = new CitizenView().setSprite(this);
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

  setName(n) {
    this.name = n;
  }

  //  - Physics -

  moveTowards(x) {
    const speed = (x > this.x) ? this.movementSpeed : -this.movementSpeed;
    this.body.velocity.x = speed;
  }

  stopMove() {
    this.body.velocity.x = 0;
  }

  faceX(x) {
    this.setFlipX(x < this.x);
  }

  //  - Animations -

  playIdle() {
    this.play(this.prefix + Vars.ANIM_CIT_IDLE, true);
  }
  playIdleSide() {
    this.play(this.prefix + Vars.ANIM_CIT_IDLE_SIDE, true);
  }
  playIdleBack() {
    this.play(this.prefix + Vars.ANIM_CIT_IDLE_BACK, true);
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
  playCheering() {
    this.play(this.prefix + Vars.ANIM_CIT_CHEERING, true);
  }

  //  - Getters -

  get velocityX() { return this.body.velocity.x }
  get velocityY() { return this.body.velocity.y }

  // - Save Data -

  loadData(data) {

    this.uid = data.uid;

    this.setTexture(data.sheet);
    this.prefix = data.sheet;
    this.x = data.x;

    this.setHome(data.home);
    this.setTribe(data.tribe);

    const ctr = ControllerMap.get(data.controller);
    const controller = new ctr();
    this.setController(controller);

    for (const key in data.data) {
      if (Object.hasOwn(data.data, key)) {
        this.setData(key, data.data[key])
      }
    }
  }

  getSaveData() {
    return {
      uid: this.uid,
      data: this.data.list,
      sheet: this.prefix,
      x: this.x,
      home: this.home,
      tribe: this.tribe,
      address: -1,
      controller: getControllerSaveName(this.controller)
    }
  }
}
