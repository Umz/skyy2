import P1 from "../tutorial/P1";
import P2 from "../tutorial/P2";
import P3 from "../tutorial/P3";
import P4 from "../tutorial/P4";
import Story from "../util/Story";

export default class Tutorial {

  constructor(scene, controller, spriteController) {
    
    this.scene = scene;
    this.controller = controller;
    this.spriteController = spriteController;
    this.controllerActive = false;

    this.tutorialNumber = 1;
    this.part = null;
  }

  update() {

    if (this.controllerActive) {
      const { controller } = this;
      controller.getSinglePress(controller.attack, ()=>{
        this.controllerActive = false;
        this.hideInstructions();
      });
    }

    if (!this.part) {
      this.part = this.getNextPart();
      if (this.part) {
        this.tutorialNumber ++;
      }
    }
    else {
      const isComplete = this.part.update();
      if (isComplete) {
        this.part = null;
      }
    }
  }

  showInstructions(storyID) {
    
    this.spriteController.setActive(false);
    this.controllerActive = true;
    Story.ShowStory(storyID);
  }

  hideInstructions() {

    this.spriteController.setActive();
    this.controllerActive = false;
    Story.HideStory();
    this.part.nextStep();
  }

  getNextPart() {
    switch (this.tutorialNumber) {
      case 1: return new P1(this);
      case 2: return new P2(this);
      case 3: return new P3(this);
      case 4: return new P4(this);
    }
    return null;
  }

}