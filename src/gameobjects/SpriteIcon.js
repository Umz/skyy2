import Vars from "../const/Vars";

export default class SpriteIcon extends Phaser.GameObjects.Image {
  
  constructor(scene, x, y, frame) {
    super(scene, x, y, Vars.VFX_SPEECH_SHEET, frame);
    scene.add.existing(this);

    this.setOrigin(.5, 1);
  }

  update(_, delta) {
    this.ttl = Math.max(0, this.ttl - delta);
    if (this.ttl === 0 || !this.sprite) {
      this.hide();
    }
    else {
      const pos = this.sprite.getTopCenter();
      this.setPosition(pos.x, pos.y);
      this.setDepth(this.sprite.lane * 10 + 3);
    }
  }

  show(sprite, ttl) {

    this.scene.tweens.add({
      targets: this,
      duration: 500,
      scaleY: {start:0, to:1},
      ease: Phaser.Math.Easing.Back.Out
    })

    this.sprite = sprite;
    this.ttl = ttl;
    sprite.isSpeech = true;
  }

  hide() {
    this.scene.tweens.add({
      targets: this,
      duration: 500,
      scaleY: {start:1, to:0},
      ease: Phaser.Math.Easing.Back.In,
      onComplete: ()=>{
        this.sprite?.isSpeech = false;
        this.destroy(true);
      }
    })
    this.ttl = 10 * 1000;
  }

  setSprite(sprite) {
    this.sprite = sprite;
  }

  setTTL(ttl) {
    this.ttl = ttl;
  }
}
