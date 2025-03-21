import MapInfo from "../const/MapInfo";
import Sfx from "../const/Sfx";
import Vars from "../const/Vars";
import Counter from "./Counter";
import Juke from "./Juke";
import SaveData from "./SaveData";

/** Handle all claiming of new territory in this class */
export default class LandClaimer {

  constructor(scene) {
    this.scene = scene;

    this.claimCounter = new Counter(10 * 1000).setLooping(false);
    this.cooldownCounter = new Counter(100).setLooping(false);    // Cooldown > 100ms NOT overlapping the claim flag
    this.noticeCounter = new Counter(4000).setLooping(false).pause();

    //  Sparkle FX around player while land is being claimed

    this.fx = this.scene.add.sprite(-20, 0, Vars.VFX_CLAIM).setOrigin(.5, 1).setVisible(false);
    this.fx.play(Vars.VFX_CLAIM);
  }

  update(delta) {

    // Counts to 100ms when NOT overlapping the claim flag, then starts removing claim

    if (!this.cooldownCounter.update(delta)) {
      this.showClaimFX();
      const isComplete = this.claimCounter.update(delta);
      if (isComplete) {
        this.claimTerritory();
      }
    }
    else {
      this.claimCounter.reverse(delta, 2);
      this.hideclaimFX();
    }

    this.cooldownCounter.update(delta);
    this.updateDOM();

    //  - Show claim notice message

    if (this.noticeCounter.isCounting) {
      this.showClaimNotice();
      if (this.noticeCounter.update(delta)) {
        this.hideClaimNotice();
      }
    }
  }

  setClaiming() {
    this.cooldownCounter.resetCount();
  }

  resetClaimCounts() {
    this.claimCounter.resetCount(100);
    this.cooldownCounter.resetCount();
  }

  //  - Claim new territory

  claimTerritory() {

    //  Add land to claimed

    const locID = SaveData.Data.location;
    const allClaimed = SaveData.Data.claimed;
    if (!allClaimed.includes(locID)) {
      SaveData.Data.claimed.push(locID);
    }

    //  Display message to Player

    this.showClaimNotice();
    this.resetClaimCounts();
  }

  showClaimNotice() {

    const map = MapInfo.get(SaveData.Data.location);
    const element = document.getElementById("annex-notice");
    element.innerText = `${map.name} Annexed`;
    
    this.noticeCounter.resume();

    Juke.PlaySound(Sfx.LAND_CLAIMED);
  }

  hideClaimNotice() {

    const element = document.getElementById("annex-notice");
    element.innerText = "";

    this.noticeCounter.resetCount();
    this.noticeCounter.pause();
  }

  //  - DOM effects

  updateDOM() {

    // When to hide DOM completely - when complete

    const percent = this.claimCounter.getPercent();
    const display = percent > 0 ? "block" : "none";

    const element = document.getElementById("annex-bar-holder");
    element.style.display = display;
    
    const fill = document.getElementById("annex-bar-fill");
    fill.style.width = `${percent}%`;
  }

  //  - VFX while claiming land

  /** Show all the effects for claiming land - sparkles */
  showClaimFX() {
    
    this.showEmitter();

    const player = this.scene.player;
    const lane = player.lane;
    const tc = player.getBottomCenter();
    const tX = player.flipX ? tc.x + 6 : tc.x - 6;

    this.fx.setPosition(tX, tc.y);
    this.fx.setDepth(lane * 10 + 1);
    this.fx.setVisible(true);

    Juke.PlaySound(Sfx.CLAIMING);
  }

  hideclaimFX() {
    this.fx.setVisible(false);
    this.stopEmitter();

    Juke.StopSound(Sfx.CLAIMING);
  }

  showEmitter() {
    
    const camera = this.scene.cameras.main;
    const view = camera.worldView;
    const emitter = this.scene.claimEmitter;
    emitter.setPosition(view.left, view.top);

    if (!emitter.emitting) {
      emitter.start();
    }
  }

  stopEmitter() {
    const emitter = this.scene.claimEmitter;
    if (emitter.emitting) {
      emitter.stop();
    }
  }

}
