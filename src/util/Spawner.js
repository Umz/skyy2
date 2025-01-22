import AllyHeavy1 from "../ai/AllyHeavy1";
import AllyLight1 from "../ai/AllyLight1";
import Bandit1 from "../ai/Bandit1";
import Bandit2 from "../ai/Bandit2";
import Bandit3 from "../ai/Bandit3";
import BanditBoss from "../ai/BanditBoss";
import Blank from "../ai/Blank";
import BlueMoon from "../ai/BlueMoon";
import NightTrain from "../ai/Nighttrain";
import Wildman from "../ai/Wildman";
import Enum from "../const/Enum";
import Vars from "../const/Vars";
import Citizen from "../gameobjects/Citizen";
import ClaimFlag from "../gameobjects/ClaimFlag";
import Soldier from "../gameobjects/Soldier";

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
    wildman.setDisplayName("Wildman", Enum.TEAM_ALLY);
    this.groupAllies.add(wildman);
    return wildman;
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

// Stats will be HP ATT - avoid for this game

const SoldierMap = new Map([

  [Enum.SOLDIER_PLAYER, {ctrl: Blank, sheet:Vars.SHEET_PLAYER}],
  [Enum.SOLDIER_WILDMAN, {ctrl: Wildman, sheet:Vars.SHEET_WILDMAN}],
  [Enum.SOLDIER_BLUEMOON, {ctrl: BlueMoon, sheet:Vars.SHEET_WILDMAN}],
  [Enum.SOLDIER_NIGHTTRAIN, {ctrl: NightTrain, sheet:Vars.SHEET_MAM_SUPPLY}],

  [Enum.SOLDIER_ALLY_HEAVY1, {ctrl: AllyHeavy1, sheet:Vars.SHEET_MAM_HEAVY}],
  [Enum.SOLDIER_ALLY_INFANTRY1, {ctrl: AllyHeavy1, sheet:Vars.SHEET_MAM_INFANTRY}],
  [Enum.SOLDIER_ALLY_LANCER1, {ctrl: AllyHeavy1, sheet:Vars.SHEET_MAM_LANCER}],
  [Enum.SOLDIER_ALLY_WILDMAN, {ctrl: AllyLight1, sheet:Vars.SHEET_WILDMAN_CREW}],

  [Enum.SOLDIER_BANDIT1, {ctrl: Bandit1, sheet:Vars.SHEET_BLUE_BANDIT}],
  [Enum.SOLDIER_BANDIT2, {ctrl: Bandit2, sheet:Vars.SHEET_BLUE_BANDIT_LANCE}],
  [Enum.SOLDIER_BANDIT_BOSS, {ctrl: BanditBoss, sheet:Vars.SHEET_BLUE_BANDIT_BOSS}],

  [Enum.SOLDIER_RED1, {ctrl: Bandit1, sheet:Vars.SHEET_RED_BANDIT}],
  [Enum.SOLDIER_RED2, {ctrl: Bandit1, sheet:Vars.SHEET_RED_HEAVY_BANDIT}],
  [Enum.SOLDIER_RED3, {ctrl: Bandit3, sheet:Vars.SHEET_RED_BANDIT}],
  [Enum.SOLDIER_REDFACE, {ctrl: BanditBoss, sheet:Vars.SHEET_RED_FACE}],
]);
