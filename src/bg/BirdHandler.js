import Counter from "../util/Counter";
import Vars from "../util/Vars";

export default class BirdHandler {
  
  constructor(scene, bgLayer, group) {
    this.scene = scene;
    this.layer = bgLayer;
    this.group = group;

    this.greyCounter = new Counter(19000);
    this.brownCounter = new Counter(45000);

    this.isForestArea = true;
  }

  update(_, delta) {
    
    //  Greys only deploy in forests

    let greyDeploy = false;

    if (this.isForestArea) {
      greyDeploy = this.greyCounter.update(delta);
    }

    if (greyDeploy) {
      this.deployGreys();
    }

    //  Browns are constantly deploying

    let isBrownTime = this.brownCounter.update(delta);
    if (isBrownTime) {
      this.deployBrowns();
    }
  }

  resetCounts() {
    this.greyCounter.resetCount();
  }

  /** Deploys brown birds on the left or right of the camera to fly through */
  deployBrowns() {

    const camera = this.scene.cameras.main;
    const amount = Phaser.Math.Between(2, 5);

    const leftToRight = Math.random() > .5;
    const startAdd = leftToRight ? - 64 : camera.width + 32;

    const baseX = camera.scrollX + startAdd;
    const baseY = camera.height * .35;
    const rect = new Phaser.Geom.Rectangle(baseX, baseY, 32, 56);

    for (let i=0; i<amount; i++) {
      
      const sp = rect.getRandomPoint();

      const bird = this.getBirdSprite(sp.x, sp.y);
      bird.playAfterDelay("anim_bird_brown", i * 20);

      let randX = Phaser.Math.Between(128, 144);
      const velX = leftToRight ? randX : -randX;
      const velY = Phaser.Math.Between(-16, -24);

      bird.setFlipX(leftToRight);
      bird.setVelocityX(velX);
      bird.setVelocityY(velY);
    }

  }

  /** Deploy the grey birds anywhere on screen to rise up */
  deployGreys() {

    const camera = this.scene.cameras.main;
    const amount = Phaser.Math.Between(5, 8);

    const baseX = camera.scrollX + Phaser.Math.Between(0, camera.width);
    const baseY = camera.height * .8;
    const rect = new Phaser.Geom.Rectangle(baseX, baseY, 128, 32);

    const baseVelX = 16;
    const baseVelY = -64;

    for (let i=0; i<amount; i++) {
      
      const sp = rect.getRandomPoint();

      const bird = this.getBirdSprite(sp.x, sp.y);
      bird.playAfterDelay("anim_bird_grey", i * 30);

      const flip = Math.random() > .5;
      const velX = baseVelX + Phaser.Math.Between(0, 24);
      const velY = baseVelY - Phaser.Math.Between(0, 24);
      
      bird.setFlipX(flip);
      bird.setVelocityX(velX);
      bird.setVelocityY(velY);
    }

  }

  /** Get sprite that uses the bird sheet for bird animations */
  getBirdSprite(x, y) {
    
    const grey = this.scene.physics.add.sprite(x, y, Vars.SHEET_BIRDS1);
    grey.update = function(t, d) {
      if (this.y < -32) {
        this.destroy();
      }
    }

    this.layer.add(grey);
    this.group.add(grey);
    return grey;
  }
}