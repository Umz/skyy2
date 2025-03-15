import ActComplete from "../actions/ActComplete";
import ActMoveToTargetDistance from "../actions/ActMoveToTargetDistance";
import ActMoveToX from "../actions/ActMoveToX";
import ActWait from "../actions/ActWait";
import ActionManager from "../classes/ActionManager";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Vars from "../const/Vars";
import SaveData from "../util/SaveData";
import ActMoveToTargetOffset from "../actions/ActMoveToTargetOffset";
import ListenCondition from "../actions/ListenCondition";
import { getClosestMaMCitizenForChat } from "../util/ActionHelper";

export default class CitizenMaM extends ActionManager {

  constructor() {
    super();

    this.minX = Vars.AREA_WIDTH * 1.2;
    this.maxX = Vars.AREA_WIDTH * 1.8;

    this.state = Enum.CS_IDLE;
    this.hunger = 5 + Phaser.Math.Between(5, 10);
    this.social = Phaser.Math.Between(1, 4);
  }

  setDefaultActions() {

    if (this.state === Enum.CS_BATTLE_MODE) {
      this.battleMode();
      return;
    }

    const ownForest = SaveData.Data.claimed.includes(Enum.LOC_BLUE_FOREST);
    if (this.social <= 0) {
      this.state = Enum.CS_SOCIAL;
    }
    else if (this.hunger <= 0 && ownForest) {
      this.state = Enum.CS_HUNGRY;
    }

    switch (this.state) {
      case Enum.CS_HUNGRY:
        this.forage();
        break;
      case Enum.CS_SOCIAL:
        this.chat();
        break;
      default:
        this.wander();
        break;
    }
  }

  //  -

  battleMode() {

    const player = this.scene.player;
    const sprite = this.sprite;
    const time = 4 * 1000;
    const offset = Phaser.Math.Between(-200, 200);
    const icon = Phaser.Utils.Array.GetRandom(this.battleIcons);

    this.addBackgroundAction(new ListenCondition(()=>{
      return (player.x < this.minX || player.x > this.maxX) || (sprite.x < this.minX || sprite.x > this.maxX);
    })).addCallback(()=>{
      if (player.x < this.minX || player.x > this.maxX) {
        this.clearAllActions();
        sprite.setState(Enum.CS_IDLE);
        sprite.stopMove();
        this.waitForPlayer();
      }
      else if (sprite.x < this.minX || sprite.x > this.maxX) {
        this.clearAllActions();
        sprite.setState(Enum.CS_IDLE);
        this.outOfScope();
      }
    });

    this.addActions(
      new ActMoveToTargetOffset(sprite, player, offset, 20),
      new ActWait(500),
      new ActComplete(()=>{
        sprite.showIcon(icon, time);
        sprite.setState(Enum.CS_CHEERING)
      }),
      new ActWait(time),
      new ActComplete(()=>{
        sprite.setState(Enum.CS_IDLE);
      })
    )
  }

  waitForPlayer() {
    const player = this.scene.player;
    
    this.addActions(
      new ActWait(100),
      new ActComplete(()=>{

        this.addBackgroundAction(new ListenCondition(()=>{
          if (player.x > this.minX && player.x < this.maxX) {
            this.clearAllActions();
          }
        }));

      }),
      new ActWait(60 * 1000)
    );
  }

  outOfScope() {

    const range = Phaser.Math.Between(50, 250);
    const distance = this.sprite.x < this.minX ? range : -range;
    const toX = this.sprite.x + distance;

    this.addAction(
      new ActMoveToX(this.sprite, toX)
    );
  }

  //  -

  chat() {

    const sprite = this.sprite;
    const closest = getClosestMaMCitizenForChat(sprite);

    // if none available - wait and return.
    if (!closest) {
      this.addAction(new ActWait(3000));
      return;
    }

    //  Go to citizen and start up conversation

    this.addActions(
      new ActWait(500),
      new ActMoveToTargetDistance(sprite, closest, 32),
      new ActComplete(()=>{
        sprite.setState(Enum.CS_CONVERSATION);
        closest.controller.engageChat(sprite);
      }),
      new ActWait(500)
    );

    for (let i=0; i<3; i++)
      this.addChatActions();

    this.addActions(
      new ActWait(500),
      new ActComplete(()=>{
        
        sprite.setState(Enum.CS_IDLE);
        sprite.showIcon(Icon.HAPPY, 15 * 1000);

        this.state = Enum.CS_IDLE;
        this.social += Phaser.Math.Between(2, 5);
      }),
      new ActWait(500)
    );
  }

