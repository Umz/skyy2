import Phaser from 'phaser';

export default class PauseScene extends Phaser.Scene {
  
  constructor() {
    super('PauseScene');
  }

  create() {

    this.showMenuDOM();
    
    this.input.keyboard.on('keydown-P', () => {
      
      this.hideMenuDOM();

      this.scene.resume('PlayScene');
      this.scene.stop('PauseScene');
    });

    this.input.keyboard.on('keydown-M', () => {

      this.hideMenuDOM();

      this.scene.stop('PlayScene');
      this.scene.start('MenuScene');
    });
  }

  showMenuDOM() {
    const menuContainer = document.getElementById("pause-container");
    menuContainer.style.display = 'flex';
  }

  hideMenuDOM() {
    const menuContainer = document.getElementById("pause-container");
    menuContainer.style.display = 'none';
  }
}