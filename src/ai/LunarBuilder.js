import ActComplete from "../actions/ActComplete";
import ActMoveToX from "../actions/ActMoveToX";
import ActWait from "../actions/ActWait";
import ActionManager from "../classes/ActionManager";
import Icon from "../const/Icon";
import Vars from "../const/Vars";
import SaveData from "../util/SaveData";

/** Lunar Builder | Roams around Storm village rebuilding */
export default class LunarBuilder extends ActionManager {

  setDefaultActions() {

    const material = SaveData.Data.buildingMaterial;
    const silica = SaveData.Data.transportedSilica;

    if (material === 0 && silica > 0) {
      this.processSilica()
    }
    else {
      let building = this.getRandomTower();
      if (!building) {
        building = this.getRandomHouse();
      }
  
      if (building && material > 0) {
        this.build(building);
      }
      else {
        this.idle();
      }
    }
  }

  processSilica() {
    this.addActions(
      new ActComplete(()=>{
        this.sprite.showIcon(Icon.BLUE_SILICA, 1000);
      }),
      new ActWait(1750),

      new ActComplete(()=>{
        this.sprite.showIcon(Icon.DARK_ENERGY, 1000);
      }),
      new ActWait(1750),

      new ActComplete(()=>{
        const raw = Math.min(25, SaveData.Data.transportedSilica);
        SaveData.Data.transportedSilica -= raw;
        SaveData.Data.buildingMaterial += raw;
      }),
      new ActWait(500)
    );
  }

  build(building) {

    const bX = building.getCenter().x;

    this.addActions(
      new ActMoveToX(this.sprite, bX),
      new ActWait(1000),
      new ActComplete(()=>{
        this.sprite.showIcon(Icon.SLEDGE, 2500)
      }),
      new ActWait(2000),
      new ActComplete(()=>{
        this.sprite.showIcon(Icon.HAND_BACK_FIST, 1500)
      }),
      new ActComplete(()=>{

        const amt = Phaser.Math.Between(10, 20);
        const raw = Math.min(amt, SaveData.Data.buildingMaterial);
        SaveData.Data.buildingMaterial -= raw;

        building.addProgress(raw);
        building.updateSaveData();
      }),
      new ActWait(1500)
    );
  }

  idle() {
    const MIN = Vars.AREA_WIDTH * 3.2;
    const MAX = Vars.AREA_WIDTH * 3.8;
    this.addActions(
      new ActMoveToX(this.sprite, Phaser.Math.Between(MIN, MAX)),
      new ActWait(2000),
      new ActComplete(()=>{
        this.sprite.showIcon(Icon.PAGE, 4500)
      }),
      new ActWait(5000),
      new ActMoveToX(this.sprite, Phaser.Math.Between(MIN, MAX)),
      new ActWait(1000),
      new ActMoveToX(this.sprite, Phaser.Math.Between(MIN, MAX)),
      new ActComplete(()=>{
        this.sprite.showIcon(Icon.PAGE, 4500)
      }),
      new ActWait(5000)
    )
  }

  //  - Building helper functions -

  getRandomTower() {
    const allTowers = this.scene.getStormTowers();
    const availableTowers = allTowers.filter(tower => tower.progress < 100);
    return Phaser.Utils.Array.GetRandom(availableTowers);
  }

  getRandomHouse() {
    const allHouses = this.scene.getStormHouses();
    const available = allHouses.filter(house => house.progress < 100);
    return Phaser.Utils.Array.GetRandom(available);
  }
}