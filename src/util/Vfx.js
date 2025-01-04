import SpriteIcon from "../gameobjects/SpriteIcon";

let scene;

export default class Vfx {

  /** Set scene for this Util */
  static SetScene(scn) {
    scene = scn;
  }

  /** Shows an icon above the sprite for TTL */
  static ShowIcon(sprite, icon, ttl = 4000) {
    const spriteIcon = new SpriteIcon(scene, sprite.x, sprite.y, icon);
    spriteIcon.show(sprite, ttl);
    scene.allGroup.add(spriteIcon);
  }

}
