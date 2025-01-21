import ActComplete from "../actions/ActComplete";
import ActMoveOffX from "../actions/ActMoveOffX";
import ActWait from "../actions/ActWait";
import ListenCondition from "../actions/ListenCondition";
import ActionManager from "../classes/ActionManager";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Vars from "../const/Vars";
import { getDistanceFrom } from "../util/ActionHelper";
import CitizenController from "./CitizenController";

export default class CitizenCaptive extends ActionManager {

  setDefaultActions() {
    this.waitForPlayer();
  }

  //  -

  gotoPlayer() {
    const sprite = this.sprite;
  }

  waitForPlayer() {

    const sprite = this.sprite;
    const player = this.scene.player;

    this.addBackgroundAction(
      new ListenCondition(()=>{
        return (player.lane === 1 && getDistanceFrom(sprite.x, player.x) < 18)
      })
      .addCallback(()=>{
        this.clearAllActions();
        this.showDecision();
      })
    )

    this.addActions(
      new ActComplete(()=>{
        sprite.showIcon(Icon.HAND_WAVE, 3000)
      }),
      new ActWait(5000)
    )
  }

  //  - Joining or Leaving -

  showDecision() {

    const sprite = this.sprite;
    const isJoining = sprite.getData('isJoining');

    const speech = isJoining ? this.getJoinSpeech() : this.getLeaveSpeech();
    const icon = isJoining ? Icon.BANNER : Icon.CROSS;

    //  - Showing gratitude -

    this.addActions(
      
      new ActComplete(()=>{
        sprite.setState(Enum.CS_BOWING);
      }),
      new ActWait(1750),
      new ActComplete(()=>{
        sprite.setState(Enum.CS_IDLE);
      }),

      new ActComplete(()=>{
        sprite.speak(icon, speech, 5000)
      }),
      new ActWait(5000)
    )

    //  - Action after speech -

    if (isJoining) {
      this.addActions(
        new ActComplete(()=>{

          sprite.setTribe(Enum.TRIBE_MAM);

          const controller = new CitizenController();
          sprite.setController(controller);
        })
      )
    }
    else {
      this.addActions(
        new ActComplete(()=>{
          sprite.setHome(0);
        }),
        new ActMoveOffX(sprite, Vars.AREA_WIDTH * .5),
        new ActComplete(()=>{
          this.scene.tweens.add({
            targets: sprite,
            duration: 1000,
            alpha: {from:1, to:0},
            onComplete: ()=>{
              sprite.kill();
            }
          })
        }),
        new ActMoveOffX(sprite, 100),
        new ListenCondition(()=>false)
      )
    }

  }

  getJoinSpeech() {
    const options = [
      "Moon at Midnight! I am honoured to fly with the tribe.",
      "Thank you brave warriors. I am with you now.",
      "You have saved us all. I will fly with Moon at Midnight.",
      "Freedom! May I be strong flying with Moon at Midnight!",
      "Take me with you! I will learn the ways of your tribe.",
      "We are yours now. Lead us to a brighter future.",
      "My spirit soars! I choose to fly with Moon at Midnight.",
      "I am no longer captive, I fly with Moon at Midnight!",
      "We are saved by your courage. I pledge my loyalty to you.",
      "I will fly with you and live for our tribe.",
      "Hope returns! I am ready to fly with Moon at Midnight.",
      "Thank you for freeing us. I am with you to the end.",
      "This is a new beginning! I am honored to fly with your tribe."
  ];
    return Phaser.Utils.Array.GetRandom(options);
  }

  getLeaveSpeech() {
    const options = [
      "Thank you kind warriors. I shall take my leave now.",
      "I am forever in your debt, but I must walk my own path.",
      "My heart is grateful, but I cannot join you. Farewell.",
      "You have given me freedom, and for that, I thank you.",
      "May your skies be clear. I must journey alone from here.",
      "I will never forget your kindness. I bid you farewell.",
      "My heart belongs elsewhere. Thank you, and goodbye.",
      "I wish you well, but my home waits in a different location.",
      "My land calls to me. Thank you for saving me.",
      "You have my gratitude, but I must seek my lost family.",
      "My spirit yearns for home. Thank you, and farewell."
    ];
    return Phaser.Utils.Array.GetRandom(options);
  }

}
