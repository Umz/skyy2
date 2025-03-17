import ActionManager from "../classes/ActionManager";
import ActComplete from "../actions/ActComplete";
import ActMoveOffX from "../actions/ActMoveOffX";
import ActWait from "../actions/ActWait";
import CitizenStorm from "./CitizenStorm";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Juke from "../util/Juke";
import ListenCondition from "../actions/ListenCondition";
import SaveData from "../util/SaveData";
import Sfx from "../const/Sfx";
import Subtitles from "../util/Subtitles";
import Vars from "../const/Vars";
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
        sprite.stopMove();
      }),
      new ActWait(1750),
      new ActComplete(()=>{
        sprite.setState(Enum.CS_IDLE);
      }),

      new ActComplete(()=>{
        sprite.speak(icon, speech, 5000);
        this.playVoice(isJoining);
      }),
      new ActWait(5000)
    )

    //  - Action after speech -

    if (isJoining) {
      this.addActions(
        new ActComplete(()=>{
          sprite.setTribe(Enum.TRIBE_MAM);
          const controller = new CitizenStorm();
          sprite.setController(controller);
          SaveData.SaveCitizenData(sprite.getSaveData())
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

  playVoice(isJoining) {

    let isMale = this.sprite.prefix === Vars.SHEET_CITIZEN_STORM_M1;
    let sfx;

    if (isJoining) {
      sfx = isMale ? Sfx.VOICE_LAUGH1 : Sfx.VOICEF_OH;
    }
    else {
      sfx = isMale ? Sfx.VOICE_SIGH1 : Sfx.VOICEF_UMMM;
    }

    Juke.PlaySound(sfx);
  }

  getJoinSpeech() {
    return Phaser.Utils.Array.GetRandom(Subtitles.GetScript().Captives.Joining);
  }

  getLeaveSpeech() {
    return Phaser.Utils.Array.GetRandom(Subtitles.GetScript().Captives.Leaving);
  }

}
