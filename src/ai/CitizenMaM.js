import ActComplete from "../actions/ActComplete";
import ActMoveOffX from "../actions/ActMoveOffX";
import ActMoveToX from "../actions/ActMoveToX";
import ActWait from "../actions/ActWait";
import ActionManager from "../classes/ActionManager";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Vars from "../const/Vars";
import SaveData from "../util/SaveData";

export default class CitizenMaM extends ActionManager {

  constructor() {
    super();

    this.minX = Vars.AREA_WIDTH * 1.2;
    this.maxX = Vars.AREA_WIDTH * 1.8;

    this.state = Enum.CS_IDLE;
    this.hunger = 1;
    this.social = 3;
  }

  setDefaultActions() {

    // Refine to use with 

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

  /** MaM only forages in Blue Forest */
  forage() {
    
    const sprite = this.sprite;
    const min = Vars.AREA_WIDTH * .3, max = Vars.AREA_WIDTH * .6;
    const x1 = Phaser.Math.Between(min, max);
    const icons = [
      Icon.RED_PEPPER,
      Icon.YELLOW_PEPPER,
      Icon.GREENS,
      Icon.TURNIP,
      Icon.STRAWBERRY,
      Icon.PUMPKIN,
      Icon.CARROT,
      Icon.POTATO,
    ];

    this.addActions(
      new ActWait(500),
      new ActComplete(()=>{
        sprite.showIcon(Icon.SEARCH, 15 * 1000)
      }),

      new ActMoveToX(sprite, x1),
      new ActWait(500),
      new ActComplete(()=>{
        sprite.setState(Enum.CS_FORAGING);
        sprite.showIcon(Icon.SEARCH, 3 * 1000)
      }),
      new ActWait(7000),
      new ActComplete(()=>{
        sprite.setState(Enum.CS_CONVERSATION);
        sprite.showIcon(Phaser.Utils.Array.GetRandom(icons), 4 * 1000)
      }),
      new ActWait(5000),
      new ActComplete(()=>{
        
        sprite.setState(Enum.CS_IDLE);
        sprite.showIcon(Icon.HAPPY, 15 * 1000);

        this.state = Enum.CS_IDLE;
        this.hunger = 15;
      })
    );
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
    this.hunger = Math.max(0, this.hunger - 1);
    const ownForest = !SaveData.Data.claimed.includes(Enum.LOC_BLUE_FOREST);
    if (this.hunger <= 0 && ownForest) {
      this.state = Enum.CS_HUNGRY;
    }

  }

}
