import { Scene } from "phaser";
import TilemapBuilder from "../bg/TilemapBuilder";
import Scenery from "../bg/Scenery";
import MapBuilder from "../bg/MapBuilder";
import Shadow from "../bg/Shadow";
import Soldier from "../gameobjects/Soldier";
import Vars from "../util/Vars";
import KeyboardMapper from "../util/KeyboardMapper";
import ControlKeys from "../util/ControlKeys";
import SpriteController from "../util/SpriteController";
import MapTracker from "../util/MapTracker";

export class PlayScene extends Scene {

  constructor() {
    super("PlayScene");
  }

  create() {

    //  Set world size

    const camera = this.cameras.main;
    const width = 1920;
    //camera.setBounds(0, 0, width, camera.height);
    //camera.centerOn(width * .5, camera.height / 2);

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

    this.bgL = bgLayer;
    this.fgL = fgLayer;
    this.bdL = buildingsLayer;

    this.lane_1 = this.add.layer().setDepth(10);
    this.lane_2 = this.add.layer().setDepth(20);
    this.lane_3 = this.add.layer().setDepth(30);

    //  Utilities

    this.mapTracker = new MapTracker();

    // Background scene

    const scenery = new Scenery(this);
    scenery.addFullScene(sceneryLayer, allGroup);

    //  Tilemap

    const ww = 1920;
    const startX = (ww * 1);

    this.tmBuilder = new TilemapBuilder(this, tilemapLayer);
    this.tmBuilder.buildTilemapForArea(startX);

    //  Add trees in BG

    this.mapBuilder = new MapBuilder(this);
    this.mapBuilder.setLayers({bgLayer, fgLayer, buildingsLayer});
    this.mapBuilder.buildMapForArea(startX);

    // Player Character   --------------------------------------------------------------------------

    const player = new Soldier(this, startX + width * .5, Vars.GROUND_TOP + 1, Vars.SHEET_PLAYER);
    player.playIdle();
    this.physics.add.existing(player);

    this.lane_1.add(player);
    this.group_soldiers.add(player);

    camera.startFollow(player, true, .8);
    this.player = player;

    //  Shadows   -----------------------------------------------------------------------------------

    this.shadows = new Shadow(graphics);
    this.shadows.createStaticShadowLines(buildingsLayer, bgLayer, fgLayer);
    this.shadows.addDynamicLayers(this.lane_1, this.lane_2, this.lane_3);
    shadowLayer.add(graphics);

    //  Controller    -------------------------------------------------------------------------------

    const controllerKeys = new ControlKeys();
    const keyMapper = new KeyboardMapper(this);
    keyMapper.registerKeyboard(controllerKeys);
    
    this.controller = new SpriteController(player, controllerKeys);
  }

  update(time, delta) {

    this.updateCameraBounds();    //  Update bounds according to Player location

    //  Updating sprite lane  -----------------------------------------

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

    //  Shadow updating   --------------------------------------------

    this.shadows.updateDynamicShadows();
    this.shadows.drawShadows();

    this.controller.update();   // Player Controller
  }

  /** Update the camrea bounds as the Player moves to grow world */
  updateCameraBounds() {
    
    const camera = this.cameras.main;
    const bounds = camera.getBounds();

    const left = bounds.left;
    const right = bounds.right;

    const areaWidth = Vars.AREA_WIDTH;
    const fullWorld = areaWidth * 8;

    const pad = areaWidth * .25;
    const bump = areaWidth * .5;

    let mapCheckPos;
    let newLeft = -1;
    let isMoveMap;

    //  Check either side of the camera for loading more of the map

    if (left > 0 && this.player.x < left + pad) {
      newLeft = left - bump;
      mapCheckPos = newLeft;
      isMoveMap = true;
    }
    else if (right < fullWorld && this.player.x > right - pad) {
      newLeft = left + bump;
      mapCheckPos = right + bump;
      isMoveMap = true;
    }

    //  Update world if there are changes

    if (isMoveMap) {
      
      camera.setBounds(newLeft, 0, areaWidth, camera.height);

      if (this.mapTracker.isFirstTimeInAreaThisSession(mapCheckPos)) {
        this.tmBuilder.buildTilemapForArea(mapCheckPos);
        this.mapBuilder.buildMapForArea(mapCheckPos);
        this.shadows.createStaticShadowLines(this.bdL, this.bgL, this.fgL);
      }
    }

  }
}
