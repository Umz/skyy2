import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Sfx from "../const/Sfx";
import Vars from "../const/Vars";
import Juke from "../util/Juke";

export default class Collectible extends Phaser.Physics.Arcade.Image {

  constructor(scene, x, type) {
    super(scene, x, 0, Vars.VFX_COLLECT_SHEET, getFrame(type));

    this.lane = 0;
    this.isCollected = false;
    this.type = type;

    this.setOrigin(.5, 1);
    this.postFX.addGlow(0xffffff, 2, 1, false, 0.5, 4);
  }

  update(t, delta) {
    const player = this.scene.player;
    if (player) {
      const alpha = this.lane === player.lane ? 1 : .2;
      this.setAlpha(alpha);
    }
  }

  /** Initialise this collectible item with bounce tween */
  initCollectible(lane) {

    const floorY = Vars.GROUND_TOP + 1;

    this.lane = lane;
    this.setY(floorY + lane);
    this.setDepth(lane * 10 + 1);

    this.setBounceTween();
  }

  /** Collect this item and destroy it after collected */
  collectAndDestroy() {
    
    if (!this.isCollected) {

      this.showCollectTween();

      this.body.checkCollision.none = true;   // Disable collisions
      this.isCollected = true;
    }
  }

  /** Bounce and flash */
  setBounceTween() {
    let count = 0;
    this.scene.add.tween({
      targets: this,
      duration: 500,
      y: {from:this.y + 2, to: this.y - 4},
      scaleX: {from:1, to:0},
      repeat: -1,
      yoyo: true,
      onYoyo: ()=>{
        if (count % 2 === 0) {
          this.setFlipX(!this.flipX);
        }
        count ++;
      }
    });
  }

  /** Show collection tween */
  showCollectTween() {

    this.scene.tweens.killTweensOf(this);
    this.scene.add.tween({
      targets: this,
      duration: 1750,
      ease: "Power2",
      scaleX: {from:1, to:0},
      scaleY: {from:1, to:2},
      alpha: {from:1, to:0},
      onComplete: ()=>{
        this.destroy();
      }
    });

    Juke.PlaySound(this.getCollectSound());
  }

  getCollectSound() {
    switch (this.type) {
      case Enum.COLLECT_HEART: return Sfx.HEAL;
      case Enum.COLLECT_POWER: return Sfx.ATTACK_BOOST;
      case Enum.COLLECT_DEFENSE: return Sfx.DEFENDED;
      case Enum.COLLECT_SPEED: return true;
      case Enum.COLLECT_TROOPS: return true;
    }
  }
}

function getFrame(type) {
  switch (type) {
    case Enum.COLLECT_HEART: return Icon.HEART;
    case Enum.COLLECT_POWER: return Icon.POWER_SHINE;
    case Enum.COLLECT_DEFENSE: return Icon.SHIELDED_REFLECT;
    case Enum.COLLECT_SPEED: return true;
    case Enum.COLLECT_TROOPS: return true;
  }
}