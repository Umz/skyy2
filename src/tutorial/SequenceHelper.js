import SaveData from "../util/SaveData";

let scene = null;
let tutorial = null;

export default class SequenceHelper {

  static SetScene(tut) {
    tutorial = tut;
    scene = tut.scene;
  }

  //  -

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

  static SpawnEnemy(pX, type) {
    return scene.spawnEnemy(pX, type);
  }

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

  //  -

  static GetCameraRight() {
    const camera = scene.cameras.main;
    const worldView = camera.worldView;
    return worldView.right;
  }

  static GetCameraLeft() {
    const camera = scene.cameras.main;
    const worldView = camera.worldView;
    return worldView.left;
  }

  static GetCameraWidth() {
    const camera = scene.cameras.main;
    const worldView = camera.worldView;
    return worldView.width;
  }
  
}