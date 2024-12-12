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

//  Move this MapInfo to Vars or to it's own JSON
const mapInfo = [
  {locID: Enum.LOC_BLUE_FOREST, name:"Blue Forest", type: Enum.AREA_FOREST},
  {locID: Enum.LOC_MAM, name:"Moon at Midnight", type: Enum.AREA_VILLAGE},
  {locID: Enum.LOC_ROSE_FOREST, name:"Rose Forest", type: Enum.AREA_FOREST},
  {locID: Enum.LOC_STORM, name:"Storm Village", type: Enum.AREA_VILLAGE},
  {locID: Enum.LOC_MINES, name:"The Mines", type: Enum.AREA_MISC},
  {locID: Enum.LOC_PLAINS, name:"Mario Plains", type: Enum.AREA_MISC},
  {locID: Enum.LOC_GREEN_FOREST, name:"Greenleaf Forest", type: Enum.AREA_FOREST},
  {locID: Enum.LOC_GREEN, name:"Green Village", type: Enum.AREA_VILLAGE}
];

const labelClassCSS = new Map([
  [Enum.TEAM_PLAYER, "player-name"],
  [Enum.TEAM_ALLY, "ally-name"],
  [Enum.TEAM_ENEMY, "enemy-name"]
]);

//  Tutorial - 
//  Go through the tutorial (1)
//  Refactory this scene

export class PlayScene extends Scene {

  constructor() {
    super("PlayScene");
  }

  async create() {

    //  Graphics objects

    const graphics = this.add.graphics();
    this.hpGraphics = this.add.graphics().setDepth(35);

    //  Groups

    const birdGroup = this.add.group({runChildUpdate:true});

    this.allGroup = this.add.group({runChildUpdate: true});
    this.groupRocks = this.add.group();
    this.groupCollectibles = this.add.group();
    
    this.group_soldiers = this.add.group({runChildUpdate:true});
    this.group_allies = this.add.group();
    this.group_enemies = this.add.group();

    //  Display layers

    this.sceneryLayer = this.add.layer();
    const birdLayer = this.add.layer();
    const tilemapLayer = this.add.layer();

    const shadowLayer = this.add.layer();
    this.bgLayer = this.add.layer();
    this.buildingsLayer = this.add.layer();
    this.fgLayer = this.add.layer();

    const animalLayer = this.add.layer();

    this.lane_1 = this.add.layer().setDepth(10);
    this.lane_2 = this.add.layer().setDepth(20);
    this.lane_3 = this.add.layer().setDepth(30);

    //  Objects

    const camera = this.cameras.main;

    //  Create Player Here

    this.player = this.spawnPlayer();

    //  Utilities and Game objects

    this.mapTracker = new MapTracker();   // Player location on map
    this.scenery = new Scenery(this);     // Background scenery

    this.tmBuilder = new TilemapBuilder(this, tilemapLayer);    // Tilemap builder (ground tiles)
    
    this.mapBuilder = new MapBuilder(this);   // Map builder (trees, locations)
    this.mapBuilder.setLayers({bgLayer:this.bgLayer, fgLayer:this.fgLayer, buildingsLayer:this.buildingsLayer});

    this.birdSpawner = new BirdHandler(this, birdLayer, birdGroup); // Background birds spawner
    this.wildlifeSpawner = new AnimalHandler(this, animalLayer, birdGroup); // Background animals spawner

    this.shadows = new Shadow(camera, graphics);
    this.shadows.createStaticShadowLines(this.buildingsLayer, this.bgLayer, this.fgLayer);
    this.shadows.addDynamicLayers(this.lane_1, this.lane_2, this.lane_3, animalLayer);
    this.shadows.setActiveLane(this.player);
    shadowLayer.add(graphics);

    //  Collisions

    this.physics.add.overlap(this.group_allies, this.group_enemies, this.allyEnemyCollision, null, this);   // Battle collisions
    this.physics.add.overlap(this.player, this.groupCollectibles, this.playerItemCollision, null, this); 
    this.physics.add.overlap(this.player, this.groupRocks, this.playerRockCollision, null, this);

    this.createEmitters();

    //  Controller

    const controllerKeys = new ControlKeys();
    const keyMapper = new KeyboardMapper(this);
    keyMapper.registerKeyboard(controllerKeys);
    this.controller = new SpriteController(this.player, controllerKeys);

    this.initLoad = false;
    this.gameData = await SaveData.LOAD_GAME_DATA();

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

    const playerX = this.gameData.playerX;
    const playerLane = this.gameData.playerLane;

    this.player.setX(playerX);
    this.player.setLane(playerLane);

    const areaID = this.mapTracker.getCurrentAreaID(playerX);
    
    //  Build scene for area

    this.scenery.addFullScene(this.sceneryLayer, this.allGroup);
    this.tmBuilder.buildTilemapForArea(playerX);
    this.mapBuilder.buildMapForArea(playerX);

    //  Initialise map area

    const areaInfo = mapInfo.find(info => info.locID === areaID);
    const isForest = areaInfo.type === Enum.AREA_FOREST;
    this.birdSpawner.isForestArea = isForest;
    this.wildlifeSpawner.isForestArea = isForest;

    //  Map Tracker

    this.mapTracker.updateAreaID(playerX);
    if (areaID === Enum.LOC_MINES) {
      this.spawnRocks(20);
    }
  }

