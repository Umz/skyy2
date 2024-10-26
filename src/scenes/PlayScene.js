import { Scene } from "phaser";
import TilemapBuilder from "../bg/TilemapBuilder";
import Scenery from "../bg/Scenery";
import MapBuilder from "../bg/MapBuilder";
import Shadows from "../bg/Shadows";
import Soldier from "../gameobjects/Soldier";
import Vars from "../util/Vars";
import KeyboardMapper from "../util/KeyboardMapper";
import ControlKeys from "../util/ControlKeys";
import SpriteController from "../util/SpriteController";

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
    this.group_soldiers = this.add.group({runChildUpdate:true});

    const sceneryLayer = this.add.layer();
    const tilemapLayer = this.add.layer();

    const shadowLayer = this.add.layer();
    const bgLayer = this.add.layer();
    const buildingsLayer = this.add.layer();
    const fgLayer = this.add.layer();

    this.lane_1 = this.add.layer().setDepth(10);
    this.lane_2 = this.add.layer().setDepth(20);
    this.lane_3 = this.add.layer().setDepth(30);

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
    this.physics.add.existing(player);

    this.lane_1.add(player);
    this.group_soldiers.add(player);

    camera.startFollow(player, true, .8);

    //  Move about in world
    //  Next branch >
    //  Load world dynamically as character goes to edge of screen-

    //  Setup the Shadows
    // Add dynamic shadows

    const shadows = new Shadows();

    shadows.createStaticShadowLines(buildingsLayer, bgLayer, fgLayer);
    shadows.addGraphics(graphics);
    shadowLayer.add(graphics);
    shadows.drawShadows(graphics);

    //  Controller

    const controllerKeys = new ControlKeys();
    const keyMapper = new KeyboardMapper(this);
    keyMapper.registerKeyboard(controllerKeys);
    
    this.controller = new SpriteController(player, controllerKeys);

    //  Temp

    this.camMoveX = 0;
    
    this.input.keyboard.on('keydown-RIGHT', (event) => { this.camMoveX = 1 });
    this.input.keyboard.on('keydown-LEFT', (event) => { this.camMoveX = -1 });

    this.input.keyboard.on('keyup-RIGHT', (event) => { this.camMoveX = 0 });
    this.input.keyboard.on('keyup-LEFT', (event) => { this.camMoveX = 0 });
  }

  update(time, delta) {

    //  Updating sprite lane  -----------------------------

    const allSprites = this.group_soldiers.getChildren();
    for (let sprite of allSprites) {
      
      const lane = sprite.lane;
      const layer = sprite.displayList;

      if (lane === 1 && layer !== this.lane_1) {
        this.lane_1.add(sprite);
        sprite.laneSwitchTween();
      }
      else if (lane === 2 && layer !== this.lane_2) {
        this.lane_2.add(sprite);
        sprite.laneSwitchTween();
      }
      else if (lane === 3 && layer !== this.lane_3) {
        this.lane_3.add(sprite);
        sprite.laneSwitchTween();
      }

      const bottomLaneY = Vars.GROUND_TOP + 1;
      const laneY = bottomLaneY + sprite.lane;
      sprite.setY(laneY);
    }

    //  Shadow updating   --------------------------------

    this.controller.update();   // Player Controller
  }
}
