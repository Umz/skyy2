import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../util/Enum";

export default class P3 extends TutorialSequence {

  init() {
    const { scene } = this;

    this
    .add(()=>{
      return this.checkCount(2000);
    })
    .add(()=>{
      this.doOnce(()=>{
        this.tutorial.showInstructions(Enum.STORY_1B_APPRENTICE);
      });
    })
    .add(()=>{
      return this.spawnAndWait(2);
    })

    .add(()=>{
      return this.checkCount(1000);
    })
    .add(()=>{
      return this.spawnAndWait(4);
    })

    .add(()=>{
      return this.checkCount(1000);
    })
    .add(()=>{
      return this.spawnAndWait(5);
    })

    .add(()=>{
      return this.checkCount(1000);
    })
    .add(()=>{
      this.doOnce(()=>{
        this.tutorial.showInstructions(Enum.STORY_1C_BLUEFOREST);
      });
    })

    .add(()=>{
      return scene.countEnemies() === 0;
    })

  }

  //  -

  spawnAndWait(amt) {

    const { scene } = this;

    this.doOnce(()=>{
      scene.spawnEnemies(amt);
    });
    
    const enemyCount = scene.countEnemies();
    return enemyCount === 0;

  }

}