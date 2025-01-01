import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";

export default class P5 extends TutorialSequence {

  init() {
    const { scene } = this;

    this
    .add(()=>{
      return this.checkCount(1000);
    })
    .add(()=>{
      this.spawnConstant(1, 6);
      return false;
    })

  }

  spawnConstant(minEns, amt = 2) {
    const { scene } = this;
    const enemyCount = scene.countEnemies();
    if (enemyCount < minEns) {
      for (let i=0; i<amt; i++) {
        const type = Phaser.Utils.Array.GetRandom([Enum.SOLDIER_BANDIT1, Enum.SOLDIER_BANDIT2]);
        scene.spawnEnemy(null, type);
      }
    }
  }

}