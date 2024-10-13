//import Vars from "../util/Vars";

export default class TilemapBuilder {

  constructor(scene) {
    this.scene = scene;
  }

  buildTilemap(viewLayer) {
    
    const camera = this.scene.cameras.main;
    const bounds = camera.getBounds();

    const Vars = {
      TILEMAP_FLOOR: 195
    }

    const tmX = 32;
    const tmY = Vars.TILEMAP_FLOOR;
    const tmWidth = Math.floor((bounds.width - tmX * 2) / 16);

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