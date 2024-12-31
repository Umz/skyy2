import Bandit1 from "../ai/Bandit1";
import Blank from "../ai/Blank";
import BlueMoon from "../ai/BlueMoon";
import Wildman from "../ai/Wildman";
import Enum from "../const/Enum";
import Vars from "../const/Vars";
import Soldier from "../gameobjects/Soldier";

/** Handle all spawning in this class */
export default class Spawner {

  constructor(scene) {
    this.scene = scene;
    this.groupSoldiers = scene.groupSoldiers;
    this.groupAllies = scene.groupAllies;
    this.groupEnemies = scene.groupEnemies;
  }

  /** Spawn a Soldier Sprite with the given pos and spritesheet */
  spawnSoldierBase(posX, lane, sheet) {
    const sprite = new Soldier(this.scene, posX, Vars.GROUND_TOP + 1 + lane, sheet);
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
    
    return soldier;
  }

  //  - Specifics

  /** Spawn Player (Moon Chief) */
  spawnPlayer() {

    const camera = this.scene.cameras.main;
    const player = this.spawnSoldierBase(0, 1, Vars.SHEET_PLAYER);
    
    camera.startFollow(player, true, .8);
    player.setHP(50, 50);
    player.setGP(7, 7);
    player.setDisplayName("Moon Chief", Enum.TEAM_PLAYER, 2);
    player.setTeam(Enum.TEAM_ALLY);
    player.isPlayer = true;

    this.groupAllies.add(player);
    return player;
  }

  spawnBlueMoon(pX) {
    const blue = this.spawnSoldierType(pX, Enum.SOLDIER_BLUEMOON, Enum.TEAM_ALLY);
    blue.setHP(35, 35);
    blue.setGP(10, 10);
    blue.setDisplayName("Blue Moon", Enum.TEAM_ALLY);
    this.groupAllies.add(blue);
    return blue;
  }

  spawnWildman() {

    const pX = Vars.AREA_WIDTH * .5;

    const wildman = this.spawnSoldierType(pX, Enum.SOLDIER_WILDMAN, Enum.TEAM_ALLY);
    wildman.setHP(25, 25);
    wildman.setGP(10, 10);
    wildman.setDisplayName("Blue Moon", Enum.TEAM_ALLY);
    this.groupAllies.add(wildman);
    return wildman;
  }

  //  - Soldiers generic

  /** Generic allies */
  spawnAlly(pX, type) {
    const wildman = this.spawnSoldierType(pX, type, Enum.TEAM_ALLY);
    wildman.setHP(25, 25);
    wildman.setGP(10, 10);
    wildman.setDisplayName("Blue Moon", Enum.TEAM_ALLY);
    this.groupAllies.add(wildman);
    return wildman;
  }

  /** Spawn a given type of enemy */
  spawnEnemy(pX, type) {

    const camera = this.cameras.main;
    const worldView = camera.worldView;
    const spawnPoint = Math.random() > .5 ? worldView.right + 20 : worldView.left - 20;
    const deployX = (pX ?? spawnPoint) + Phaser.Math.Between(-30, 30);
    
    const enemy = this.spawnSoldierType(deployX, type, Enum.TEAM_ENEMY);
    this.groupEnemies.add(enemy);
    return enemy;
  }

}

const SoldierMap = new Map([
  [Enum.SOLDIER_PLAYER, {ctrl: Blank, sheet:Vars.SHEET_PLAYER}],
  [Enum.SOLDIER_WILDMAN, {ctrl: Wildman, sheet:Vars.SHEET_WILDMAN}],
  [Enum.SOLDIER_BLUEMOON, {ctrl: BlueMoon, sheet:Vars.SHEET_WILDMAN}],

  [Enum.SOLDIER_BANDIT1, {ctrl: Bandit1, sheet:Vars.SHEET_BANDIT_BLUE}] // Stats will be HP ATT - avoid for this game
]);