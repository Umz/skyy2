import { Scene } from "phaser";
import TilemapBuilder from "../bg/TilemapBuilder";

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


    //  Tilemap

    const bg_tilemap = this.add.layer();
    const tmBuilder = new TilemapBuilder(this);
    tmBuilder.buildTilemap(bg_tilemap);

  }
}
