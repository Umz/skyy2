import { Scene } from "phaser";
import TilemapBuilder from "../bg/TilemapBuilder";
import Scenery from "../bg/Scenery";
import MapBuilder from "../bg/MapBuilder";
import Shadow from "../bg/Shadow";
import Soldier from "../gameobjects/Soldier";
import Vars from "../util/Vars";
import KeyboardMapper from "../util/KeyboardMapper";
import ControlKeys from "../util/ControlKeys";
import SpriteController from "../util/SpriteController";
import MapTracker from "../util/MapTracker";
import Collectible from "../gameobjects/Collectible";
import BirdHandler from "../bg/BirdHandler";
import AnimalHandler from "../bg/AnimalHandler";
import Enum from "../util/Enum";
import Rock from "../gameobjects/Rock";
import SaveData from "../util/SaveData";
import Tutorial from "../classes/Tutorial";
import MapInfo from "../const/MapInfo";

export class PlayScene extends Scene {

  constructor() {
    super("PlayScene");
  }

  async create() {

    //  Graphics objects

    this.graphics = this.add.graphics();
    this.hpGraphics = this.add.graphics().setDepth(35);
    this.pointerGraphics = this.add.graphics().setDepth(36);

    //  Groups

    this.birdGroup = this.add.group({runChildUpdate:true});

    this.allGroup = this.add.group({runChildUpdate: true});
    this.groupRocks = this.add.group();
    this.groupCollectibles = this.add.group();
    
    this.groupSoldiers = this.add.group({runChildUpdate:true});
    this.groupAllies = this.add.group();
    this.groupEnemies = this.add.group();

    //  Display layers

    this.sceneryLayer = this.add.layer();
    this.birdLayer = this.add.layer();
    this.tilemapLayer = this.add.layer();

    this.shadowLayer = this.add.layer();
    this.bgLayer = this.add.layer();
    this.buildingsLayer = this.add.layer();
    this.fgLayer = this.add.layer();
    this.animalLayer = this.add.layer();

    this.lane_1 = this.add.layer().setDepth(10);
    this.lane_2 = this.add.layer().setDepth(20);
    this.lane_3 = this.add.layer().setDepth(30);

    //  Camera setup

    const camera = this.cameras.main;
    const areaWidth = Vars.AREA_WIDTH;
    const fullWorld = areaWidth * 8;
    camera.setBounds(0, 0, fullWorld, camera.height);

    //  Create Player

    this.player = this.spawnPlayer();

    //  Utilities and Game objects

    this.mapTracker = new MapTracker();   // Player location on map
    this.scenery = new Scenery(this);     // Background scenery
    this.tilemapBuilder = new TilemapBuilder(this, this.tilemapLayer);    // Tilemap builder (ground tiles)
    this.mapBuilder = new MapBuilder(this);   // Map builder (trees, locations)
    this.mapBuilder.setLayers({bgLayer:this.bgLayer, fgLayer:this.fgLayer, buildingsLayer:this.buildingsLayer});

    this.birdSpawner = new BirdHandler(this, this.birdLayer, this.birdGroup);  // Background birds spawner
    this.wildlifeSpawner = new AnimalHandler(this, this.animalLayer, this.birdGroup);  // Background animals spawner

    this.shadows = new Shadow(camera, this.graphics);
    this.shadows.createStaticShadowLines(this.buildingsLayer, this.bgLayer, this.fgLayer);
    this.shadows.addDynamicLayers(this.lane_1, this.lane_2, this.lane_3, this.animalLayer);
    this.shadows.setActiveLane(this.player);
    this.shadowLayer.add(this.graphics);

    //  Collisions

    this.physics.add.overlap(this.groupAllies, this.groupEnemies, this.allyEnemyCollision, null, this);   // Battle collisions
    this.physics.add.overlap(this.player, this.groupCollectibles, this.playerItemCollision, null, this); 
    this.physics.add.overlap(this.player, this.groupRocks, this.playerRockCollision, null, this);

    this.createEmitters();

    //  Controller

    const controllerKeys = new ControlKeys();
    const keyMapper = new KeyboardMapper(this);
    keyMapper.registerKeyboard(controllerKeys);
    this.controller = new SpriteController(this.player, controllerKeys);

    this.initialLoad = false;
    this.loadedGameData = await SaveData.LOAD_GAME_DATA();

    //  DEV  --------------------------------------------------------------------------

    this.tutorial = new Tutorial(this, controllerKeys, this.controller);

    this.test = function() {

      let target = this.player;
      let pp = target.getAttackPoint();
      //graphics.fillStyle(0xffffff, 1);
      //graphics.fillCircle(pp.x, pp.y, 1);
    }
  }

