import ActComplete from "../actions/ActComplete";
import ActMoveOffX from "../actions/ActMoveOffX";
import ActWait from "../actions/ActWait";
import ActionManager from "../classes/ActionManager";
import Enum from "../const/Enum";
import Icon from "../const/Icon";

export default class CitizenController extends ActionManager {

  setDefaultActions() {
    this.wander();
  }

  //  -

  wander() {

    const sprite = this.sprite;
    const distance = Phaser.Math.Between(-60, 60);

    this.addActions(
      new ActMoveOffX(this.sprite, distance),
      new ActWait(3000),

      new ActComplete(()=>{
        //sprite.speak(Icon.HEART, "Thank you Warrior!", 5000)
      }),
      //new ActWait(10000),
    )
  }

  get saveID() { return 3 }
}
