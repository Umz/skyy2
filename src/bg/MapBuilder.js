import BaseBuilder from "../classes/BaseBuilder";
import Enum from "../const/Enum";
import Vars from "../const/Vars";
import SaveData from "../util/SaveData";

const FOREST = "forest";
const VILLAGE = "village";
const RESOURCE = "resource";

export default class MapBuilder extends BaseBuilder {

  /** Set the layers to be used for building the map scenes */
  setLayers({ bgLayer, fgLayer, buildingsLayer }) {
    
    this.bg = bgLayer;
    this.fg = fgLayer;
    this.buildings = buildingsLayer;

    this.builtAreas = [];
  }

  /** Full function to load all background images from the json data */
  addSprites(json_data, startX, layer) {

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
        this.addLabel(sprite, data.area);
      }

      sprite.setDepth(data.depth);
      layer.add(sprite);
    }
  }

  /** Replicating add Sprites but with buildings specifically for using SaveData */
  addBuildings(json_data, startX, layer) {

    for (let i=0; i<json_data.length; i++) {

      const data = json_data[i];
      const houseNo = i;

      const houseSprite = this.addBuilding(startX + data.x, Vars.GROUND_TOP, data.frame);
      houseSprite.setup(Enum.LOC_STORM, houseNo);

      const saveData = this.loadHouseData(houseNo);
      houseSprite.loadData(saveData);

      if (data.area) {
        this.addLabel(houseSprite, data.area);
      }

      console.log(saveData)

      houseSprite.setDepth(data.depth);
      layer.add(houseSprite);
    }
  }

  addLabel(sprite, text) {
    const json = this.scene.cache.json.get('hud_html');
    const template = json.area_label;
    const html = template.replace('_label_', text);
    this.scene.add.dom(sprite.getCenter().x, 32).createFromHTML(html).setOrigin(.4, 0);
  }

  loadHouseData(houseNum) {

    let houseData = SaveData.Data.houses.find(data => data.num === houseNum);
    if (!houseData) {
      const newData = {
        num: houseNum,
        progress: 0,
        level: 1,
        location: Enum.LOC_STORM
      }
      SaveData.Data.houses.push(newData);
      return newData;
    }
    
    return houseData;
  }

  /** Load a village completely, with flora */
  loadVillage(name, posX) {

    const village = `json_${name}`;
    const bg = `json_${name}_bg`;
    const fg = `json_${name}_fg`;

    const villageJSON = this.scene.cache.json.get(village);
    const bgJSON = this.scene.cache.json.get(bg);
    const fgJSON = this.scene.cache.json.get(fg);

    const isStorm = name === "storm";
    if (isStorm) {
      this.addBuildings(villageJSON, posX, this.buildings);
    }
    else {
      this.addSprites(villageJSON, posX, this.buildings);
    }

    this.addSprites(bgJSON, posX, this.bg);
    this.addSprites(fgJSON, posX, this.fg);
  }

  /** Load all big forests with big forest background */
  loadBigForest(name, posX) {
    
    const forest = `json_${name}_forest`;
    const bg = "json_big_forest_bg";

    const forestJSON = this.scene.cache.json.get(forest);
    const bgJSON = this.scene.cache.json.get(bg);
    
    this.addSprites(forestJSON, posX, this.buildings);
    this.addSprites(bgJSON, posX, this.bg);
  }

  /** Load a simple location and background for location */
  loadLocation(name, posX) {
    const location = `json_${name}`;
    const bg = `json_${name}_bg`;
    const locationJSON = this.scene.cache.json.get(location);
    const bgJSON = this.scene.cache.json.get(bg);
    this.addSprites(locationJSON, posX, this.buildings);
    this.addSprites(bgJSON, posX, this.bg);
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
      const areaBuilt = this.builtAreas.findIndex(name => name === json);

      if (areaBuilt < 0) {
        this.builtAreas.push(json);
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

}