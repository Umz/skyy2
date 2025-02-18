import LiveVFX from "../gameobjects/LiveVFX";
import SpriteIcon from "../gameobjects/SpriteIcon";

let scene;

export default class Vfx {

  /** Set scene for this Util */
  static SetScene(scn) {
    scene = scn;
  }

  /** Shows an icon above the sprite for TTL */
  static ShowIcon(sprite, icon, ttl = 4000) {

    let current = null;
    scene.allGroup.children.iterate(function (si) {
      if (si.sprite === sprite) {
        current =  si;
        return false;
      }
    });

    const spriteIcon = current || new SpriteIcon(scene, sprite.x, sprite.y, icon);
    spriteIcon.show(sprite, icon, ttl);
    scene.allGroup.add(spriteIcon);
  }

  static ShowAnimatedFX(sprite, sheet) {
    const fx = new LiveVFX(scene, -20, 0, sheet);
    fx.play(sheet);
    fx.setSprite(sprite);
    scene.allGroup.add(fx);
  }

  /** Show the amount of damage */
  static ShowDamageNum(x, y, amt) {
    // Show and fade very quickly.
  }

}
