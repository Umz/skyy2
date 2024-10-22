export default class SpriteController {

  constructor(sprite, controller) {
    this.sprite = sprite;
    this.controller = controller;
  }

  update() {

    const { sprite, controller } = this;

    controller.getPress(controller.left, ()=>{
      sprite.moveLeft();
    });
    controller.getPress(controller.right, ()=>{
      sprite.moveRight();
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
    });
  }
}