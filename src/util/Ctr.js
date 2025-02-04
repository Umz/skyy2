import ActWait from "../actions/ActWait";

export default class Ctr {

  static ClearActions(soldier) {
    const controller = soldier.controller;
    controller.clearAllActions();
  }

  static MoveToX(soldier) {
    const controller = soldier.controller;
    // Add actions
  }

  static RetreatAndDie(soldier) {
    const controller = soldier.controller;
  }

  static Wait(soldier, ttl) {
    const controller = soldier.controller;
    controller.addActions(
      new ActWait(ttl)
    );
  }

}
