import ActionManager from "../classes/ActionManager";
import ActComplete from "../actions/ActComplete";
import ActMoveOffX from "../actions/ActMoveOffX";
import ActWait from "../actions/ActWait";
import ListenCondition from "../actions/ListenCondition";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Vars from "../const/Vars";
import { getClosestSoldierInRange } from "../util/ActionHelper";

/** Citizen behaviour during battles (stay away from clashes) */
export default class CitizenBattle extends ActionManager {

  setDefaultActions() {
    this.waitAndWatch();
  }

  //  - Wait and watch -

  waitAndWatch() {

    this.addActions(
      new ActWait(2000),
      new ActComplete(()=>{
        this.sprite.showIcon(Icon.HAND_FIST_RIGHT, 5000)
      }),
      new ActWait(10 * 1000)
    )

    this.addBackgroundAction(new ListenCondition(()=>{
      const nearest = getClosestSoldierInRange(this.sprite, 90);
      if (nearest) {
        this.clearAllActions();
        this.moveFromBattle(nearest);
      }
    }));
  }

  //  - Run away from conflict -

  moveFromBattle(closest) {
    
    const fromX = closest.x;
    const range = Phaser.Math.Between(80, 100);
    const distance = this.sprite.x > fromX ? range : -range;

    this.addActions(
      new ActComplete(()=>{
        this.sprite.showIcon(Icon.SWEAT_TWO, 5000)
      }),
      new ActMoveOffX(this.sprite, distance),
      new ActWait(1000)
    )
  }

  get saveID() { return 1 }
}
