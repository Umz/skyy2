export default class SpriteController {

  constructor(sprite, controller) {
    this.sprite = sprite;
    this.controller = controller;
    this.active = true;
  }

  setActive(b = true) {
    this.active = b;
    if (!b) {
      const { sprite, controller } = this;
      sprite.stopMove();
      sprite.defend(false);
    }
  }

  update() {

    if (!this.active) {
      return;
    }

    const { sprite, controller } = this;

    controller.getPress(controller.left, ()=>{
      sprite.moveLeft();
    });
    controller.getPress(controller.right, ()=>{
      sprite.moveRight();
    });
    controller.getSingleRelease(controller.left, ()=>{
      sprite.stopMove();
    });
    controller.getSingleRelease(controller.right, ()=>{
      sprite.stopMove();
    });

    controller.getSinglePress(controller.up, ()=>{
      sprite.moveUp();
    });
    controller.getSinglePress(controller.down, ()=>{
      sprite.moveDown();
    });

    controller.getSinglePress(controller.attack, ()=>{
      sprite.attack();
    });

    controller.getSinglePress(controller.defend, ()=>{
      sprite.defend(true);
    });
    controller.getPress(controller.defend, ()=>{
      sprite.defend(true);
    });
    controller.getSingleRelease(controller.defend, ()=>{
      sprite.defend(false);
    });
  }
}