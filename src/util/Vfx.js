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
  static ShowDamageNum(x, y, amt, dir, col = '#f00') {

    const shadow = scene.add.text(x + 1, y + 1, amt, { // Slightly offset
      fontFamily: 'f-forward',
      fontSize: '8px',
      color: '#000' // Darker color for the shadow
    });

    // Show and fade very quickly.
    const dmg = scene.add.text(x, y, amt, {
			fontFamily: 'f-forward',
			fontSize: '8px',
			color: col
		});

    scene.tweens.add({
      targets: dmg,
      duration: 250,
      x: x + (24 * dir),
      y: y - 30,
      ease: 'Power2',
      onComplete: () => {
        scene.tweens.add({
          targets: dmg,
          duration: 500,
          alpha: 0,
          onComplete: () => {
            dmg.destroy();
          }
        });
      }
    });

    scene.tweens.add({
      targets: shadow,
      duration: 250,
      x: x + (25 * dir),
      y: y - 29,
      ease: 'Power2',
      onComplete: () => {
        scene.tweens.add({
          targets: shadow,
          duration: 500,
          alpha: 0,
          onComplete: () => {
            shadow.destroy();
          }
        });
      }
    });
  }

}
