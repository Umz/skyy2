import Enum from "../util/Enum";
import Vars from "../util/Vars";

export default class Collectible extends Phaser.Physics.Arcade.Image {

  constructor(scene, x, y, frame) {
    super(scene, x, y, "atlas", frame);

    this.lane = 1;
    this.isCollected = false;
    this.setOrigin(.5, 1);
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
    this.scene.add.tween({
      targets: this,
      duration: 750,
      ease: "Power2",
      repeat: -1,
      yoyo: true,
      y: {from:this.y, to: this.y - 4},
      alpha: {from:.3, to:1},
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

  }
}