  update(time, delta) {

    if (!this.initLoad) {
      if (this.gameData) {
        this.setupScene();
        this.initLoad = true;
      }
      return;
    }

    this.gameData.playerX = this.player.x;
    
    this.updateCameraBounds();    //  Update bounds according to Player location

    const newAreaID = this.mapTracker.checkForNewArea(delta, this.player.x);
    if (newAreaID >= 0) {

      SaveData.SAVE_GAME_DATA(this.gameData);

      this.showAreaName(newAreaID);

      const areaInfo = mapInfo.find(info => info.locID === newAreaID);

      if (areaInfo.locID == Enum.LOC_MINES) {
        this.spawnRocks(20);
      }
      else {
        this.clearRocks();
      }

      this.birdSpawner.resetCounts();
      this.birdSpawner.isForestArea = areaInfo.type === Enum.AREA_FOREST;

      this.wildlifeSpawner.resetCounts();
      this.wildlifeSpawner.isForestArea = areaInfo.type === Enum.AREA_FOREST;
    }

    this.birdSpawner.update(time, delta);
    this.wildlifeSpawner.update(time, delta);

    //  Tutorial  -------------------

    this.tutorial.update();

    //  Updating sprite lane  -----------------------------------------

    const allSprites = this.group_soldiers.getChildren();
    for (let sprite of allSprites) {
      
      const lane = sprite.lane;
      const layer = sprite.displayList;

      if (lane === 1 && layer !== this.lane_1) {
        this.lane_1.add(sprite);
        sprite.laneSwitchTween();
      }
      else if (lane === 2 && layer !== this.lane_2) {
        this.lane_2.add(sprite);
        sprite.laneSwitchTween();
      }
      else if (lane === 3 && layer !== this.lane_3) {
        this.lane_3.add(sprite);
        sprite.laneSwitchTween();
      }

      const bottomLaneY = Vars.GROUND_TOP + 1;
      const laneY = bottomLaneY + sprite.lane;
      sprite.setY(laneY);
    }

    //  Shadow updating   --------------------------------------------

    this.shadows.updateDynamicShadows();
    this.shadows.drawShadows();
    this.drawSoldierHP();
    this.showSoldierNames();
    this.test();

    this.controller.update();   // Player Controller
  }

