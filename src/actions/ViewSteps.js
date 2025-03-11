import Action from "../classes/Action";
import Enum from "../const/Enum";
import Sfx from "../const/Sfx";
import Vars from "../const/Vars";
import Counter from "../util/Counter";
import Juke from "../util/Juke";

/** Sound of Soldier walking (should only use for Player) */
export default class ViewSteps extends Action {

  constructor(sprite) {
    super(Vars.VIEW_SOLDIER_STEPS, sprite);
    this.counter = new Counter(500);
  }

  update(_, delta) {

    const velX = this.sprite.velocityX;
    if (this.sprite.isState(Enum.SS_READY) && velX !== 0) {
      if (this.counter.update(delta)) {
        const sound = Phaser.Utils.Array.GetRandom([Sfx.STEP1, Sfx.STEP2, Sfx.STEP3]);
        Juke.PlaySound(sound);
      }
    }
    else {
      this.counter.resetCount();
    }
  }

}
