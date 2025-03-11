import Phaser from 'phaser';

export default class ScreenshotScene extends Phaser.Scene {
  constructor() {
    super('ScreenshotScene');
  }

  create() {
    /*
    // Get the screenshot of the game
    const screenshot = this.game.canvas.toDataURL();
    // Create a new image object and set its texture to the screenshot
    const screenshotImage = this.add.image(400, 300, 'screenshot');
    screenshotImage.setTexture({ key: 'screenshot', url: screenshot });
    */

    // Add a key listener to resume the game when the 'S' key is pressed
    this.input.keyboard.on('keydown-S', () => {
      this.scene.resume('PlayScene');
      this.scene.stop('ScreenshotScene');
    });
  }
}