  /** Show the name of the entered area shortly on screen */
  showAreaName(areaID) {

    const data = mapInfo.find(info => info.locID === areaID);

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

  addDomName(name, type) {
    
    const css = labelClassCSS.get(type);
    const html = `<p class="name ${css}">${name}</p>`;
    const domLabel = this.add.dom(0, 0).createFromHTML(html).setOrigin(.5, .8);
    return domLabel;
  }

  /** Update the camrea bounds as the Player moves to grow world */
  updateCameraBounds() {
    
    const camera = this.cameras.main;
    const bounds = camera.getBounds();

    const left = bounds.left;
    const right = bounds.right;

    const areaWidth = Vars.AREA_WIDTH;
    const fullWorld = areaWidth * 8;

    const pad = areaWidth * .25;
    const bump = areaWidth * .5;

    let mapCheckPos;
    let newLeft = -1;
    let isMoveMap;

    //  Check either side of the camera for loading more of the map

    if (left > 0 && this.player.x < left + pad) {
      newLeft = left - bump;
      mapCheckPos = newLeft;
      isMoveMap = true;
    }
    else if (right < fullWorld && this.player.x > right - pad) {
      newLeft = left + bump;
      mapCheckPos = right + bump;
      isMoveMap = true;
    }

    //  Update world if there are changes

    if (isMoveMap) {
      
      camera.setBounds(newLeft, 0, areaWidth, camera.height);

      if (this.mapTracker.isFirstTimeInAreaThisSession(mapCheckPos)) {
        this.tmBuilder.buildTilemapForArea(mapCheckPos);
        this.mapBuilder.buildMapForArea(mapCheckPos);
        this.shadows.createStaticShadowLines(this.buildingsLayer, this.bgLayer, this.fgLayer);
      }
    }
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
    this.group_soldiers.add(sprite);

    return sprite;
  }

  spawnPlayer() {

    const camera = this.cameras.main;
    const player = this.spawnSoldier(0, 1, Vars.SHEET_PLAYER);
    this.group_allies.add(player);

    camera.startFollow(player, true, .8);
    player.hp = 10000000000;
    player.displayName = this.addDomName("Moon Chief", Enum.TEAM_PLAYER);

    return player;
  }

  spawnAlly() {
  }

  spawnEnemy() {
      
    const camera = this.cameras.main;
    const worldView = camera.worldView;
    const spawnPoint = Math.random() > .5 ? worldView.right + 20 : worldView.left - 20;

    const deployX = spawnPoint + Phaser.Math.Between(-30, 30);
    const deployLane = Phaser.Math.Between(1, 3);

    const enemy = this.spawnSoldier(deployX, deployLane, Vars.SHEET_BANDIT_BLUE);
    enemy.setEnemyBrain();
    this.group_enemies.add(enemy);

    enemy.displayName = this.addDomName("Enemy", Enum.TEAM_ENEMY);

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

  spawnEnemies(amt) {
    const count = this.group_enemies.countActive();
    for (let i=0; i<amt; i++) {
      this.spawnEnemy();
    }
  }

  //  -

  countEnemies() {
    const count = this.group_enemies.countActive();
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
    
    let soldiers = this.group_enemies.getChildren();

    for (let soldier of soldiers) {

      const lt = soldier.getTopLeft();
      const barX = lt.x;
      const barY = lt.y - 2;

      const barMax = soldier.width;
      const percent = soldier.hp / soldier.maxHP;
      const barWidth = (barMax - 2) * percent;
      const barHeight = 3;

      // Black bar with hp inside it

      if (soldier.hp < soldier.maxHP) {
        this.hpGraphics.fillStyle(0x000000, .5);
        this.hpGraphics.fillRect(barX, barY, barMax, barHeight);
        this.hpGraphics.fillStyle(0xff0000, 1);
        this.hpGraphics.fillRect(barX + 1, barY + 1, barWidth, barHeight - 2);
      }

    }
  }

  showSoldierNames() {

    //const allies = this.group_allies.getChildren();
    const allies = this.group_soldiers.getChildren();
    for (let ally of allies) {

      if (ally.displayName) {
        const dom = ally.displayName;
        const pos = ally.getTopCenter();
        
        const velX = Math.abs(ally.velocityX);
        const pY = (velX > 24) ? -24 : pos.y;
        dom.setPosition(pos.x, pY);
      }
    }

  }

  showSoldierIcon() {
    console.log("Showing Icon for soldiers on lane?");
  }
}
