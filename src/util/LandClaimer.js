import Enum from "../const/Enum";
import Vars from "../const/Vars";
import Counter from "./Counter";

/** Handle all claiming of new territory in this class */
export default class LandClaimer {

  constructor(scene) {
    this.scene = scene;

    this.landClaimCounter = 0;
    this.landCooldown = 0;
    this.landClaimTime = 17 * 1000;
    this.landClaimNoticeTime = 4000;

    this.lcCounter = new Counter(17 * 1000).setLooping(false);

    //  Sparkle FX around player while land is being claimed

    this.fx = this.scene.add.sprite(-20, 0, 'consume0').setOrigin(.5, 1).setVisible(false);
    this.fx.play("consume0");
  }

  update(delta) {

  }

  updateLandAnnex(delta) {

    if (this.landCooldown > 0) {

      const isComplete = this.lcCounter.update(delta);
      if (isComplete) {
        this.addLandToClaimed();
        this.showClaimMessage();
        this.hideLandClaim();
        this.resetClaimCounts();
      }
      else {
        this.showClaimFX();
      }
    }
    else {
      this.lcCounter.reverse(delta, 2);
      this.hideclaimFX();
    }

    this.updateDOM();

    this.landCooldown = Math.max(0, this.landCooldown - delta);

    if (this.landClaimNoticeTime > 0) {
      this.landClaimNoticeTime = Math.max(0, this.landClaimNoticeTime - delta);
      if (this.landClaimNoticeTime === 0) {
        this.hideClaimMessage();
      }
    }
  }

  //  - DOM effects

  updateDOM() {

    // When to hide DOM completely - when complete

    const percent = this.lcCounter.getPercent();
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

    const lane = this.player.lane;
    const tc = this.player.getBottomCenter();
    const tX = this.player.flipX ? tc.x + 6 : tc.x - 6;

    this.fx.setPosition(tX, tc.y);
    this.fx.setDepth(lane * 10 + 1);
    this.fx.setVisible(true);

  }

  hideclaimFX() {
    this.fx.setVisible(false);
    this.stopEmitter();
  }

  showEmitter() {
    
    const camera = this.scene.cameras.main;
    const view = camera.worldView;
    this.claimEmitter.setPosition(view.left, view.top);

    if (!this.claimEmitter.emitting) {
      this.claimEmitter.start();
    }
  }

  stopEmitter() {
    if (this.claimEmitter.emitting) {
      this.claimEmitter.stop();
    }
  }

}