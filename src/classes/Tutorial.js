import P1 from "../tutorial/P1";
import P2 from "../tutorial/P2";
import P3 from "../tutorial/P3";
import P4 from "../tutorial/P4";
import P5 from "../tutorial/P5";
import P6 from "../tutorial/P6";
import P7 from "../tutorial/P7";
import P8 from "../tutorial/P8";
import P9 from "../tutorial/P9";
import P10 from "../tutorial/P10";
import SequenceHelper from "../tutorial/SequenceHelper";
import SaveData from "../util/SaveData";
import StoryDOM from "../util/StoryDOM";
import P11 from "../tutorial/P11";
import Juke from "../util/Juke";
import Sfx from "../const/Sfx";

export default class Tutorial {

  constructor(scene, controller, spriteController) {
    
    this.scene = scene;
    this.controller = controller;
    this.spriteController = spriteController;
    this.controllerActive = false;

    this.tutorialNumber = 1;
    this.sequence = null;

    SequenceHelper.SetScene(this);
  }

  load() {
    this.tutorialNumber = SaveData.Data.tutorialNumber;
    const sequence = this.getNextPart();
    if (sequence) {
      this.sequence = sequence;
      this.sequence.startFrom(SaveData.Data.tutorialSequenceStep);
    }
  }

  saveNewTut() {
    SaveData.Data.tutorialSequenceStep = 0;
    SaveData.Data.tutorialNumber = this.tutorialNumber;
    SaveData.SAVE_GAME_DATA();
  }

  update() {

    if (this.controllerActive) {
      const { controller } = this;
      controller.getSinglePress(controller.attack, ()=>{
        this.controllerActive = false;
        this.hideInstructions();
      });
    }

    const activeSequence = this.sequence;
    if (activeSequence) {
      const isComplete = activeSequence.update();
      if (isComplete) {
        this.sequence = null;
        this.tutorialNumber ++;
        this.saveNewTut();
      }
    }
    else {
      this.sequence = this.getNextPart();
    }
  }

  showInstructions(arrey) {
    this.spriteController.setActive(false);
    this.controllerActive = true;
    StoryDOM.ShowInstruction(arrey);
  }

  showConversation(enu) {
    this.scene.convo.showConversation(enu);
  }

  isConversationComplete() {
    return !this.scene.convo.isConversing();
  }

  hideInstructions() {

    this.spriteController.setActive();
    this.controllerActive = false;
    StoryDOM.HideStory();
    Juke.PlaySound(Sfx.UI_CLOSE_INSTRUCTIONS);
    this.sequence.nextStep();
  }

  getNextPart() {
    switch (this.tutorialNumber) {
      case 1: return new P1(this);
      case 2: return new P2(this);
      case 3: return new P3(this);
      case 4: return new P4(this);
      case 5: return new P5(this);
      case 6: return new P6(this);
      case 7: return new P7(this);
      case 8: return new P8(this);
      case 9: return new P9(this);
      case 10: return new P10(this);
      case 11: return new P11(this);
    }
    return null;
  }

}