import ListenStatsRecover from "../actions/ListenStatsRecover";
import ActionManager from "../classes/ActionManager";
import ActMoveToX from "../actions/ActMoveToX";
import ActWait from "../actions/ActWait";
import Icon from "../const/Icon";
import MapInfo from "../const/MapInfo";
import ActComplete from "../actions/ActComplete";

/** All Standby - The allies idle around specific posts while they wait for battle */
export default class AllyStandby extends ActionManager {

  setDefaultActions() {

    this.addBackgroundAction(new ListenStatsRecover(this.sprite));

    const distance = Phaser.Math.Between(10, 60);

    this.addActions(
      new ActComplete(()=>{
        this.sprite.towardsLane(3);
      }),
      new ActMoveToX(this.sprite, this.getFlagX(), distance),
      new ActWait(10 * 1000),
      new ActComplete(()=>{
        this.sprite.showIcon(Icon.BANNER, 5000)
      }),
      new ActWait(10 * 1000)
    );
  }

  //  -------------------------------------------------------

  getFlagX() {
    const map = MapInfo.get(this.sprite.home);
    const allFlags = map.flags;
    const flagX = Phaser.Utils.Array.GetRandom(allFlags);
    return flagX;
  }

}