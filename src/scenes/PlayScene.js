import { Scene } from "phaser";
import TilemapBuilder from "../bg/TilemapBuilder";
import Scenery from "../bg/Scenery";

export class PlayScene extends Scene {

  constructor() {
    super("PlayScene");
  }

  create() {

    //  Set world size
    const camera = this.cameras.main;
    const width = 1280;
    camera.setBounds(0, 0, width, camera.height);
    camera.centerOn(width * .5, camera.height / 2);

    //  Groups and layers

    const allGroup = this.add.group({
      runChildUpdate: true
    });
    const allLayer = this.add.layer();

    // Background scene

    const scenery = new Scenery(this);
    scenery.addFullScene(allLayer, allGroup);

    //  Tilemap

    const bg_tilemap = this.add.layer();
    const tmBuilder = new TilemapBuilder(this);
    tmBuilder.buildTilemap(bg_tilemap);

    //  Add trees in BG
    //  Add bushes + fruit trees + veg in FG

    //  Add some buildings
    //  TexturePacker - Buildings
    //  JSON layout file

    let sprite = this.add.sprite(width * .5, 207, 'base');
    sprite.setOrigin(.5, 1);

  }
}
