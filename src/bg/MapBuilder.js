import BaseBuilder from "../classes/BaseBuilder";
import Vars from "../util/Vars";

const FOREST = "forest";
const VILLAGE = "village";
const RESOURCE = "resource";

export default class MapBuilder extends BaseBuilder {

  /** Set the layers to be used for building the map scenes */
  setLayers({ bgLayer, fgLayer, buildingsLayer }) {
    this.bg = bgLayer;
    this.fg = fgLayer;
    this.buildings = buildingsLayer;
  }

  /** Full function to load all background images from the json data */
  loadSprites(json_data, startX, layer) {

    for (let data of json_data) {

      let sprite;
      if (data.animation) {
        sprite = this.addAnimated(startX + data.x, Vars.GROUND_TOP, Vars.SHEET_ALL_BANNERS, data.animation);
      }
      else {
        sprite = this.add(startX + data.x, Vars.GROUND_TOP, data.frame);
      }

      //  Shine effect
      if (data.fx) {
        sprite.postFX.addShine();
      }

      //  Area label in the sky
      if (data.area) {
        const json = this.scene.cache.json.get('hud_html');
        const template = json.area_label;
        const html = template.replace('_label_', data.area);

        this.scene.add.dom(sprite.getCenter().x, 32).createFromHTML(html).setOrigin(.4, 0);
      }

      sprite.setDepth(data.depth);
      layer.add(sprite);
    }
  }

  /** Load a village completely, with flora */
  loadVillage(name, posX) {

    const village = `json_${name}`;
    const bg = `json_${name}_bg`;
    const fg = `json_${name}_fg`;

    const villageJSON = this.scene.cache.json.get(village);
    const bgJSON = this.scene.cache.json.get(bg);
    const fgJSON = this.scene.cache.json.get(fg);

    this.loadSprites(villageJSON, posX, this.buildings);
    this.loadSprites(bgJSON, posX, this.bg);
    this.loadSprites(fgJSON, posX, this.fg);
  }

  /** Load all big forests with big forest background */
  loadBigForest(name, posX) {
    
    const forest = `json_${name}_forest`;
    const bg = "json_big_forest_bg";

    const forestJSON = this.scene.cache.json.get(forest);
    const bgJSON = this.scene.cache.json.get(bg);
    
    this.loadSprites(forestJSON, posX, this.buildings);
    this.loadSprites(bgJSON, posX, this.bg);
  }

  /** Load a simple location and background for location */
  loadLocation(name, posX) {
    const location = `json_${name}`;
    const bg = `json_${name}_bg`;
    const locationJSON = this.scene.cache.json.get(location);
    const bgJSON = this.scene.cache.json.get(bg);
    this.loadSprites(locationJSON, posX, this.buildings);
    this.loadSprites(bgJSON, posX, this.bg);
  }

  /** Get the location of the current area from the given X position */
  buildMapForArea(posX) {

    const allLocations = [
      {json:"blue", type:FOREST},
      {json:"mam", type:VILLAGE},
      {json:"rose", type:FOREST},
      {json:"storm", type:VILLAGE},
      {json:"mines", type:RESOURCE},
      {json:"plains", type:RESOURCE},
      {json:"greenleaf", type:FOREST},
      {json:"green", type:VILLAGE}
    ];

    const areaID = Math.ceil(posX / Vars.AREA_WIDTH);
    const index = areaID - 1;
    const areaX = index * Vars.AREA_WIDTH;

    if (index >= 0 && index < allLocations.length) {
      const location = allLocations[index];
      const json = location.json;
      switch (location.type) {
        case FOREST:
          this.loadBigForest(json, areaX);
          break;
        case VILLAGE:
          this.loadVillage(json, areaX);
          break;
        case RESOURCE:
          this.loadLocation(json, areaX);
      }
    }
  }

}