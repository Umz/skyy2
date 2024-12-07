import P1 from "../tutorial/P1";
import P2 from "../tutorial/P2";
import Enum from "../util/Enum";
import Story from "../util/Story";

export default class Tutorial {

  constructor(controller, spriteController) {
    
    this.controllerActive = false;
    this.controller = controller;
    this.spriteController = spriteController;

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
    }
    return null;
  }

}