import BaseBuilder from "../classes/BaseBuilder";
import Vars from "../util/Vars";

export default class VillageBuilder extends BaseBuilder {

  addBuildingsForWave(layer, currentWave) {

    const data = this.scene.cache.json.get('bg_village');

    const buildings = data.buildings;
    const banners = data.banners;
    const buildings_wave = buildings.filter(data => data.wave === currentWave);
    const banners_wave = banners.filter(data => data.wave === currentWave);

    const center = this.getCenterX();

    for (let b_data of buildings_wave) {
      const image = this.add(center + b_data.x, Vars.GROUND_TOP, b_data.frame);
      layer.add(image);
    }

    for (let b_data of banners_wave) {
      let sprite = this.addAnimated(center + b_data.x, Vars.GROUND_TOP, Vars.SHEET_MAM_BANNER, b_data.animation);
      layer.add(sprite);
    }
  }
 
  loadBuildings(layer, currentWave) {
    for (let i = 0; i <= currentWave; i++) {
      this.addBuildingsForWave(layer, i);
    }
  }

  loadMaM(layer) {
    
    const villageBuildings = this.scene.cache.json.get('json_mam');
    const startX = 0;

    for (let b_data of villageBuildings) {
      const image = this.add(startX + b_data.x, Vars.GROUND_TOP, b_data.frame);
      image.setDepth(b_data.depth);
      layer.add(image);
    }

    //  Load data from dB to check against upgraded buildings

  }
}