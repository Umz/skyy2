import { Scene } from "phaser";
import TilemapBuilder from "../bg/TilemapBuilder";
import Scenery from "../bg/Scenery";
import VillageBuilder from "../bg/VillageBuilder";

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
    const buildingsLayer = this.add.layer();

    // Background scene

    const scenery = new Scenery(this);
    scenery.addFullScene(sceneryLayer, allGroup);

    //  Tilemap

    const tmBuilder = new TilemapBuilder(this);
    tmBuilder.buildTilemap(tilemapLayer);

    //  Add trees in BG
    //  Add bushes + fruit trees + veg in FG

    //  Add some buildings
    //  TexturePacker - Buildings
    //  JSON layout file

    const builder1 = new VillageBuilder(this);
    builder1.loadMaM(buildingsLayer);

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