  /** Initial scene setup (first load) */
  setupScene() {

    const playerX = SaveData.Data.playerX;
    const playerLane = SaveData.Data.playerLane;

    this.player.setX(playerX);
    this.player.setLane(playerLane);

    const areaID = this.mapTracker.getCurrentAreaID(playerX);
    
    //  Build scene for area

    this.scenery.addFullScene(this.sceneryLayer, this.allGroup);
    this.tilemapBuilder.buildTilemapForArea(playerX);
    this.mapBuilder.buildMapForArea(playerX);

    //  Initialise map area

    const aID = Math.max(1, areaID);
    const areaInfo = MapInfo.find(info => info.locID === aID);
    const isForest = areaInfo.type === Enum.AREA_FOREST;
    this.birdSpawner.isForestArea = isForest;
    this.wildlifeSpawner.isForestArea = isForest;

    //  Map Tracker

    this.mapTracker.updateCurrentArea(playerX);

    this.spawnBlueMoon();

    this.initialLoad = true;
  }

  //  ---------------------------------------------------------------

  update(time, delta) {

    //  Wait until the data is loaded

    if (!this.initialLoad) {
      if (this.loadedGameData) {
        this.setupScene();
      }
      return true;
    }

    //  - Normal updating -
    
    this.tutorial.update();

    this.mapTracker.updateCurrentArea(this.player.x);
    this.mapTracker.updateAreaDisplayCount(delta);
    
    this.updateMapArea();
    this.updateMapBuilder();

    this.updateSpriteLayers();
    this.updateShadows();
    this.updateSaveData();

    this.birdSpawner.update(time, delta);
    this.wildlifeSpawner.update(time, delta);
    this.controller.update();   // Player Controller

    this.drawSoldierHP();       // HP and GP bars
    this.showSoldierNames();    // Soldier names
    this.showSoldierIcon();     // Icons for soldiers
    
    this.test();
  }

  //  UPDATE helper functions     -------------------------------------------------------------------------

  /** Update the layers of the Sprites according to their lane */
  updateSpriteLayers() {

    const allSprites = this.groupSoldiers.getChildren();

    for (let sprite of allSprites) {
      
      const lane = sprite.lane;
      const currentLayer = sprite.displayList;

      if (lane === 1 && currentLayer !== this.lane_1) {
        this.lane_1.add(sprite);
        sprite.laneSwitchTween();
      }
      else if (lane === 2 && currentLayer !== this.lane_2) {
        this.lane_2.add(sprite);
        sprite.laneSwitchTween();
      }
      else if (lane === 3 && currentLayer !== this.lane_3) {
        this.lane_3.add(sprite);
        sprite.laneSwitchTween();
      }

      sprite.updateLaneY();
    }
  }

  /** Draw shadows for the entire map and characters */
  updateShadows() {
    this.shadows.updateDynamicShadows();
    this.shadows.drawShadows();
  }

  /** Update the current map area as the Player moves */
  updateMapArea() {

    const currentAreaID = this.mapTracker.currentAreaID;

    if (this.mapTracker.updateLastAreaVisited()) {

      this.showAreaName(currentAreaID);
  
      SaveData.Data.location = currentAreaID;
      SaveData.SAVE_GAME_DATA();
    }

    //  Instant check for new area

    if (this.mapTracker.checkNewArea()) {

      //  Set-up rocks for mines  
      const areaInfo = MapInfo.find(info => info.locID === currentAreaID);
      if (areaInfo.locID == Enum.LOC_MINES) {
        this.spawnRocks(20);
      }
      else {
        this.clearRocks();
      }

      this.birdSpawner.resetCounts();
      this.wildlifeSpawner.resetCounts();
      
      this.birdSpawner.isForestArea = areaInfo.type === Enum.AREA_FOREST;
      this.wildlifeSpawner.isForestArea = areaInfo.type === Enum.AREA_FOREST;
    }
  }

