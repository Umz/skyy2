import Vars from "../util/Vars";

export default class AnimalHandler {

  constructor(scene, layer, group) {
    this.scene = scene;
    this.layer = layer;
    this.group = group;
  }

  deployDoes() {

    const camera = this.scene.cameras.main;
    const amount = Phaser.Math.Between(3, 6);

    const baseX = camera.scrollX + camera.width * .5;
    const flipX = Math.random() > .5;
    const mul = flipX ? -1 : 1;

    for (let i=0; i<amount; i++) {
    
      let doe = this.getDoe(baseX + Phaser.Math.Between(-24, 24), Vars.GROUND_TOP + 1);
      let anims = ["doe1", "doe2", "doe3"];
      let animation = Phaser.Utils.Array.GetRandom(anims);
      doe.playAfterDelay(animation, i * 10);
      doe.setFlipX(flipX);

      this.scene.tweens.add({
        targets: doe,
        duration: 250,
        alpha: {from:0, to:1},
        onComplete: ()=>{
          const velX = Phaser.Math.Between(128, 160) * mul;
          doe.setVelocityX(velX);
        }
      })
    }
  }

  getDoe(x, y) {

    const animal = this.scene.physics.add.sprite(x, y, "doe_test");
    const camera = this.scene.cameras.main;
    animal.setOrigin(.5, 1);

    let ttl = 5 * 1000;

    animal.update = function(t,d) {
      ttl -= d;
      if (ttl < 0 && !camera.worldView.contains(this.x, this.y)) {
        this.destroy();
      }
    }

    this.layer.add(animal);
    this.group.add(animal);
    return animal;
  }

}