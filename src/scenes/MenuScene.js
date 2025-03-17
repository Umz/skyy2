import Phaser from 'phaser';
import SaveData from '../util/SaveData';
import Scenery from '../bg/Scenery';
import TilemapBuilder from '../bg/TilemapBuilder';
import MapBuilder from '../bg/MapBuilder';

export default class MenuScene extends Phaser.Scene {
  
  constructor() {
    super('MenuScene');
  }
  
  preload() {
    this.isMenuShowing = false;
    this.isShowingClearData = false;
    SaveData.PRELOAD(this.isMenuShowing);
  }

  create() {

    const camera = this.cameras.main;
    camera.setBounds(0, 0, 960, 240);
    camera.centerOnX(320);

    this.allGroup = this.add.group({runChildUpdate: true});

    this.sceneryLayer = this.add.layer();
    this.tilemapLayer = this.add.layer();

    this.shadowLayer = this.add.layer();
    this.bgLayer = this.add.layer();
    this.buildingsLayer = this.add.layer();
    this.animalLayer = this.add.layer();
    this.fgLayer = this.add.layer();
    
    this.scenery = new Scenery(this);     // Background scenery
    this.tilemapBuilder = new TilemapBuilder(this, this.tilemapLayer);    // Tilemap builder (ground tiles)
    this.mapBuilder = new MapBuilder(this);   // Map builder (trees, locations)
    this.mapBuilder.setLayers({bgLayer:this.bgLayer, fgLayer:this.fgLayer, buildingsLayer:this.buildingsLayer});

    this.scenery.addFullScene(this.sceneryLayer, this.allGroup);
    this.tilemapBuilder.buildTilemapForArea(50);
    this.mapBuilder.buildMapForArea(50);

    //  - Menu Buttons -

    this.input.keyboard.on('keydown-Z', () => {
      if (this.isMenuShowing) {
        this.hideMenuDOM();
        this.scene.start('PlayScene');
      }
    });

    this.input.keyboard.on('keydown-C', () => {
      if (this.isMenuShowing) {
        this.showClearData();
      }
    });

    this.input.keyboard.on('keydown-Y', () => {
      if (this.isShowingClearData) {
        SaveData.DELETE_SAVE();
        this.hideClearData();
        this.showDeleteNotification();
      }
    });

    this.input.keyboard.on('keydown-N', () => {
      if (this.isShowingClearData) {
        this.hideClearData();
        this.isShowingClearData = false;
      }
    });

  }

  update(time, delta) {
    if (!this.isMenuShowing && SaveData.isLoaded) {
      this.showMenuDOM();
      this.isMenuShowing = true;
    }
  }

  showMenuDOM() {
    const menuContainer = document.getElementById("main-menu-container");
    menuContainer.style.display = 'flex';
  }

  hideMenuDOM() {
    const menuContainer = document.getElementById("main-menu-container");
    menuContainer.style.display = 'none';
  }

  showClearData() {
    const menuContainer = document.getElementById("clear-data-confirm-container");
    menuContainer.style.display = 'flex';
    this.isShowingClearData = true;
  }

  hideClearData() {
    const menuContainer = document.getElementById("clear-data-confirm-container");
    menuContainer.style.display = 'none';
    this.isShowingClearData = false;
  }

  showDeleteNotification() {
    const notification = document.getElementById('notification');
    notification.innerText = "Data has been cleared";
    notification.style.display = 'block';
    setTimeout(function() {
      notification.style.display = 'none';
    }, 2000);
  }
}
