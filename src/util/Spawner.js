import Enum from "../const/Enum";
import SoldierMap from "../const/SoldierMap";
import Vars from "../const/Vars";
import Citizen from "../gameobjects/Citizen";
import ClaimFlag from "../gameobjects/ClaimFlag";
import Soldier from "../gameobjects/Soldier";
import Subtitles from "./Subtitles";

/** Handle all spawning in this class */
export default class Spawner {

  constructor(scene) {
    this.scene = scene;
    
    this.groupSoldiers = scene.groupSoldiers;
    this.groupAllies = scene.groupAllies;
    this.groupEnemies = scene.groupEnemies;
    // BG elements, Rocks
  }

  /** Spawn a Soldier Sprite with the given pos and spritesheet */
  spawnSoldierBase(posX, lane, sheet) {
    const sprite = new Soldier(this.scene, posX, Vars.GROUND_TOP + 1 + lane, sheet);
    sprite.setLane(lane);
    sprite.playIdle();
    this.groupSoldiers.add(sprite);
    return sprite;
  }

  /** Spawn the given type of Soldier and assign them a team */
  spawnSoldierType(pX, type, team) {
    
    const data = SoldierMap.get(type);
    const controller = new data.ctrl();
    const sheet = data.sheet;
    const lane = Phaser.Math.Between(1, 3);

    const soldier = this.spawnSoldierBase(pX, lane, sheet);
    soldier.setTeam(team);
    soldier.setController(controller);
    soldier.setType(type);
    
    return soldier;
  }

  //  - Specifics

  /** Spawn Player (Moon Chief) */
  spawnPlayer() {

    const camera = this.scene.cameras.main;
    const player = this.spawnSoldierBase(0, 1, Vars.SHEET_PLAYER);
    
    camera.startFollow(player, true, .8);
    player.setHP(3, 3);
    player.setGP(7, 7);
    player.setDisplayName(Subtitles.GetScript().Names.MoonChief, Enum.TEAM_PLAYER, 2);
    player.setTeam(Enum.TEAM_ALLY);
    player.setDepth(7);
    player.isPlayer = true;
    player.uid = Enum.ID_MOON_CHIEF;

    this.groupAllies.add(player);
    return player;
  }

  //  - Soldiers generic

  /** Generic allies */
  spawnAlly(pX, type) {

    const sprite = this.spawnSoldierType(pX, type, Enum.TEAM_ALLY);
    sprite.setHP(5, 5);
    sprite.setGP(5, 5);
    this.groupAllies.add(sprite);
    return sprite;
  }

  /** Spawn a given type of enemy */
  spawnEnemy(pX, type) {

    const camera = this.scene.cameras.main;
    const worldView = camera.worldView;
    const spawnPoint = Math.random() > .5 ? worldView.right + 20 : worldView.left - 20;
    const deployX = (pX ?? spawnPoint) + Phaser.Math.Between(-30, 30);
    
    const enemy = this.spawnSoldierType(deployX, type, Enum.TEAM_ENEMY);
    enemy.setDepth(2)
    this.groupEnemies.add(enemy);
    return enemy;
  }

  //  -

  spawnCitizen(pX, sheet) {

    const allGroup = this.scene.allGroup;
    const citGroup = this.scene.groupCitizens;
    const layer = this.scene.animalLayer;

    const citi = new Citizen(this.scene, pX, Vars.GROUND_TOP, sheet);

    allGroup.add(citi);
    citGroup.add(citi);
    layer.add(citi);

    return citi;
  }

  //  -

  spawnClaimerFlag(pX) {
    return new ClaimFlag(this.scene, pX);
  }

  spawnMaMFlag(pX) {
    const scene = this.scene;
    const flag = scene.physics.add.sprite(pX, Vars.GROUND_TOP, Vars.SHEET_ALL_BANNERS, 0).setOrigin(.5, 1);
    flag.play("banner_mam");
    flag.postFX.addShine();
    scene.fgLayer.add(flag);
  }

}

