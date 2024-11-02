//import Vars from "../util/Vars";

import Vars from "../util/Vars";

export default class TilemapBuilder {

  constructor(scene, layer) {
    this.scene = scene;
    this.viewLayer = layer;
  }

  buildFullWidthFloor(startX, areaWidth) {

    const FLOOR_Y = 195;

    const tmX = startX;
    const tmY = FLOOR_Y;
    const tilemapWidth = Math.floor(areaWidth / 16);

    const tilemap = this.scene.make.tilemap({tileWidth: 16, tileHeight: 16, width: tilemapWidth, height: 6});
    const tileset = tilemap.addTilesetImage('tilemap');

    const floor_layer = tilemap.createBlankLayer(`floor_${startX}`, tileset, tmX, tmY, tilemapWidth, 3);

    tilemap.fill(1, 0, 0, tilemapWidth, 1, true, floor_layer);    // Top of repeating
    tilemap.fill(4, 0, 1, tilemapWidth, 1, true, floor_layer);    // Middle of repeating
    tilemap.fill(7, 0, 2, tilemapWidth, 1, true, floor_layer);    // Bottom of repeating    

    this.viewLayer.add(floor_layer);
  }

  /** Check if the tilemap has been added for the current location, and add it otherwise */
  buildTilemapForArea(posX) {
    const areaID = Math.ceil(posX / Vars.AREA_WIDTH);
    const startX = (areaID - 1) * Vars.AREA_WIDTH;
    this.buildFullWidthFloor(startX, Vars.AREA_WIDTH);
  }

  buildTilemap(viewLayer) {
    
    const camera = this.scene.cameras.main;
    const bounds = camera.getBounds();
    const FLOOR_Y = 195;

    const tmX = -16;
    const tmY = FLOOR_Y;
    //const tmWidth = Math.floor((bounds.width - tmX * 2) / 16);
    const tmWidth = Math.floor((bounds.width + 32) / 16);

    const tm = this.scene.make.tilemap({tileWidth: 16, tileHeight: 16, width: tmWidth, height: 6});
    const tileset = tm.addTilesetImage('tilemap');

    const stand_layer = tm.createBlankLayer('stand', tileset, tmX, tmY, tmWidth, 6);
    const floor_layer = tm.createBlankLayer('floor', tileset, tmX, tmY, tmWidth, 3);
    
    const standX = Math.floor(tmWidth / 2) - 1;
    tm.putTilesAt(this.stand, standX, 2, true, stand_layer);

    tm.fill(1, 0, 0, tmWidth, 1, true, floor_layer);
    tm.fill(4, 0, 1, tmWidth, 1, true, floor_layer);
    tm.fill(7, 0, 2, tmWidth, 1, true, floor_layer);

    tm.putTilesAt(this.front_l, 0, 0, true, floor_layer);
    tm.putTilesAt(this.front_r, tmWidth - 1, 0, true, floor_layer);

    viewLayer.add([stand_layer, floor_layer]);
  }

  get front() {
    const front = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8]
    ];
    return front;
  }

  get front_l() {
    return [ [0], [3], [6] ];
  }

  get front_r() {
    return [ [2], [5], [8] ];
  }

  get stand() {
    const stand = [
      [9, 10, 11],
      [12, 13, 14],
      [15, 16, 17],
      [15, 16, 17]
    ];
    return stand;
  }
}