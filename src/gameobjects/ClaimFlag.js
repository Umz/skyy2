import Vars from "../const/Vars";

export default class ClaimFlag extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x) {
    super(scene, x, Vars.GROUND_TOP, Vars.SHEET_ALL_BANNERS, 0);
    this.setOrigin(.5, 1).setAlpha(.3);

    scene.physics.add.existing(this);
    scene.allGroup.add(this);
    scene.groupClaimFlags.add(this);

    scene.fgLayer.add(this);
    scene.shadows.createStaticShadowLines(scene.buildingsLayer, scene.bgLayer, scene.fgLayer);

    this.baseX = x;
  }

  update(_, delta) {

    const camera = this.scene.cameras.main;
    const view = camera.worldView;
    const gap = 24, dist = 16, baseX = this.baseX;

    if (view.left > baseX + dist) {
      this.setPosition(view.left + gap, view.centerY + gap * 2);
      this.setTweening();
    }
    else if (view.right < baseX - dist) {
      this.setPosition(view.right - gap, view.centerY + gap * 2);
      this.setTweening();
    }
    else {
      this.stopTweening();
      this.setPosition(baseX, Vars.GROUND_TOP);
    }
  }

  setTweening() {
    const tweens = this.scene.tweens;
    if (!tweens.isTweening(this)) {
      tweens.add({
        targets: this,
        duration: 750,
        scale: {from: 1, to: .5},
        yoyo: true,
        repeat: -1,
        ease: Phaser.Math.Easing.Quadratic.In
      });
      this.setOrigin(.5);
    }
  }

  stopTweening() {
    const tweens = this.scene.tweens;
    if (tweens.isTweening(this)) {
      tweens.killTweensOf(this);
      this.setScale(1);
      this.setOrigin(.5, 1);
    }
  }

}
