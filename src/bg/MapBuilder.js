import BaseBuilder from "../classes/BaseBuilder";
import Vars from "../util/Vars";

export default class MapBuilder extends BaseBuilder {

  /** Set the layers to be used for building the map scenes */
  setLayers({ bgLayer, fgLayer, buildingsLayer }) {
    this.bg = bgLayer;
    this.fg = fgLayer;
    this.buildings = buildingsLayer;
  }

  /** Full function to load all background images from the json data */
  loadSprites(json_data, layer) {

    const startX = 0;
    for (let data of json_data) {

      let sprite;
      if (data.animation) {
        sprite = this.addAnimated(data.x, Vars.GROUND_TOP, Vars.SHEET_ALL_BANNERS, data.animation);
      }
      else {
        sprite = this.add(startX + data.x, Vars.GROUND_TOP, data.frame);
      }

      //  Shine effect on all main buildings
      if (data.fx) {
        sprite.postFX.addShine();
      }

      sprite.setDepth(data.depth);
      layer.add(sprite);
    }
  }

  /** Load a village completely, with flora */
  loadVillage(name) {

    const village = `json_${name}`;
    const bg = `json_${name}_bg`;
    const fg = `json_${name}_fg`;

    const villageJSON = this.scene.cache.json.get(village);
    const bgJSON = this.scene.cache.json.get(bg);
    const fgJSON = this.scene.cache.json.get(fg);

    this.loadSprites(villageJSON, this.buildings);
    this.loadSprites(bgJSON, this.bg);
    this.loadSprites(fgJSON, this.fg);
  }

  /** Moon at Midnight */
  loadMaM() {
    this.loadVillage("mam");
  }

  /** Storm Village */
  loadStorm() {
    this.loadVillage("storm");
  }

  /** Green Village */
  loadGreen() {
    this.loadVillage("green");
  }

}