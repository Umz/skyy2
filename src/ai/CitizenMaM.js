import ActComplete from "../actions/ActComplete";
import ActMoveOffX from "../actions/ActMoveOffX";
import ActMoveToX from "../actions/ActMoveToX";
import ActWait from "../actions/ActWait";
import ActionManager from "../classes/ActionManager";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Vars from "../const/Vars";

export default class CitizenMaM extends ActionManager {

  constructor() {
    super();

    this.minX = Vars.AREA_WIDTH * 1.2;
    this.maxX = Vars.AREA_WIDTH * 1.8;

    this.state = Enum.CS_IDLE;
    this.hunger = 10;
    this.social = 3;
  }

  setDefaultActions() {

    switch (this.state) {
      case Enum.CS_HUNGRY:
        this.forage();
        break;
      case Enum.CS_TALKING:
        this.chat();
        break;
      default:
        this.wander();
        break;
    }
  }

  //  -

  chat() {
    //  Find another citizen and force a conversation
  }

  //  -

  forage() {
    // Go to Blue Forest (only) and find food
  }

  //  -

  wander() {

    const sprite = this.sprite;
    const delay = Phaser.Math.Between(1000, 3000);
    const toX = Phaser.Math.Between(this.minX, this.maxX);

    this.addActions(
      new ActWait(delay),
      new ActComplete(()=>{
        sprite.showIcon(Icon.STANDARD, 1000)
      }),
      new ActMoveToX(sprite, toX),
      new ActComplete(()=>{
        sprite.showIcon(Icon.HAPPY, 1000)
      }),
      new ActWait(delay)
    );

    //  - Increase hunger whenever wandering
    this.hunger --;
    if (this.hunger <= 0) {
      this.state = Enum.CS_HUNGRY;
    }

  }

}
