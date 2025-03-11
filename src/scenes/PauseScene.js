import Phaser from 'phaser';

export default class PauseScene extends Phaser.Scene {
  constructor() {
    super('PauseScene');
  }

  create() {

    const pauseContainer = document.getElementById('pause-container');
    pauseContainer.style.display = 'flex';
    
    this.input.keyboard.on('keydown-P', () => {
      pauseContainer.style.display = 'none';
      this.scene.resume('PlayScene');
      this.scene.stop('PauseScene');
    });

    this.input.keyboard.on('keydown-M', () => {
      this.scene.start('MainMenuScene');
    });
  }
}