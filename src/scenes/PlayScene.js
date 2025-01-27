import { Scene } from "phaser";
import TilemapBuilder from "../bg/TilemapBuilder";
import Scenery from "../bg/Scenery";
import MapBuilder from "../bg/MapBuilder";
import Shadow from "../bg/Shadow";
import Vars from "../const/Vars";
import KeyboardMapper from "../util/KeyboardMapper";
import ControlKeys from "../util/ControlKeys";
import SpriteController from "../util/SpriteController";
import MapTracker from "../util/MapTracker";
import Collectible from "../gameobjects/Collectible";
import BirdHandler from "../bg/BirdHandler";
import AnimalHandler from "../bg/AnimalHandler";
import Enum from "../const/Enum";
import Rock from "../gameobjects/Rock";
import SaveData from "../util/SaveData";
import Tutorial from "../classes/Tutorial";
import MapInfo from "../const/MapInfo";
import Conversation from "../util/Conversation";
import Spawner from "../util/Spawner";
import LandClaimer from "../util/LandClaimer";
import Juke from "../util/Juke";
import Sfx from "../const/Sfx";
import Vfx from "../util/Vfx";
import Subtitles from "../util/Subtitles";

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
    this.groupCitizens = this.add.group();
    this.groupRocks = this.add.group();
    this.groupCollectibles = this.add.group();
    this.groupClaimFlags = this.add.group();
    
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
    this.animalLayer = this.add.layer();
    this.fgLayer = this.add.layer();

    this.lane_1 = this.add.layer().setDepth(10);
    this.lane_2 = this.add.layer().setDepth(20);
    this.lane_3 = this.add.layer().setDepth(30);

    //  Camera setup

    const camera = this.cameras.main;
    const areaWidth = Vars.AREA_WIDTH;
    const fullWorld = areaWidth * 8;
    camera.setBounds(0, 0, fullWorld, camera.height);

    this.createEmitters();

    //  Create Player

    this.spawner = new Spawner(this);
    this.player = this.spawnPlayer();

    //  Utilities and Game objects

    this.mapTracker = new MapTracker();   // Player location on map
    this.landClaimer = new LandClaimer(this);
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
    this.physics.add.overlap(this.player, this.groupClaimFlags, this.playerClaimFlagCollision, null, this);   // Claim area

    //  Controller

    const controllerKeys = new ControlKeys();
    const keyMapper = new KeyboardMapper(this);
    keyMapper.registerKeyboard(controllerKeys);
    this.controller = new SpriteController(this.player, controllerKeys);

    this.initialLoad = false;
    this.loadedGameData = await SaveData.LOAD_GAME_DATA();

    //  DEV  --------------------------------------------------------------------------

    this.tutorial = new Tutorial(this, controllerKeys, this.controller);
    this.convo = new Conversation(this);

    Juke.SetScene(this);
    Juke.PlayMusic(Sfx.MUS_GAME);

    Vfx.SetScene(this);

    const allScripts = this.cache.json.get(Vars.JSON_SCRIPT);

    Subtitles.SetScene(this);
    Subtitles.SetScript(allScripts.EN);

    this.crowdRect = new Phaser.Geom.Rectangle(0, 0, 100, 24);
    this.isPlayerCrowded = false;

    this.test = function() {
      this.crowdRect.setPosition(this.player.x - this.crowdRect.width * .5, this.player.y - this.crowdRect.height);
      //this.graphics.strokeRectShape(this.crowdRect);
    }
  }

  /** Initial scene setup (first load) */
  setupScene() {

    const playerX = SaveData.Data.playerX;
    const playerLane = SaveData.Data.playerLane;

    this.player.setX(playerX);
    this.player.setLane(playerLane);

    if (SaveData.Data.hasBlueMoon) {
      this.spawnBlueMoon();
    }

    for (let sd of SaveData.Data.citizens) {
      const citizen = this.spawnCitizen(sd.x, sd.sheet);
      citizen.loadData(sd);
    }

    //  -

    const areaID = this.mapTracker.getCurrentAreaID(playerX);
    
    //  Build scene for area

    this.scenery.addFullScene(this.sceneryLayer, this.allGroup);
    this.tilemapBuilder.buildTilemapForArea(playerX);
    this.mapBuilder.buildMapForArea(playerX);

    //  Initialise map area

    const aID = Math.max(1, areaID);
    const areaInfo = MapInfo.get(aID);
    const isForest = areaInfo.type === Enum.AREA_FOREST;
    this.birdSpawner.isForestArea = isForest;
    this.wildlifeSpawner.isForestArea = isForest;

    //  Map Tracker

    this.mapTracker.updateCurrentArea(playerX);
    this.tutorial.load();

    this.spawnAllMaMFlags();

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

    SaveData.Data.playtime += delta;

    //  - Normal updating -
    
    this.convo.update(time, delta);
    this.tutorial.update();

    this.mapTracker.updateCurrentArea(this.player.x);
    this.mapTracker.updateAreaDisplayCount(delta);
    this.landClaimer.update(delta);
    
    this.updateMapArea();
    this.updateMapBuilder();

    this.updateCrowding();
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
      if (currentAreaID === Enum.LOC_MINES) {
        this.spawnRocks(20);
      }
      else {
        this.clearRocks();
      }
      
      this.birdSpawner.resetCounts();
      this.wildlifeSpawner.resetCounts();
      
      const areaInfo = MapInfo.get(currentAreaID);
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
  }

  updateCrowding() {
    this.crowdRect.setPosition(this.player.x - this.crowdRect.width * .5, this.player.y - this.crowdRect.height);
    const rect = this.crowdRect;
    const bodies = this.physics.overlapRect(rect.x, rect.y, rect.width, rect.height);
    this.isPlayerCrowded = bodies.length >= 6;
  }

  //  -----------------------------------------------------------------------------------------------------

  /** Show the name of the entered area shortly on screen */
  showAreaName(areaID) {

    const data = MapInfo.get(areaID);

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

    this.sparkleEmitter = this.add.particles(0, 0, Vars.TX_SPARKLE, {
      speedX: { min: -30, max: 30 },
      speedY: { min: -30, max: 30 },
      lifespan: 500,
      emitting: false
    });

    const emitMin = 30, emitMax = 70, ySpray = 20;

    this.hitEmiiter = this.add.particles(0, 0, Vars.TX_HIT, {
      speedX: { min: -emitMin, max: -emitMax },
      speedY: { min: -ySpray, max: ySpray },
      scale: { start: 1, end: 0},
      lifespan: 500,
      emitZone: { type: 'random', source: new Phaser.Geom.Rectangle(0, 0, 2, 4), quantity: 20 },
      emitting: false
    });
    this.ccc = this.add.particles(0, 0, 'bbb', {
      speedX: { min: -emitMin, max: -emitMax },
      speedY: { min: -ySpray, max: ySpray },
      alpha: { start: 1, end: 0},
      lifespan: 500,
      emitZone: { type: 'random', source: new Phaser.Geom.Rectangle(0, 0, 2, 4), quantity: 20 },
      emitting: false
    });

    this.hitRightEmitter = this.add.particles(0, 0, Vars.TX_HIT, {
      speedX: { min: emitMin, max: emitMax },
      speedY: { min: -ySpray, max: ySpray },
      scale: { start: 1, end: 0},
      lifespan: 500,
      emitZone: { type: 'random', source: new Phaser.Geom.Rectangle(0, 0, 2, 4), quantity: 20 },
      emitting: false
    });
    this.bbb = this.add.particles(0, 0, 'bbb', {
      speedX: { min: emitMin, max: emitMax },
      speedY: { min: -ySpray, max: ySpray },
      alpha: { start: 1, end: 0},
      lifespan: 500,
      emitZone: { type: 'random', source: new Phaser.Geom.Rectangle(0, 0, 2, 4), quantity: 20 },
      emitting: false
    });

    this.claimEmitter = this.add.particles(0, 0, Vars.TX_SPARKLE, {
      speedX: { min: -3, max: 3 },
      speedY: { min: -60, max: -20 },
      lifespan: 1000,
      emitZone: { type: 'random', source: new Phaser.Geom.Rectangle(0, 0, 480, 320), quantity: 42 },
      frequency: 50,
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

  emitClash(x, y, lane) {
    this.sparkleEmitter.setDepth(lane * 10 + 1);
    this.sparkleEmitter.emitParticleAt(x, y, 8);
  }

  emitLeftHit(x, y, lane) {
    this.hitEmiiter.setDepth(lane * 10 + 1);
    this.hitEmiiter.emitParticleAt(x, y, 10);
    this.ccc.setDepth(lane * 10 + 2);
    this.ccc.emitParticleAt(x, y, 4);
  }
  emitRightHit(x, y, lane) {
    this.hitRightEmitter.setDepth(lane * 10 + 1);
    this.hitRightEmitter.emitParticleAt(x, y, 10);
    this.bbb.setDepth(lane * 10 + 2);
    this.bbb.emitParticleAt(x, y, 4);
  }

  //  -

  tinyCameraShake() {
    const camera = this.cameras.main;
    camera.shake(100, .01, true);
  }

  showDeath(soldier) {

    const atlas = soldier.prefix;
    const frame = soldier.frame;

    const image = this.add.image(soldier.x, soldier.y, atlas, frame).setOrigin(.5, 1).setFlipX(soldier.flipX);
    const cover = this.add.image(soldier.x, soldier.y, atlas, frame).setOrigin(.5, 1).setFlipX(soldier.flipX).setAlpha(.6).setDepth(soldier.depth + 1);
    cover.setTintFill(0xffffff);
    const toY = soldier.getTopCenter().y - 16;

    this.tweens.add({
      targets: [image, cover],
      duration: 750,
      scaleX: .2,
      scaleY: 2,
      y: toY,
      alpha: 0,
      onComplete: () => {
        image.destroy(true);
      }
    })
  }

  //  - Character spawning    -----------------------------------------------------------------------------------------

  spawnPlayer() {
    return this.spawner.spawnPlayer();
  }

  spawnWildman() {
    this.bluemoon = this.spawner.spawnWildman();
  }

  spawnBlueMoon() {
    const pX = this.player.x + 24;
    this.bluemoon = this.spawner.spawnBlueMoon(pX);
  }

  spawnAlly(posX, type = Enum.SOLDIER_BANDIT1) {
    return this.spawner.spawnAlly(posX, type);
  }

  spawnEnemy(posX, type = Enum.SOLDIER_BANDIT1) {
    return this.spawner.spawnEnemy(posX, type);
  }

  spawnEnemies(amt, posX, type) {
    for (let i=0; i<amt; i++) {
      this.spawnEnemy(posX, type);
    }
  }

  //  -

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
  
  /** Spawn a flag that will begin the land claim process */
  spawnClaimerFlag(x) {
    this.spawner.spawnClaimerFlag(x);
  }
  
  /** Spawn a flag image that represents an area that has been claimed */
  spawnMaMFlags(locID) {

    const map = MapInfo.get(locID);
    const flags = map.flags || []
    for (let flagX of flags) {
      this.spawner.spawnMaMFlag(flagX);
    }
    this.shadows.createStaticShadowLines(this.buildingsLayer, this.bgLayer, this.fgLayer);
  }

  spawnAllMaMFlags() {
    const allClaimed = SaveData.Data.claimed;
    for (let locID of allClaimed) {
      this.spawnMaMFlags(locID);
    }
  }

  //  -

  spawnCitizen(x, sheet) {
    const citi = this.spawner.spawnCitizen(x, sheet);
    return citi;
  }

  countCitizens() {
    return this.groupCitizens.countActive();
  }

  countCitizensOfLoc(home) {
    const fullCount = this.groupCitizens.getChildren();
    return fullCount.filter(ci => ci.home === home).length;
  }

  countCitizensOfLocTribe(home, tribe) {
    const fullCount = this.groupCitizens.getChildren();
    return fullCount.filter(ci => ci.home === home && ci.tribe === tribe).length;
  }
  
  //  -
  
  clearRocks() {
    this.groupRocks.clear(true, true);
  }

  countEnemies() {
    const count = this.groupEnemies.countActive();
    return count;
  }

  //  -----------------------------------------------------------------------------------------

  addHitFx(att, target) {
    
    const pp = target.getCenter();
    const y = pp.y + 3;
    if (att.x < target.x) {
      this.emitRightHit(pp.x, y, target.lane);
    }
    else {
      this.emitLeftHit(pp.x, y, target.lane);
    }
  }

  allyEnemyCollision(ally, en) {

    const checkAttack = (attacker, defender) => {
      const point = attacker.getAttackPoint();
      if (defender.hitboxContainsX(point.x)) {

        const activeDefense = defender.isState(Enum.SS_DEFEND) && defender.isFacing(attacker.x) && defender.hasGP();

        // M<ust be facing enemy to defend
        if (activeDefense) {

          attacker.recoil(16);
          defender.guard();
          defender.kickback(2, attacker.x);
          this.emitClash(point.x, point.y, attacker.lane);
          Juke.PlaySound(Sfx.DEFENDED);

          if (attacker.isPlayer) {
            this.tinyCameraShake();
          }
        }
        else {
          attacker.rebound(4);
          this.addHitFx(attacker, defender);

          const fatal = defender.hit(attacker);
          if (fatal) {
            this.showDeath(defender);
          }

        }
      }
    }
  
    const sameLane = ally.isLane(en.lane);
    if (sameLane) {

      // if both attacking - check clash (some types, beat others)
      // some blocks are parries
      // MUST be facing each other

      const facing = ally.isFacing(en.x) && en.isFacing(ally.x);

      if (ally.isState(Enum.SS_ATTACK) && en.isState(Enum.SS_ATTACK) && facing) {
        ally.recoil(16);
        en.recoil(16);

        const p1 = ally.getAttackPoint();
        const p2 = en.getAttackPoint();

        this.emitClash(p1.x, p1.y, ally.lane);
        this.emitClash(p2.x, p2.y, en.lane);

        Juke.PlaySound(Sfx.CLASHED);
      }
      if (ally.isState(Enum.SS_ATTACK) && ally.isFacing(en.x)) {
        checkAttack(ally, en);
      }
      else if (en.isState(Enum.SS_ATTACK) && en.isFacing(ally.x)) {
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
          SaveData.Data.silica ++;
          rock.destroy();
        }
      });
    }
  }

  /** Claim current territory when hovering flag for X seconds */
  playerClaimFlagCollision(player, flag) {
    if (player.isLane(1)) {
      console.log(1);
      this.landClaimer.setClaiming();
      const locID = this.mapTracker.currentAreaID;
      const allClaimed = SaveData.Data.claimed;
      if (allClaimed.includes(locID)) {
        this.spawnMaMFlags(locID);
        flag.destroy(true);
      }
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

      const barCol = soldier.isAlly() ? 0x00ff00 : 0xee0000;
      const alpha = (soldier.isPlayer || soldier.isLane(this.player.lane)) ? 1 : .4;

      // Black bar with hp inside it

      if (soldier.hp < soldier.maxHP) {
        this.hpGraphics.fillStyle(0x000000, .5);
        this.hpGraphics.fillRect(barX, hpY, barMax, barHeight);
        this.hpGraphics.fillStyle(barCol, alpha);
        this.hpGraphics.fillRect(barX + 1, hpY + 1, hpBar, barHeight - 2);
      }

      //  Draw Guard bar when defending

      if (soldier.isState(Enum.SS_DEFEND)) {
        this.hpGraphics.fillStyle(0x000000, .5);
        this.hpGraphics.fillRect(barX, guardY, barMax, barHeight);
        this.hpGraphics.fillStyle(0x0055ff, alpha);
        this.hpGraphics.fillRect(barX + 1, guardY + 1, guardBar, barHeight - 2);
      }
    }
  }

  showSoldierNames() {

    const soldiers = this.groupSoldiers.getChildren();
    for (let sol of soldiers) {
      if (sol.displayName) {

        const alpha = (sol.isPlayer || sol.isLane(this.player.lane)) ? 1 : .6;
        const dom = sol.displayName;
        const pos = sol.getTopCenter();
        
        const velX = Math.abs(sol.velocityX);
        const pY = (velX > 24) || sol.isState(Enum.SS_DEFEND) || sol.isShowingIcon ? -24 : pos.y;
        dom.setPosition(pos.x, pY);
        dom.setAlpha(alpha);
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

      if (soldier.isPlayer || soldier.isLane(this.player.lane)) {
        graphics.fillStyle(0x000000, .5);
        graphics.fillTriangle(tX, tY + 5, tX + 4, tY + 5, tX + 2, tY + 1);
  
        graphics.fillStyle(col, 1);
        graphics.fillTriangle(tX, tY + 4, tX + 4, tY + 4, tX + 2, tY);
      }
    }

  }
}
