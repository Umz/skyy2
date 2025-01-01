
const data = {
  scene: null
}

export default class PartHelper {

  static GetEnemyCount() {
    return scene.countEnemies();
  }

  static SetScene(scene) {
    data.scene = scene;
  }
}