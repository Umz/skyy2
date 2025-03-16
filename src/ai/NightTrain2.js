import ActComplete from "../actions/ActComplete";
import ActMoveOffX from "../actions/ActMoveOffX";
import ActMoveToTargetDistance from "../actions/ActMoveToTargetDistance";
import ActMoveToTargetOffset from "../actions/ActMoveToTargetOffset";
import ActMoveToX from "../actions/ActMoveToX";
import ActWait from "../actions/ActWait";
import ListenCondition from "../actions/ListenCondition";
import ListenPlayerDistance from "../actions/ListenPlayerDistance";
import ActionManager from "../classes/ActionManager";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Vars from "../const/Vars";
import SaveData from "../util/SaveData";

const TO_MINES = 1;
const TO_STORM = 2;
const HIRE = 3;

/**
 * Night Train (2)
 * Go between the mines and the village transporting goods
 */
export default class NightTrain2 extends ActionManager {

  constructor() {
    super();
    this.action = TO_MINES;
    this.carryLoad = 0;
  }

  setDefaultActions() {
    switch (this.action) {
      case TO_MINES:
        this.gotoMines();
        break;
      case TO_STORM:
        this.deliverToStorm();
        break;
      case HIRE:
        this.hireCitizens();
        break;
    }
  }

  /** From position go to The Mines */
  gotoMines() {
    const toX = Phaser.Math.Between(Vars.AREA_WIDTH * 4.3, Vars.AREA_WIDTH * 4.6);
    this.addActions(
      new ActMoveToX(this.sprite, toX),
      new ActWait(3000),
      new ActComplete(()=>{
        this.carryLoad = SaveData.Data.silica;
        this.action = TO_STORM;
      })
    )
  }

  /** Deliver silica to Storm Village */
  deliverToStorm() {
    const toX = Phaser.Math.Between(Vars.AREA_WIDTH * 3.6, Vars.AREA_WIDTH * 3.8);
    this.addActions(
      new ActMoveToX(this.sprite, toX),
      new ActWait(1000),
      new ActComplete(()=>{

        SaveData.Data.transportedSilica += this.carryLoad;
        SaveData.Data.silica -= this.carryLoad;
        this.carryLoad = 0;

        this.action = HIRE;
      }),
      new ActWait(1000)
    )
  }

  /** Hire citizens in Storm */
  hireCitizens() {

    const all = this.scene.groupCitizens.getChildren();
    const citizens = all.filter(ss => ss.home === Enum.LOC_STORM && ss.getData("available"));

    this.addActions(
      new ActComplete(()=>{
        this.sprite.showIcon(Icon.TRIANGLE, 2500);
      }),
      new ActWait(3000)
    );

    let max = 3;
    for (let available of citizens) {
      this.addActions(
        new ActMoveToTargetDistance(this.sprite, available),
        new ActComplete(()=>{
          this.sprite.showIcon(Icon.SILVER_PURSE, 2500);
          available.controller.startMining();   // Hire citizen
        }),
        new ActWait(3500)
      );
      max --;
      if (max <= 0) {
        break;
      }
    }

    this.addAction(new ActWait(4000));
  }

}
