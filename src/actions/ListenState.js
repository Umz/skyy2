import Action from "../classes/Action";
import Vars from "../const/Vars";

export default class ListenState extends Action {

  constructor(sprite, stateToListenFor) {
    super(Vars.LISTEN_STATE, sprite);
    this.listenForState = stateToListenFor;
  }

  update(time, delta) {
    if (this.sprite.isState(this.listenForState)) {
      this.setComplete();
    }
  }

}
