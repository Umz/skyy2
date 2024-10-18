/**
 * Base Builder contains the shared logic for adding buildings, trees, environment, etc
 * to the scene on top of the floating island
 * @param scene Scene to add the sprites to
 */
export default class BaseBuilder {

  constructor(scene) {
    this.scene = scene;
  }

  add(x, laneY, frame) {
    const {scene} = this;
    const image = scene.add.image(x, laneY, 'atlas', frame).setOrigin(0, 1);
    return image;
  }

  addAnimated(x, laneY, spritesheet, animation) {
    const {scene} = this;
    const sprite = scene.add.sprite(x, laneY, spritesheet).setOrigin(0, 1);
    sprite.anims.play(animation);
    return sprite;
  }

  getBounds() {
    const camera = this.scene.cameras.main;
    const bounds = camera.getBounds();
    return bounds;
  }

  getCenterX() {
    const bounds = this.getBounds();
    return bounds.centerX;
  }
}