  /** Update the camrea bounds as the Player moves to grow world */
  updateMapBuilder() {
    
    const camera = this.cameras.main;
    const view = camera.worldView;
    const worldWidth = Vars.AREA_WIDTH * 8;

    const leftCheckPosX = Math.max(1, view.left - 32);
    const rightCheckPosX = Math.min(worldWidth - 1, view.right + 32);

    const buildMap = (posX) => {
      this.tilemapBuilder.buildTilemapForArea(posX);
      this.mapBuilder.buildMapForArea(posX);
      this.shadows.createStaticShadowLines(this.buildingsLayer, this.bgLayer, this.fgLayer);
    }

    if (this.mapTracker.isFirstTimeInAreaThisSession(leftCheckPosX)) {
      buildMap(leftCheckPosX);
    }

    if (this.mapTracker.isFirstTimeInAreaThisSession(rightCheckPosX)) {
      buildMap(rightCheckPosX);
    }
  }

  updateSaveData() {

    SaveData.Data.playerX = this.player.x;
    SaveData.Data.playerLane = this.player.lane;

    //  Play time

  }

  //  -----------------------------------------------------------------------------------------------------

  /** Show the name of the entered area shortly on screen */
  showAreaName(areaID) {

    const data = MapInfo.find(info => info.locID === areaID);

    const json = this.cache.json.get('hud_html');
    const template = json.area_enter_label;
    const html = template.replace('_label_', data.name);

    const camera = this.cameras.main;
    const domLabel = this.add.dom(camera.width * .5, camera.height * .6).createFromHTML(html).setOrigin(.5).setScrollFactor(0);
    this.tweens.add({
      targets: domLabel,
      duration: 500,
      delay: 2000,
      alpha: {from:1, to:0},
      onComplete: ()=>{
        domLabel.destroy(true);
      }
    });
  }

  //  -----------------------------------------------------------------------------------------

  createEmitters() {

    this.dustEmitter = this.add.particles(0, 0, 'atlas', {
      frame: ["pj_stone"],
      scale: { start: 1, end: .5 },
      alpha: { start: .6, end: 0 },
      speedX: { min: -50, max: 50 },
      speedY: { min: -10, max: 4 },
      lifespan: 1000,
      emitting: false,
      tint: 0xaaaaaa,
      tintFill: true
    });

    this.rockEmitter = this.add.particles(0,0, "atlas", {
      frame: ["particle_rock"],
      scale: { start: 1, end: .2 },
      alpha: { start: .6, end: .5 },
      speedX: { min: -50, max: 50 },
      speedY: { min: -50, max: 10 },
      lifespan: 500,
      emitting: false
    });

  }

  emitDust(x, y, lane) {
    this.dustEmitter.setDepth(lane * 10 + 1);
    this.dustEmitter.emitParticleAt(x, y, 6);
  }

  emitRock(x, y, lane) {
    this.rockEmitter.setDepth(lane * 10 + 1);
    this.rockEmitter.emitParticleAt(x, y, 12);
  }

  //  -----------------------------------------------------------------------------------------

  spawnSoldier(posX, lane, sheet) {

    const sprite = new Soldier(this, posX, Vars.GROUND_TOP + 1 + lane, sheet);
    sprite.playIdle();

    this.physics.add.existing(sprite);
    this.groupSoldiers.add(sprite);

    return sprite;
  }

  spawnPlayer() {

    const camera = this.cameras.main;
    const player = this.spawnSoldier(0, 1, Vars.SHEET_PLAYER);
    this.groupAllies.add(player);

    camera.startFollow(player, true, .8);
    player.setHP(1000, 1000);
    player.addDisplayName("Moon Chief", Enum.TEAM_PLAYER);
    player.setTeam(Enum.TEAM_ALLY);

    return player;
  }

