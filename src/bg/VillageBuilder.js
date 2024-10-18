import BaseBuilder from "../classes/BaseBuilder";
import Vars from "../util/Vars";

export default class VillageBuilder extends BaseBuilder {

  /** Generic function to load all buildings in the json data */
  loadVillage(json_data, layer) {
    const startX = 0;
    for (let data of json_data) {

      let image;
      if (data.animation) {
        image = this.addAnimated(data.x, Vars.GROUND_TOP, Vars.SHEET_ALL_BANNERS, data.animation);
      }
      else {
        image = this.add(startX + data.x, Vars.GROUND_TOP, data.frame);
      }

      image.setDepth(data.depth);
      layer.add(image);
    }
  }

  /** Moon at Midnight */
  loadMaM(layer) {
    const villageBuildings = this.scene.cache.json.get('json_mam');
    this.loadVillage(villageBuildings, layer);
    //  Load data from dB to check against upgraded buildings
  }
  
  /** Storm Village */
  loadStorm(layer) {
    const villageBuildings = this.scene.cache.json.get('json_storm');
    this.loadVillage(villageBuildings, layer);
  }

  /** Green Village */
  loadGreen(layer) {
    const villageBuildings = this.scene.cache.json.get('json_green');
    this.loadVillage(villageBuildings, layer);
  }
}