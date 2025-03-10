import ActComplete from "../actions/ActComplete";
import ActMoveOffX from "../actions/ActMoveOffX";
import ActWait from "../actions/ActWait";
import ListenCondition from "../actions/ListenCondition";
import ActionManager from "../classes/ActionManager";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Vars from "../const/Vars";
import CitizenController from "./CitizenController";
import SaveData from "../util/SaveData";
import { getClosestCitizen, getDistanceFrom } from "../util/ActionHelper";

export default class CitizenCaptive extends ActionManager {

  setDefaultActions() {
    this.spreadOut();
  }

  //  -

  spreadOut() {
    
    const sprite = this.sprite;
    const citizen = getClosestCitizen(this.sprite);

    if (getDistanceFrom(sprite.x, citizen.x) < 50 && citizen.tribe === Enum.TRIBE_STORM && citizen.home === Enum.LOC_STORM) {
      const moveDist = sprite.x - citizen.x;
      this.addAction(new ActMoveOffX(this.sprite, moveDist))
    }
    else {
      this.waveToPlayer();
    }

  }

  waveToPlayer() {

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
        sprite.showIcon(Icon.EXCLAIM, 1000);
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

          const index = SaveData.Data.citizens.findIndex(item => item.uid === sprite.uid);
          SaveData.Data.citizens[index] = sprite.getSaveData();
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
              SaveData.Data.citizens = SaveData.Data.citizens.filter(citData => citData.uid !== sprite.uid);
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
