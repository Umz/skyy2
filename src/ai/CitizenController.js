import ActMoveOffX from "../actions/ActMoveOffX";
import ActWait from "../actions/ActWait";
import ActionManager from "../classes/ActionManager";

export default class CitizenController extends ActionManager {

  setDefaultActions() {
    this.wander();
  }

  //  -

  wander() {
    const distance = Phaser.Math.Between(-60, 60);

    this.addActions(
      new ActMoveOffX(this.sprite, distance),
      new ActWait(3000)
    )
  }

}
