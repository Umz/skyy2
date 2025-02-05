import Enum from "../const/Enum";
import SaveData from "../util/SaveData";

export default class Building extends Phaser.GameObjects.Image {

  constructor(scene, x, y, atlas, frame) {
    super(scene, x, y, atlas, frame);
    scene.add.existing(this);

    this.level = 1;
    this.progress = 0;
    this.buildingNo = -1;
    this.location = -1;
    this.buildingType = this.getBuildingType(frame);
  }

  setup(loc, num) {
    this.location = loc;
    this.buildingNo = num;
  }

  setLevel(lv) {
    this.level = lv;
    this.updateFrame();
  }

  addProgress(amt) {
    this.progress = Math.min(100, this.progress + amt);
    this.updateFrame();
  }

  updateFrame() {
    if (this.level > 1) {
      const newFrame = this.getBuildingFrame(this.progress);
      this.setFrame(newFrame);
    }
  }

  getBuildingFrame() {
    if (this.buildingType === Enum.BUILDING_HOUSE) {
      this.getStormHouseFrame();
    }
    else if (this.buildingType === Enum.BUILDING_TOWER) {
      this.getStormTowerFrame();
    }
    else {
      return this.frame;
    }
  }

  getStormHouseFrame() {
    if (percent >= 100) {
      return "storm_house_b4";
    }
    else if (percent > 70) {
      return "storm_house_b1";
    }
    else if (percent > 20) {
      return "storm_house_b2";
    }
    else {
      return "storm_house_b1";
    }
  }

  getStormTowerFrame() {
    if (percent >= 100) {
      return "storm_block_b3";
    }
    else if (percent > 45) {
      return "storm_block_b2";
    }
    else {
      return "storm_block_b1";
    }
  }

  getBuildingType(frame) {
    switch (frame) {
      case "storm_hut": return Enum.BUILDING_HOUSE;
      case "storm_block": return Enum.BUILDING_TOWER
      default: return Enum.BUILDING_GENERIC;
    }
  }

  //  -

  updateSaveData() {
    const houseData = SaveData.Data.houses.find(data => data.num === this.buildingNo);
    houseData.progress = this.progress;
  }

  getSaveData() {
    return {
      num: this.buildingNo,
      progress: this.progress,
      level: this.level,
      location: this.location
    }
  }

  loadData(data) {
    this.buildingNo = data.num;
    this.level = data.level;
    this.progress = data.progress;
    this.updateFrame();
  }
}
