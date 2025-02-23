import ActComplete from "../actions/ActComplete";
import ActMoveToTargetOffset from "../actions/ActMoveToTargetOffset";
import ActMoveToX from "../actions/ActMoveToX";
import ActWait from "../actions/ActWait";
import ActionManager from "../classes/ActionManager";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import ListenCondition from "../actions/ListenCondition";
import Vars from "../const/Vars";
import { getDistanceFrom, isNumberInRange } from "../util/ActionHelper";
import ActRepeatAtIntervals from "../actions/ActRepeatAtIntervals";
import Vfx from "../util/Vfx";
import Juke from "../util/Juke";
import Sfx from "../const/Sfx";

export default class CitizenWife extends ActionManager {

  constructor() {
    super();

    this.minX = Vars.AREA_WIDTH * 1.05;
    this.maxX = Vars.AREA_WIDTH * 1.95;
    this.idleX = Vars.AREA_WIDTH * 1.45;

    this.state = Enum.CS_IDLE;
    this.hunger = 5 + Phaser.Math.Between(5, 10);
    this.social = Phaser.Math.Between(1, 4);

    this.giftCounter = 0;
  }

  setDefaultActions() {

    const player = this.scene.player;
    const isPlayerInRange = isNumberInRange(player.x, this.minX, this.maxX);

    if (isPlayerInRange) {
      this.followPlayer();

      this.listenPlayerOOB();
      this.listenBGPlayerClose();
    }
    else {
      this.listenPlayerLocal();
      this.idlePosition();
    }

    this.giftTimer();
  }

  //  - Gift timer -

  giftTimer() {
    this.addBackgroundAction(new ActRepeatAtIntervals(()=>{
      this.giftCounter = Math.max(0, this.giftCounter - 1);
      return this.giftCounter === 0;
    }));
  }

  //  - Listen Close -

  listenBGPlayerClose() {
    
    const player = this.scene.player;
    const sprite = this.sprite;

    this.addBackgroundAction(new ListenCondition(()=>{
      return player.lane === 1 && getDistanceFrom(sprite.x, player.x) < 8;
    }))
    .addCallback(()=>{
      if (this.giftCounter <= 0) {
        this.clearAllActions();
        this.giveGift();
        this.giftCounter = 70;
      }
    });

  }

  /** Listener to check when Player is out of bounds (away from MaM) */
  listenPlayerOOB() {

    const player = this.scene.player;
    const oobListener = new ListenCondition(()=>{
      return !isNumberInRange(player.x, this.minX, this.maxX);
    });
    oobListener.alterName(1);

    this.addBackgroundAction(oobListener).addCallback(()=>{
      this.clearAllActions();
    });
  }

  //  - Player too far -
  
  /** Listener to check when Player is in Moon at Midnight */
  listenPlayerLocal() {
    const player = this.scene.player;
    this.addBackgroundAction(new ListenCondition(()=>{
      return isNumberInRange(player.x, this.minX, this.maxX);
    }))
    .addCallback(()=>{
      this.clearAllActions();
    })
  }

  //  - Follow -

  followPlayer() {

    const player = this.scene.player;
    const sprite = this.sprite;
    const time = 4 * 1000;
    
    //  Move within range
    if (getDistanceFrom(sprite.x, player.x) > 50) {
      const offset = sprite.uid === Enum.ID_MOON_ROSE ? -28: 28;
      this.addActions(
        new ActMoveToTargetOffset(sprite, player, offset),
        new ActWait(500),
      );
    }

    //  Show love
    this.addActions(
      new ActComplete(()=>{
        sprite.showIcon(Icon.HEART, time);
      }),
      new ActWait(time),
      new ActComplete(()=>{
        sprite.setState(Enum.CS_IDLE);
      })
    )
  }

  //  - Gift -

  giveGift() {

    this.addActions(
      new ActComplete(()=>{
        if (this.isRose) {
          this.applyRoseHealing();
        }
        else {
          this.applyGlowPowerup();
        }
      }),
      new ActWait(5000)
    );
  }

  applyRoseHealing() {

    const sprite = this.sprite;
    const player = this.scene.player;

    if (player.getHPPercent() < 1 || player.getGPPercent() < 1) {
      sprite.speak(Icon.ALLY_SHIELD, "You look weary my love, let me heal you.", 5000);
      Juke.PlaySound(Sfx.HEAL);

      player.recoverHP(player.maxHP);
      player.recoverGP(player.maxGP);

      Vfx.ShowAnimatedFX(player, Vars.VFX_CONSUME);
      Juke.PlaySound(Sfx.HEAL);
    }
    else {
      sprite.speak(Icon.SPEECH_HEART, "Come home soon, OK.", 5000);
    }
  }

  applyGlowPowerup() {

    const sprite = this.sprite;
    const player = this.scene.player;

    if (player.attBoost === 0) {
      
      sprite.speak(Icon.ALLY_SWORD, "Moon, my love, let me invigorate you.", 5000);
      player.boostAttack(10);

      Vfx.ShowAnimatedFX(this.scene.player, Vars.VFX_CONSUME2);
      Juke.PlaySound(Sfx.ATTACK_BOOST);
    }
    else {
      sprite.speak(Icon.SPEECH_HEART, "Finish your business quickly and come home, OK.", 5000);
    }
  }

  //  - Idle -

  idlePosition() {
    const offset = 20 * this.offsetMul;
    this.addActions(
      new ActMoveToX(this.sprite, this.idleX + offset),
      new ActWait(60 * 1000)
    );
  }

  //  - Distinguish between wives -

  /** Rose (Red eyes) deals with healing / Glow (Black eyes) deals with offence */
  get isRose() {
    return this.sprite.uid === Enum.ID_MOON_ROSE;
  }

  get offsetMul() {
    return this.isRose ? -1 : 1;
  }

}