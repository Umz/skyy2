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

  setDefaultActions() {

    const money = Phaser.Math.Between(10, 80);
    const food = 100;

    // Mining
    // Forage

    const isClothingUpgraded = this.sprite.getData("newClothes");
    if (!isClothingUpgraded && money >= 50) {
      this.gotoShopForNewClothes();
    }
    else {
      this.wander();  // This is work, forage, chat
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

  //  - Increase Money -

  getPaid_TEMP() {
    this.addActions(
      new ActWait(4000),
      new ActComplete(()=>{
        this.sprite.showIcon(Icon.GOLD_RING, 2000);
      }),
      new ActWait(2000)
    )
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
      //new ActWait(10 * 1000)
    )
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

  get saveID() { return 3 }
}
