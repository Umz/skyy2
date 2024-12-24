import Action from "../classes/Action";
import Counter from "../util/Counter";
import Enum from "../util/Enum";
import Vars from "../util/Vars";

export default class ListenStatsRecover extends Action {

  constructor(sprite) {
    super(Vars.LISTEN_STATS_RECOVER, sprite);
    this.hpCounter = new Counter(2500);
  }

  update(time, delta) {
    if (this.sprite.isState(Enum.SS_READY)) {
      if (this.hpCounter.update(delta)) {
        this.sprite.recoverGP(1);
      }
    }
  }

}
