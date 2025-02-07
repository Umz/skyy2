import ActComplete from "../actions/ActComplete";
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

  static Do(fn) {
    return new ActComplete(fn);
  }

  static WaitReady() {
    
  }

  static Die() {
    return new ActComplete().addCallback((action)=>{
      const sprite = action.sprite;
      const scene = action.scene;
      scene.tweens.add({
        targets: sprite,
        duration: 1000,
        alpha: {from:1, to:0},
        onComplete: ()=>{
          sprite.kill();
        }
      })
    });
  }

}
