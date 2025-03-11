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
    SaveData.PRELOAD(this.isMenuShowing);
  }

  create() {

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
}
