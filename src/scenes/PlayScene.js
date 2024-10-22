import { Scene } from "phaser";
import TilemapBuilder from "../bg/TilemapBuilder";
import Scenery from "../bg/Scenery";
import MapBuilder from "../bg/MapBuilder";
import Shadows from "../bg/Shadows";
import Soldier from "../gameobjects/Soldier";
import Vars from "../util/Vars";

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

    const lane_1 = this.add.layer();

    // Background scene

    const scenery = new Scenery(this);
    scenery.addFullScene(sceneryLayer, allGroup);

    //  Tilemap

    const tmBuilder = new TilemapBuilder(this);
    tmBuilder.buildTilemap(tilemapLayer);

    //  Add trees in BG

    const mapBuilder = new MapBuilder(this);
    mapBuilder.setLayers({bgLayer, fgLayer, buildingsLayer});
    mapBuilder.loadMaM();   // Load full village

    // Load Character

    const player = new Soldier(this, width * .5, Vars.GROUND_TOP + 1, Vars.SHEET_PLAYER);
    player.playIdle();

    lane_1.add(player);

    // Move about in world
    
    //  Next branch >
    //  Load world dynamically as character goes to edge of screen-

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