  engageChat(target) {
    this.clearAllActions();

    const sprite = this.sprite;

    this.addActions(
      new ActWait(100),
      new ActComplete(()=>{
        sprite.setState(Enum.CS_CONVERSATION);
        sprite.stopMove();
        sprite.faceX(target.x);
      }),
      new ActWait(1500)
    );

    for (let i=0; i<3; i++)
      this.addChatActions();

    this.addActions(
      new ActComplete(()=>{
        sprite.setState(Enum.CS_IDLE);
      }),
      new ActWait(500)
    );

    this.social += 1;
  }

  addChatActions() {
    const time = 3 * 1000;
    const icon = Phaser.Utils.Array.GetRandom(this.chatIcons);
    this.addActions(
      new ActComplete(()=>{
        this.sprite.showIcon(icon, time);
      }),
      new ActWait(time),
      new ActWait(750)
    );
  }

  //  -

  /** MaM only forages in Blue Forest */
  forage() {
    
    const sprite = this.sprite;
    const min = this.getForageMin();
    const max = this.getForageMax();
    const x1 = Phaser.Math.Between(min, max);

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
        sprite.showIcon(Phaser.Utils.Array.GetRandom(this.forageIcons), 4 * 1000)
      }),
      new ActWait(5000),
      new ActComplete(()=>{
        
        sprite.setState(Enum.CS_IDLE);
        sprite.showIcon(Icon.HAPPY, 15 * 1000);

        this.state = Enum.CS_IDLE;
        this.hunger = Phaser.Math.Between(10, 18);
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
      new ActMoveToX(sprite, toX),
      new ActComplete(()=>{
        sprite.showIcon(Icon.HAPPY, 1000)
      }),
      new ActWait(delay)
    );

    //  - Increase hunger whenever wandering and social desire

    this.hunger = Math.max(0, this.hunger - 1);
    this.social = Math.max(0, this.social - 1);
  }

  //  - Ranges

  getMin() {
    return this.sprite.home === Enum.LOC_MAM ? Vars.AREA_WIDTH * 1.2 : Vars.AREA_WIDTH * 7.2;
  }

  getMax() {
    return this.sprite.home === Enum.LOC_MAM ? Vars.AREA_WIDTH * 1.8 : Vars.AREA_WIDTH * 7.8;
  }

  getForageMin() {
    return this.sprite.home === Enum.LOC_MAM ? Vars.AREA_WIDTH * .3 : Vars.AREA_WIDTH * 6.3;
  }

  getForageMax() {
    return this.sprite.home === Enum.LOC_MAM ? Vars.AREA_WIDTH * .6 : Vars.AREA_WIDTH * 6.7;
  }

  //  - Icon Arrays -------------------------------------------------------------

  get forageIcons() {
    return [
      Icon.RED_PEPPER,
      Icon.YELLOW_PEPPER,
      Icon.GREENS,
      Icon.TURNIP,
      Icon.STRAWBERRY,
      Icon.PUMPKIN,
      Icon.CARROT,
      Icon.POTATO,
    ];
  }

  get chatIcons() {
    return [
      Icon.RED_PEPPER,
      Icon.YELLOW_PEPPER,
      Icon.GREENS,
      Icon.TURNIP,
      Icon.STRAWBERRY,
      Icon.PUMPKIN,
      Icon.CARROT,
      Icon.POTATO,

      Icon.RED_DRESS,
      Icon.BROWN_DRESS,
      Icon.WHITE_DRESS,
      Icon.WHITE_DRESS2,
      Icon.BANNER,
      Icon.STANDARD,
      Icon.SKY_SPEAR,
      Icon.ICE_CUBE,
      Icon.CLOCK_UP,
      Icon.TIMER_TOP,

      Icon.STAR,
      Icon.STAR_TWO,
      Icon.STAR_THREE,
      Icon.BROWN_SHIRT,
      Icon.RED_ROBE,
      Icon.GOLD_BAT,
      Icon.GOLD_LAMP,
      Icon.GOLD_CUP,
      Icon.GOLD_RING,
      Icon.GOLD_THING,
      Icon.GOLD_SPRING,
      Icon.GOLD_MIRROR,
      Icon.BLUE_SILICA,
      Icon.GOLD_SILICA
    ]
  }

  get battleIcons() {
    return [
      Icon.SKY_SPEAR,
      Icon.BANNER,
      Icon.FIST_UP
    ]
  }

}
