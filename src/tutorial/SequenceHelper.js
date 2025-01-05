import SaveData from "../util/SaveData";

let scene = null;
let tutorial = null;

export default class SequenceHelper {

  static ShowConversation(id) {
    tutorial.showConversation(id);
    return true;
  }

  static CheckConversationComplete() {
    return tutorial.isConversationComplete();
  }

  static ShowInstructions(id) {
    tutorial.showInstructions(id);
  }

  static SpawnClaimerFlag(posX) {
    scene.spawnClaimerFlag(posX);
  }

  //  -

  static SpawnAlly(pX, type) {
    return scene.spawnAlly(pX, type);
  }

  // -

  static SpawnEnemies(amt, types) {
    for (let i=0; i<amt; i++) {
      const type = Phaser.Utils.Array.GetRandom(types);
      scene.spawnEnemy(null, type);
    }
  }

  static SpawnEnemiesAt(pX, amt, types) {
    for (let i=0; i<amt; i++) {
      const type = Phaser.Utils.Array.GetRandom(types);
      scene.spawnEnemy(pX, type);
    }
  }

  static SpawnConstant(minEnemies, amountToAdd, types) {
    const enemyCount = scene.countEnemies();
    if (enemyCount < minEnemies) {
      this.SpawnEnemies(amountToAdd, types);
    }
  }

  //  -

  static CheckLocation(loc) {
    return loc === SaveData.Data.location;
  }

  static CheckEnemiesMoreThan(amt) {
    return scene.countEnemies() > amt;
  }

  static CheckEnemiesLessOrEqual(amt) {
    return scene.countEnemies() <= amt;
  }

  //  -

  static GetEnemyCount() {
    return scene.countEnemies();
  }

  static SetScene(tut) {
    tutorial = tut;
    scene = tut.scene;
  }
}