  spawnWildman() {

    const spawnX = Vars.AREA_WIDTH * .5;
    const wildman = this.spawnSoldier(spawnX, 3, Vars.SHEET_WILDMAN);
    wildman.setHP(10, 10);
    wildman.addDisplayName("Wildman", Enum.TEAM_ALLY);
    wildman.setWildmanBrain();
    wildman.setTeam(Enum.TEAM_ALLY);

    this.groupAllies.add(wildman);

    return wildman;
  }

  spawnBlueMoon() {

    const blue = this.spawnSoldier(this.player.x + 24, 1, Vars.SHEET_WILDMAN);
    blue.setHP(10, 10);
    blue.addDisplayName("Blue Moon", Enum.TEAM_ALLY);
    blue.setTeam(Enum.TEAM_ALLY);
    blue.setBlueMoon();

    this.groupAllies.add(blue);

    return blue;
  }

  spawnAlly() {
  }

  spawnEnemy(posX) {
      
    const camera = this.cameras.main;
    const worldView = camera.worldView;
    const spawnPoint = Math.random() > .5 ? worldView.right + 20 : worldView.left - 20;

    const deployX = (posX ?? spawnPoint) + Phaser.Math.Between(-30, 30);
    const deployLane = Phaser.Math.Between(1, 3);

    const enemy = this.spawnSoldier(deployX, deployLane, Vars.SHEET_BANDIT_BLUE);
    enemy.setBandit();
    enemy.setTeam(Enum.TEAM_ENEMY);
    this.groupEnemies.add(enemy);

    return enemy;
  }

  spawnCollectible(posX, lane, type) {
    
    //  Collectible

    const frame = "collect_heart";
    // getFrame -

    const item = new Collectible(this, posX, 0, frame);
    item.initCollectible(lane);
    //item.setType(type);

    this.add.existing(item);
    this.physics.add.existing(item);
    this.groupCollectibles.add(item);
  }

  spawnRocks(amt) {

    for (let i=0; i<amt; i++) {

      const areaX = this.mapTracker.getAreaLeftX();
      const minX = areaX + Vars.AREA_WIDTH * .15;
      const maxX = areaX + Vars.AREA_WIDTH * .65;

      const rockX = Phaser.Math.Between(minX, maxX);
      const rockLane = Phaser.Math.Between(1, 3);

      const rock = new Rock(this, rockX, Vars.GROUND_TOP);
      rock.setLane(rockLane);

      this.allGroup.add(rock);
      this.groupRocks.add(rock);
      this.add.existing(rock);
      this.physics.add.existing(rock);
    }
    
  }

  clearRocks() {
    this.groupRocks.clear(true, true);
  }

  spawnEnemies(amt, posX) {
    const count = this.groupEnemies.countActive();
    for (let i=0; i<amt; i++) {
      this.spawnEnemy(posX);
    }
  }

  //  -

  countEnemies() {
    const count = this.groupEnemies.countActive();
    return count;
  }

  //  -----------------------------------------------------------------------------------------

  allyEnemyCollision(ally, en) {

    const checkAttack = function(attacker, defender) {
      const point = attacker.getAttackPoint();
      if (defender.hitboxContainsX(point.x)) {

        // M<ust be facing enemy to defend
        if (defender.isState(Enum.SS_DEFEND) && defender.isFacing(attacker.x)) {
          attacker.recoil(16);
          attacker.setTint(0xffa500);
          defender.kickback(2, attacker.x);
          // And delay
        }
        else {
          attacker.recoil(4);
          defender.hit(attacker);
        }
      }
    }
  
    const sameLane = ally.isLane(en.lane);
    if (sameLane) {

      // if both attacking - check clash (some types, beat others)
      // some blocks are parries

      if (ally.isState(Enum.SS_ATTACK) && en.isState(Enum.SS_ATTACK)) {
        ally.recoil(16);
        en.recoil(16);
        ally.setTintFill(0xFFFFFF);
        en.setTintFill(0xFFFFFF);
      }
      if (ally.isState(Enum.SS_ATTACK)) {
        checkAttack(ally, en);
      }
      else if (en.isState(Enum.SS_ATTACK)) {
        checkAttack(en, ally);
      }
    }

    // scaleX .9
    // kick back
  }

