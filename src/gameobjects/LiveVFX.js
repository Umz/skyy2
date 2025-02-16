export default class LiveVFX extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, sheet) {
    super(scene, x, y, sheet);
    this.setOrigin(.5, 1);
    scene.add.existing(this);

    this.on('animationcomplete', function () {
      this.destroy();
    }, this);
  }

  update() {
    const target = this.sprite;
    const lane = target.lane;
    const tc = target.getBottomCenter();
    const tX = target.flipX ? tc.x + 6 : tc.x - 6;

    this.setPosition(tX, tc.y);
    this.setDepth(lane * 10 + 1);
  }

  setSprite(sprite) {
    this.sprite = sprite;
    this.setDepth(sprite.lane * 10 + 5);
  }

}