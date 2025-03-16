import ActComplete from "../actions/ActComplete";
import ActMoveOffX from "../actions/ActMoveOffX";
import ActMoveToX from "../actions/ActMoveToX";
import ActWait from "../actions/ActWait";
import ActionManager from "../classes/ActionManager";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Vars from "../const/Vars";
import SaveData from "../util/SaveData";

export default class CitizenStorm extends ActionManager {

  constructor() {
    super();
    this.state = Enum.CS_IDLE;
    this.food = Phaser.Math.Between(10, 30);
    this.energy = Phaser.Math.Between(0, 10);
  }

  setDefaultActions() {

    const isClothingUpgraded = this.sprite.getData("newClothes");
    const money = this.sprite.getData("money") || 0;

    if (!isClothingUpgraded && money >= 50) {
      this.state = Enum.CS_TRAVELLING;
    }
    else if (this.food <= 0) {
      this.state = Enum.CS_HUNGRY;
    }
    else {
      this.state = Enum.CS_IDLE;
    }

    //  Action to take based on state
    
    switch (this.state) {
      case Enum.CS_HUNGRY:
        this.forage();
        break;
      case Enum.CS_TRAVELLING:
        this.gotoShopForNewClothes();
        break;
      default:
        this.wander();
        break;
    }
  }

  //  - Upgrade Clothes -

  gotoShopForNewClothes() {

    const shopX = Vars.AREA_WIDTH + 715;
    const homeX = Vars.AREA_WIDTH * 3.3;
    const clothIcon = this.getClothesIcon();
    const texture = this.getNewSpritesheet();

    this.addActions(
      new ActComplete(()=>{
        this.sprite.x = Vars.AREA_WIDTH * 2 + Phaser.Math.Between(-80, 80);
      }),
      new ActWait(1000),
      new ActComplete(()=>{
        this.sprite.showIcon(clothIcon, 10 * 1000);
      }),
      new ActMoveToX(this.sprite, shopX),
      new ActWait(1000),

      new ActComplete(()=>{
        this.sprite.showIcon(clothIcon, 2000);
      }),
      new ActWait(3000),

      new ActComplete(()=>{
        this.sprite.showIcon(Icon.SILVER_PURSE, 2000);
      }),
      new ActWait(3000),

      new ActComplete(()=>{
        this.sprite.setTexture(texture);
        this.sprite.prefix = texture;
      }),
      new ActComplete(()=>{

        const data = SaveData.Data.citizens.find(cit => cit.uid === this.sprite.uid);
        data.sheet = texture;
        data.data.newClothes = true;

        this.sprite.setData("newClothes", true);
      }),
      
      new ActComplete(()=>{
        this.sprite.showIcon(Icon.HAPPY, 2000);
      }),
      new ActWait(3000),

      new ActComplete(()=>{
        this.sprite.showIcon(Icon.HOME, 10 * 1000);
      }),
      new ActMoveToX(this.sprite, homeX)
    )
  }

  //  -

  wander() {

    const sprite = this.sprite;
    const distance = Phaser.Math.Between(-60, 60);
    const minX = Vars.AREA_WIDTH * 3.1;
    const maxX = Vars.AREA_WIDTH * 3.8;
    const toX = Phaser.Math.Clamp(sprite.x + distance, minX, maxX);

    const action = sprite.x < minX || sprite.x > maxX ? new ActMoveToX(sprite, toX) : new ActMoveOffX(sprite, distance);

    this.addActions(
      action,
      new ActWait(3000),
      new ActComplete(()=>{
        this.food --;
        this.sprite.setData("available", this.energy >= 5);
      })
    )
  }

  // - 

  forage() {
    
    const sprite = this.sprite;
    const min = Vars.AREA_WIDTH * 2.2, max = Vars.AREA_WIDTH * 2.8;
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

        this.food = Phaser.Math.Between(50, 80);
        this.energy += Phaser.Math.Between(10, 15);

        this.sprite.setData("available", true);
      }),
      new ActMoveOffX(this.sprite, Vars.AREA_WIDTH),
      new ActWait(2000)
    );
  }

  // - Mining

  startMining() {
    
    const money = this.sprite.getData("money") || 0;
    this.sprite.setData("available", false);
    this.sprite.setData("money", money + 25);

    this.clearAllActions();
    this.mining();
  }

  mining() {

    const sprite = this.sprite;
    const minX = Vars.AREA_WIDTH * 4.2;
    const maxX = Vars.AREA_WIDTH * 4.6;
    const rockX = Phaser.Math.Between(minX, maxX);

    this.addActions(

      new ActWait(500),
      new ActComplete(()=>{
        sprite.showIcon(Icon.PICKAXE, 60 * 1000)
      }),

      new ActMoveToX(sprite, rockX),
      new ActWait(500),
      new ActComplete(()=>{
        sprite.showIcon(Icon.SEARCH, 4 * 1000);
      }),
      new ActWait(3000),
      new ActComplete(()=>{
        sprite.showIcon(Icon.PICKAXE, 20 * 1000);
        sprite.setState(Enum.CS_DIGGING);
      }),
      new ActWait(21 * 1000),
      new ActComplete(()=>{

        sprite.setState(Enum.CS_IDLE);
        sprite.showIcon(Icon.BLUE_SILICA, 15 * 1000);

        SaveData.Data.silica += this.energy * 2;
        
        this.food = 3;
        this.energy = 0;
      }),

      new ActWait(3000),
      new ActMoveToX(sprite, Vars.AREA_WIDTH * 3.7)
    );
  }

  //  -----------------------------------------------------------------------

  getClothesIcon() {
    const prefix = this.sprite.prefix;
    switch (prefix) {
      case Vars.SHEET_CITIZEN_STORM_F1:
        return Icon.RED_DRESS;
      case Vars.SHEET_CITIZEN_STORM_F2:
        return Icon.WHITE_DRESS2;
      case Vars.SHEET_CITIZEN_STORM_M1:
        return Icon.RED_ROBE;
    }
  }

  getNewSpritesheet() {
    const prefix = this.sprite.prefix;
    switch (prefix) {
      case Vars.SHEET_CITIZEN_STORM_F1:
        return Vars.SHEET_CITIZEN_STORM_F1A;
      case Vars.SHEET_CITIZEN_STORM_F2:
        return Phaser.Utils.Array.GetRandom([Vars.SHEET_CITIZEN_STORM_F2A, Vars.SHEET_CITIZEN_STORM_F2B]);
      case Vars.SHEET_CITIZEN_STORM_M1:
        return Vars.SHEET_CITIZEN_STORM_M1A;
    }
  }

  //  --------------------------------------------------------------------------

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

}
