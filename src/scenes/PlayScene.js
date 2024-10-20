import { Scene } from "phaser";
import TilemapBuilder from "../bg/TilemapBuilder";
import Scenery from "../bg/Scenery";
import MapBuilder from "../bg/MapBuilder";
import Shadows from "../bg/Shadows";

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

    const graphics = this.add.graphics();

    //  Groups and layers

    const allGroup = this.add.group({
      runChildUpdate: true
    });

    const sceneryLayer = this.add.layer();
    const tilemapLayer = this.add.layer();

    const shadowLayer = this.add.layer();
    const bgLayer = this.add.layer();
    const buildingsLayer = this.add.layer();
    const fgLayer = this.add.layer();

    // Background scene

    const scenery = new Scenery(this);
    scenery.addFullScene(sceneryLayer, allGroup);

    //  Tilemap

    const tmBuilder = new TilemapBuilder(this);
    tmBuilder.buildTilemap(tilemapLayer);

    //  Add trees in BG

    const mapBuilder = new MapBuilder(this);
    mapBuilder.setLayers({bgLayer, fgLayer, buildingsLayer});
    
    //mapBuilder.loadMaM();   // Load full village
    //mapBuilder.loadBigForest("greenleaf");
    mapBuilder.loadLocation("mines");

    //  Setup the Shadows

    const shadows = new Shadows();

    shadows.createStaticShadowLines(buildingsLayer, bgLayer, fgLayer);
    shadows.addGraphics(graphics);
    shadowLayer.add(graphics);
    shadows.drawShadows(graphics);

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
