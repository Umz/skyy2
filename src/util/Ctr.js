import ActMoveToX from "../actions/ActMoveToX";
import ActWait from "../actions/ActWait";

export default class Ctr {

  static SetActions(soldier, ...actions) {
    const controller = soldier.controller;
    controller.clearAllActions();
    for (let aa of actions) {
      aa.setSprite(soldier);
      controller.addAction(aa);
    }
  }

  static MoveToX(toX) {
    return new ActMoveToX(null, toX);
  }

  static Wait(ttl) {
    return new ActWait(ttl);
  }

}
