class Scenery {

  constructor(scene) {
    this.scene = scene;
    this.sprites = [];
  }

  addBGLayer(frame, scroll, speed) {

    const camera = this.scene.cameras.main;
    const x = 0;
    const y = camera.height;

    const sprite = this.scene.add.tileSprite(x, y, camera.width * 1.15, 216, frame).setOrigin(0, 1);
    sprite.setScrollFactor(0);  // Stick to the camera
    sprite._scrollFactor = (scroll * .15);
    sprite._autoScroll = 0;

    sprite.update = function(n, delta) {
      //this.tilePositionX = camera.scrollX * this._scrollFactor + this._autoScroll;
      //this._autoScroll += speed * .001 * delta;
      //this.tilePositionX += speed * .001 * delta;
      if (scroll == .35) {
        //console.log(this.tilePositionX)
      }
    }

    this.sprites.push(sprite);

    return sprite;
  }

  addFullScene(layer, group) {

    this.addBGLayer('bg_sky', 0, 0);
    this.addBGLayer('bg_range', .15, 0);
    this.addBGLayer('bg_mountains', .25, 0);

    this.addBGLayer('bg_clouds_mid', .35, 8);

    this.addBGLayer('bg_clouds_front', .45, 20);
    this.addBGLayer('bg_clouds_front_t', .45, 14);

    layer.add(this.sprites);
    group.addMultiple(this.sprites);
  }
}
export default Scenery;