import BaseBuilder from "../classes/BaseBuilder";
import Vars from "../util/Vars";

export default class MapBuilder extends BaseBuilder {

  /** Generic function to load all buildings in the json data */
  loadJSON(json_data, layer) {
    const startX = 0;
    for (let data of json_data) {
      const image = this.add(startX + data.x, Vars.GROUND_TOP, data.frame);
      image.setDepth(data.depth);
      layer.add(image);
    }
  }

  /** Moon at Midnight */
  loadMaM(bgLayer, fgLayer) {
    const bgTrees = this.scene.cache.json.get('json_mam_bg');
    const fgTrees = this.scene.cache.json.get('json_mam_fg');
    this.loadJSON(bgTrees, bgLayer);
    this.loadJSON(fgTrees, fgLayer);
  }
  
}