  playerItemCollision(player, item) {
    if (player.lane === item.lane) {
      item.collectAndDestroy();
      //  Apply effects of collected item and VFX
    }
  }

  /** Rock when soldier attacks a rock overlap */
  playerRockCollision(sprite, rock) {

    const point = sprite.getAttackPoint();
    
    const r = rock.getBounds();
    const rockLeft = r.left;
    const rockRight = r.right;
    
    const contains = (point.x >= rockLeft && point.x <= rockRight);
    
    if (sprite.isState(Enum.SS_ATTACK) && sprite.isLane(rock.lane) && contains) {
      sprite.recoil(2);
      this.emitDust(rock.x, rock.y, rock.lane);
      this.emitRock(rock.x, rock.getCenter().y);
      // Tween expand and vanish
      this.tweens.add({
        targets: rock,
        duration: 500,
        scaleX: {from:1, to:1.5},
        scaleY: {from:1, to:1.5},
        alpha: {from:1, to:0},
        onComplete: ()=>{
          rock.destroy();
        }
      });
    }
  }

  //  -----------------------------------------------------------------------------------------

  drawSoldierHP() {

    this.hpGraphics.clear();
    
    let soldiers = this.groupSoldiers.getChildren();

    for (let soldier of soldiers) {

      const lt = soldier.getTopLeft();
      const barX = lt.x;

      const guardY = lt.y - 2;
      const hpY = soldier.isState(Enum.SS_DEFEND) ? guardY - 4 : lt.y - 1;

      const barMax = soldier.width;
      const barHeight = 3;
      
      const percentHP = soldier.hp / soldier.maxHP;
      const hpBar = (barMax - 2) * percentHP;

      const percentGuard = soldier.gp / soldier.maxGP;
      const guardBar = (barMax - 2) * percentGuard;

      const barCol = soldier.isAlly() ? 0x00ff00 : 0xff0000;

      // Black bar with hp inside it

      if (soldier.hp < soldier.maxHP) {
        this.hpGraphics.fillStyle(0x000000, .5);
        this.hpGraphics.fillRect(barX, hpY, barMax, barHeight);
        this.hpGraphics.fillStyle(barCol, 1);
        this.hpGraphics.fillRect(barX + 1, hpY + 1, hpBar, barHeight - 2);
      }

      //  Draw Guard bar when defending

      if (soldier.isState(Enum.SS_DEFEND)) {
        this.hpGraphics.fillStyle(0x000000, .5);
        this.hpGraphics.fillRect(barX, guardY, barMax, barHeight);
        this.hpGraphics.fillStyle(0x0055ff, 1);
        this.hpGraphics.fillRect(barX + 1, guardY + 1, guardBar, barHeight - 2);
      }
    }
  }

  showSoldierNames() {

    const allies = this.groupAllies.getChildren();
    for (let ally of allies) {

      if (ally.displayName) {
        const dom = ally.displayName;
        const pos = ally.getTopCenter();
        
        const velX = Math.abs(ally.velocityX);
        const pY = (velX > 24) || ally.isState(Enum.SS_DEFEND) ? -24 : pos.y;
        dom.setPosition(pos.x, pY);
      }
    }
  }

  showSoldierIcon() {

    const graphics = this.pointerGraphics;
    graphics.clear();

    const allSoldiers = this.groupSoldiers.getChildren();
    for (let soldier of allSoldiers) {

      const tc = soldier.getBottomCenter();
      const tX = soldier.flipX ? tc.x + 3 : tc.x - 6; 
      const tY = tc.y + 4;

      const col = soldier.isAlly() ? 0xcccccc : 0xff0000;

      graphics.fillStyle(0x000000, .5);
      graphics.fillTriangle(tX, tY + 5, tX + 4, tY + 5, tX + 2, tY + 1);

      graphics.fillStyle(col, 1);
      graphics.fillTriangle(tX, tY + 4, tX + 4, tY + 4, tX + 2, tY);

    }

  }
}
