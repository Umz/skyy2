import { Scene } from "phaser";
import TilemapBuilder from "../bg/TilemapBuilder";
import Scenery from "../bg/Scenery";
import VillageBuilder from "../bg/VillageBuilder";
import MapBuilder from "../bg/MapBuilder";

export class PlayScene extends Scene {

  constructor() {
    super("PlayScene");
  }

  create() {

    //  Set world size
    const camera = this.cameras.main;
    const width = 1920;
    camera.setBounds(0, 0, width, camera.height);
    camera.centerOn(width * .5, camera.height / 2);

    //  Groups and layers

    const allGroup = this.add.group({
      runChildUpdate: true
    });

    const sceneryLayer = this.add.layer();
    const tilemapLayer = this.add.layer();

    const bgLayer = this.add.layer();
    const buildingsLayer = this.add.layer();
    const fgLayer = this.add.layer();

    // Background scene

    const scenery = new Scenery(this);
    scenery.addFullScene(sceneryLayer, allGroup);

    //  Tilemap

    const tmBuilder = new TilemapBuilder(this);
    tmBuilder.buildTilemap(tilemapLayer);

    //  Add bushes + fruit trees + veg in FG
    
    //  Add trees in BG

    const mapBuilder = new MapBuilder(this);
    mapBuilder.loadMaM(bgLayer, fgLayer);

    //  Villages

    const builder1 = new VillageBuilder(this);
    builder1.loadMaM(buildingsLayer);
    //builder1.loadGreen(buildingsLayer);
    //builder1.loadStorm(buildingsLayer);

    //  Temp

    this.camMoveX = 0;
    
    this.input.keyboard.on('keydown-RIGHT', (event) => { this.camMoveX = 1 });
    this.input.keyboard.on('keydown-LEFT', (event) => { this.camMoveX = -1 });

    this.input.keyboard.on('keyup-RIGHT', (event) => { this.camMoveX = 0 });
    this.input.keyboard.on('keyup-LEFT', (event) => { this.camMoveX = 0 });
  }

  update(time, delta) {
    this.cameras.main.scrollX += this.camMoveX;
  }
}
