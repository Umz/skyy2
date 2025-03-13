import Blank from "../ai/Blank";
import SoldierView from "../ai/SoldierView";
import CSSClasses from "../const/CSSClasses";
import Enum from "../const/Enum";
import Sfx from "../const/Sfx";
import Vars from "../const/Vars";
import Juke from "../util/Juke";
import SaveData from "../util/SaveData";
import Subtitles from "../util/Subtitles";
import Vfx from "../util/Vfx";
import ControllerMap, { getControllerSaveName } from "../const/ControllerMap";
import { isSpriteInCameraViewX } from "../util/ActionHelper";

export default class Soldier extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.physics.add.existing(this);

    this.prefix = texture;  // Prefix for animations

    this.movePressed = false;
    this.staticMoveStart = false;
    
    this.controller = new Blank().setSprite(this);
    this.viewController = new SoldierView().setSprite(this);
    this.hitbox = new Phaser.Geom.Rectangle(0,0,1,1);

    this.lastTarget = null;

    this.uid = SaveData.NewUID;
    this.home = Enum.LOC_MAM;

    //  Stats / settings

    this.state = Enum.SS_READY;
    this.team = Enum.TEAM_ENEMY;
    this.sType = -1;  // Soldier Type
    this.speed = 96;  // Use 72-
    this.movementSpeed = 0;
    this.lane = 1;
    this.name = "Soldier";
    this.isShowingIcon = false;

    //  Play stats

    this.maxHP = 3;   // Health Points
    this.maxGP = 2;   // Guard Points
    this.hp = this.maxHP;
    this.gp = this.maxGP;

    this.att = 1;
    this.def = 1;
    this.attBoost = 0;
    this.defBoost = 0;
    
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

    this.staticMoveStart = this.body.velocity.x === 0;
    
    //  Speed updating

    this.body.velocity.x = this.movementSpeed !== 0 ? this.movementSpeed : this.body.velocity.x;

    //  Calculate the slow down

    const velX = this.body.velocity.x;
    if (velX !== 0 && this.movementSpeed === 0) {
      const minus = delta * this.speed * .001 * Math.sign(velX);
      const newVelocity = velX - (2 * minus);
      this.body.velocity.x = Math.abs(newVelocity) < 4 ? 0 : newVelocity;
    }

    //  Min Max position

    Phaser.Math.Clamp(this.x, this.width, Vars.AREA_WIDTH * 8 - this.width);

    //  State updating
    
    if (this.isState(Enum.SS_REBOUND) || this.isState(Enum.SS_REPELLED) || this.isState(Enum.SS_HURT)) {
      this.movementSpeed = 0;
      if (velX === 0) {
        this.state = Enum.SS_READY;
      }
    }
    
    //  View updating

    this.controller.update(time, delta);
    this.viewController.update(time, delta);
    
    this.movePressed = false;
  }

  //  Stat adjustment --------------------------------------------------------

  setHP(activeHP, max = 0) {
    this.hp = activeHP;
    this.maxHP = max > 0 ? max : this.maxHP;
  }

  setGP(activeGP, max = 0) {
    this.gp = activeGP;
    this.maxGP = max > 0 ? max : this.maxGP;
  }

  getHPPercent() {
    return this.hp / this.maxHP;
  }

  getGPPercent() {
    return this.gp / this.maxGP;
  }

  boostAttack(amt) {
    this.attBoost = amt;
    Vfx.ShowAnimatedFollow(this, Vars.VFX_TELEPORT2);
  }

  reduceBoostAttack(amt) {
    this.attBoost = Math.max(0, this.attBoost - amt);
    if (this.attBoost === 0) {
      Vfx.DestroyFX(this);
    }
  }

  isBoosted() {
    return this.attBoost > 0;
  }

  boostDefense(amt) {
    this.defBoost = amt;
  }

  //  Battle functions   ------------------------------------------------------------

  isAlive() {
    return this.hp > 0;
  }

  isDead() {
    return this.hp <= 0;
  }

  // attack, defend, block, rebound, recoil#

  recoverHP(amt) {
    this.hp = Math.min(this.maxHP, this.hp + amt);
  }

  guard() {
    this.gp = Math.max(0, this.gp - 1);
  }

  hasGP() {
    return this.gp > 0;
  }

  recoverGP(amt) {
    this.gp = Math.min(this.maxGP, this.gp + amt);
  }

  //  ---------------------------------------------------------------------
  
  setDisplayName(name, team, depth = 1) {

    this.displayName?.destroy(true);

    const json = this.scene.cache.json.get('hud_html');
    const css = CSSClasses.get(team);
    const template = json.display_name;

    let html = template.replace("_class_", css);
    html = html.replace("_name_", name);
    
    this.displayName = this.scene.add.dom(0, 0).createFromHTML(html).setOrigin(.5, .8).setDepth(depth);
    this.name = name;
  }

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

  //  ---------------------------------------------------------------------

  setController(ctrl) {
    this.controller = ctrl;
    this.controller.setSprite(this);
  }

  setTeam(en) {
    this.team = en;
  }

  setType(t) {
    this.sType = t;
  }

  isAlly() {
    return this.team === Enum.TEAM_ALLY;
  }

  isEnemy() {
    return this.team === Enum.TEAM_ENEMY;
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
    this.rebound_calc(intensity);
    this.state = Enum.SS_REPELLED;
  }

  rebound(intensity = 1) {
    this.rebound_calc(intensity);
    this.state = Enum.SS_REBOUND;
  }

  /** Move and rename- just the math for recoil */
  rebound_calc(intensity = 1) {
    const vX = this.body.velocity.x;
    const recoilSpeed = vX > 0 ? -this.getSpeed() : this.getSpeed();
    this.movementSpeed = recoilSpeed * (intensity);
  }

  kickback(intensity, pX) {
    const speed = pX > this.x ? -this.speed : this.speed;
    this.body.velocity.x = speed * (intensity);
  }

  hit(attacker) {

    if (!this.isState(Enum.SS_HURT)) {
      const damage = attacker.isBoosted() ? 4 : 1;
      this.hp = Math.max(0, this.hp - damage);
      this.isDefending = false;
      if (this.hp === 0) {
        if (isSpriteInCameraViewX(this)) {
          Juke.PlaySound(Sfx.DIE1);
        }
        this.stopTweening();
        this.destroy(true);
        if (this.displayName) {
          this.displayName.destroy(true);
        }
        return true;
      }
    }

    // only do damage if not already HURT state- no double hits
    this.state = Enum.SS_HURT;
    this.movementSpeed = (attacker.x > this.x) ? -this.getSpeed() : this.getSpeed();
    if (isSpriteInCameraViewX(this)) {
      Juke.PlaySound(Sfx.HIT1);
    }

    return false;
  }

  towardsLane(lane) {
    if (this.lane < lane) {
      this.moveDown();
    }
    else if (this.lane > lane) {
      this.moveUp();
    }
  }

  kill() {
    this.stopTweening();
    if (this.displayName) {
      this.displayName.destroy(true);
    }
    this.destroy(true);
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

  updateLaneY() {
    const laneY = Vars.GROUND_TOP + 1 + this.lane;
    this.setY(laneY);
  }

  //  Controller functions
  //  Add in a backstep with animation

  moveDirection(direction) {

    const moveSpeed = this.isTweening() ? this.getSpeed() * 0.75 : this.getSpeed();
    const adjustedSpeed = direction * moveSpeed;
    const velX = this.velocityX;
  
    if (this.isState(Enum.SS_READY)) {
      this.movementSpeed = adjustedSpeed;
    } else if (this.isState(Enum.SS_DEFEND) && velX === 0 && ((direction === -1 && !this.flipX) || (direction === 1 && this.flipX))) {
      this.body.velocity.x = adjustedSpeed * 1.3;
      this.showMovementDust();
      if (isSpriteInCameraViewX(this)) {
        Juke.PlaySound(Sfx.MOVE);
      }
    }
  
    this.movePressed = true;
  }

  moveLeft() {
    this.moveDirection(-1);
  }

  moveRight() {
    this.moveDirection(1);
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
      if (isSpriteInCameraViewX(this)) {
        Juke.PlaySound(Sfx.MOVE);
      }
    }
  }

  moveDown() {
    if (!this.isTweening() && this.state === Enum.SS_READY) {
      this.lane = Math.min(3, this.lane + 1);
      if (isSpriteInCameraViewX(this)) {
        Juke.PlaySound(Sfx.MOVE);
      }
    }
  }

  attack() {
    if (this.state === Enum.SS_READY) {
      this.state = Enum.SS_ATTACK;
      const dir = this.flipX ? -1 : 1;
      this.movementSpeed = this.speed * 1.1 * dir;
      this.showMovementDust();

      const snd = Phaser.Utils.Array.GetRandom([Sfx.ATTACK1, Sfx.ATTACK2])
      if (isSpriteInCameraViewX(this)) {
        Juke.PlaySound(snd);
      }
    }
  }

  defend(isDefending) {
    if (!this.isState(Enum.SS_HURT)) {

      if (this.state !== Enum.SS_DEFEND && isDefending) {
        if (isSpriteInCameraViewX(this)) {
          Juke.PlaySound(Sfx.BLOCK_ACTION);
        }
      }

      this.state = isDefending ? Enum.SS_DEFEND : Enum.SS_READY;
      this.movementSpeed = isDefending ? 0 : this.movementSpeed;
    }
  }

  idle() {
    this.state = Enum.SS_READY;
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
    return !this.isTweening() && ((isRight && !this.flipX) || (!isRight && this.flipX));
  }

  flipXTween(flipDirection = 0) {
    
    const duration = 100;
    this.scene.tweens.add({
      targets: this,
      duration: duration,
      scaleX: .2,
      ease: 'Power2',
      onComplete: ()=>{
        const velX = this.body.velocity.x;
        const flipX = flipDirection === 0 ? velX < 0 : flipDirection < 0;
        this.setFlipX(flipX);
      }
    });
    this.scene.tweens.add({
      targets: this,
      duration: duration,
      scaleX: 1,
      delay: duration,
      ease: 'Power2'
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

  //  Animations    ---------------------------------------------------------------------

  changeTexture(texture) {
    this.prefix = texture;
    this.setTexture(texture);
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

  //  Action Manager Setters and Getters

  set target(tar) {
    this.lastTarget = tar;
  }

  get target() {
    const action = this.controller.getCurrentAction();
    return this.lastTarget || action?.target;
  }

  //  Setters and Getters   -----------------------------------------------------------------

  get velocityX() {
    return this.body.velocity.x;
  }

  get velocityY() {
    return this.body.velocity.y;
  }

  //  - Save Data -

  loadData(data) {

    for (const key in data.data) {
      if (Object.hasOwn(data.data, key)) {
        this.setData(key, data.data[key])
      }
    }

    this.setTexture(data.prefix);
    this.setHP(data.hp, data.hp);
    this.setGP(data.gp, data.gp);
    
    const ctr = ControllerMap.get(data.ctr);
    this.setController(new ctr());
    
    if (data.name !== "Soldier") {
      this.setDisplayName(data.name, Enum.TEAM_ALLY);
      this.setDepth(2);
    }

    this.uid = data.uid;
    this.prefix = data.prefix;
    this.x = data.x;
    this.state = data.state;
    this.team = data.team;
    this.sType = data.sType;
    this.speed = data.speed;
    this.lane = data.lane;
    this.home = data.home;
  }

  getSaveData() {
    return {

      uid: this.uid,
      prefix: this.prefix,
      x: this.x,

      state: this.state,
      team: this.team,
      sType: this.sType,

      speed: this.speed,
      hp: this.maxHP,
      gp: this.maxGP,

      lane: this.lane,
      home: this.home,
      name: this.name,

      ctr: getControllerSaveName(this.controller)
    }
  }
  
}
