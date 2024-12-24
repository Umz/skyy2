import ActMoveToTargetDistance from "../actions/ActMoveToTargetDistance";
import ListenPlayerDistance from "../actions/ListenPlayerDistance";
import ActionManager from "../classes/ActionManager"

export default class BlueMoon extends ActionManager {

  constructor(sprite) {
    super(sprite);

    //  Listen for Player distance from Sprite

    this.listenForPlayerDistance();

  }

  setDefaultActions() {
    return true;
  }

  //  - LISTENERS -

  listenForPlayerDistance() {
    this.addBackgroundAction(new ListenPlayerDistance(this.sprite, 64)).addCallback(()=>{
      this.gotoPlayer();
    });
  }

  //  - ACTIONS -

  gotoPlayer() {
    const player = this.scene.player;
    this.addAction(new ActMoveToTargetDistance(this.sprite, player, 46)).addCallback(()=>{
      this.listenForPlayerDistance();
    });
  }

}