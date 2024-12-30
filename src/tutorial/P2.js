import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";

export default class P2 extends TutorialSequence {

  init() {
    const { scene } = this;

    this
    .add(()=>{
      return this.checkCount(2000);
    })
    .add(()=>{
      this.doOnce(()=>{
        this.tutorial.showInstructions(Enum.STORY_1A_APPRENTICE);
      });
    })
    .add(()=>{
      this.doOnce(()=>{
        scene.spawnEnemies(2);
      });
      return scene.countEnemies() === 0;
    })

  }

}