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
import Story from "../util/Story";

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

export class PlayScene extends Scene {

  constructor() {
    super("PlayScene");
  }

  async create() {

    //  Set world size

    const camera = this.cameras.main;
    const width = 1920;

    const graphics = this.add.graphics();
    const hpGraphics = this.add.graphics().setDepth(35);

    //  Groups

    const allGroup = this.add.group({
      runChildUpdate: true
    });
    const birdGroup = this.add.group({runChildUpdate:true});
    this.group_soldiers = this.add.group({runChildUpdate:true});
    this.group_allies = this.add.group();
    this.group_enemies = this.add.group();

    this.group_rocks = this.add.group();

    //  Display layers

    const sceneryLayer = this.add.layer();
    const birdLayer = this.add.layer();
    const tilemapLayer = this.add.layer();

    const shadowLayer = this.add.layer();
    const bgLayer = this.add.layer();
    const buildingsLayer = this.add.layer();
    const fgLayer = this.add.layer();

    this.bgL = bgLayer;
    this.fgL = fgLayer;
    this.bdL = buildingsLayer;

    const animalLayer = this.add.layer();

    this.lane_1 = this.add.layer().setDepth(10);
    this.lane_2 = this.add.layer().setDepth(20);
    this.lane_3 = this.add.layer().setDepth(30);

    //  Utilities

    this.mapTracker = new MapTracker();

    // Background scene

    const scenery = new Scenery(this);
    scenery.addFullScene(sceneryLayer, allGroup);

    //  Tilemap

    const ww = 1920;
    const startX = (ww * 0);

    this.mapTracker.updateAreaID(startX);
    if (this.mapTracker.getCurrentAreaID(startX) === Enum.LOC_MINES) {
      this.spawnRocks(20);
    }

    this.tmBuilder = new TilemapBuilder(this, tilemapLayer);
    this.tmBuilder.buildTilemapForArea(startX);

    //  Add trees in BG

    this.mapBuilder = new MapBuilder(this);
    this.mapBuilder.setLayers({bgLayer, fgLayer, buildingsLayer});
    this.mapBuilder.buildMapForArea(startX);

    // Background birds   --------------------------------------------------------------------------

    this.birdSpawner = new BirdHandler(this, birdLayer, birdGroup);
    this.wildlifeSpawner = new AnimalHandler(this, animalLayer, birdGroup);

    const startID = this.mapTracker.getCurrentAreaID(startX + width * .5);
    const initArea = mapInfo.find(info => info.locID === startID);

    const isForest = initArea.type === Enum.AREA_FOREST;
    this.birdSpawner.isForestArea = isForest;
    this.wildlifeSpawner.isForestArea = isForest;

    // Player Character   --------------------------------------------------------------------------

    const posX = await SaveData.GET_PLAYER_POS();

    const player = new Soldier(this, posX, Vars.GROUND_TOP + 1, Vars.SHEET_PLAYER);
    player.playIdle();
    this.physics.add.existing(player);

    this.lane_1.add(player);
    this.group_soldiers.add(player);
    this.group_allies.add(player);

    camera.startFollow(player, true, .8);
    this.player = player;
    player.hp = 10000000000;

    Story.ShowStory(Enum.STORY_1A_APPRENTICE);

    // Enemy

    this.spawnEnemy = () =>{
      
      const cam = this.cameras.main;
      const view = cam.worldView;
      const spawnPoint = Math.random() > .5 ? view.right + 20 : view.left - 20;
      const dpX = spawnPoint + Phaser.Math.Between(-30, 30);

      const enemy = new Soldier(this, dpX, Vars.GROUND_TOP + 1, Vars.SHEET_BANDIT_BLUE);
      enemy.playIdle();
      enemy.setEnemyBrain();
  
      this.lane_1.add(enemy);
      this.group_soldiers.add(enemy);
      this.group_enemies.add(enemy);
      this.physics.add.existing(enemy);
    }

    // Define enemy AI

    const checkAttack = function(attacker, defender) {
      const point = attacker.getAttackPoint();
      if (defender.hitboxContainsX(point.x)) {

        // M<ust be facing enemy to defend

        if (defender.isState(Enum.SS_DEFEND)) {
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

    // Battle smarts - Block more when HP low
    // Flee battle if losing

    this.physics.add.overlap(this.group_allies, this.group_enemies, (ally, en) => {
      
      const sameLane = ally.isLane(en.lane);
      
      // Change this into a function and just call with attacker defender
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

    }, null, this);

    this.test = function() {

      let target = player;
      let pp = target.getAttackPoint();
      //graphics.fillStyle(0xffffff, 1);
      //graphics.fillCircle(pp.x, pp.y, 1);

      /*
      const wv = camera.worldView;
      const count = this.group_enemies.countActive();
      if (count === 0 && wv.left > 0 && player.x !== wv.left) {
        for (let i=0; i<6; i++) {
          this.spawnEnemy();
        }
      }
      */
    }

    this.drawHP = function() {

      hpGraphics.clear();
      
      let soldiers = this.group_enemies.getChildren();

      for (let soldier of soldiers) {

        const lt = soldier.getTopLeft();
        const barX = lt.x;
        const barY = lt.y - 2;

        const barMax = soldier.width;
        const percent = soldier.hp / soldier.maxHP;
        const barWidth = (barMax - 2) * percent;
        const barHeight = 3;

        // Black bar
        if (soldier.hp < soldier.maxHP) {
          hpGraphics.fillStyle(0x000000, .5);
          hpGraphics.fillRect(barX, barY, barMax, barHeight);
          hpGraphics.fillStyle(0xff0000, 1);
          hpGraphics.fillRect(barX + 1, barY + 1, barWidth, barHeight - 2);
        }
      }
    }

    //  Collectible

    const item = new Collectible(this, startX + width * .5 + 40, 0, "collect_heart");
    item.initCollectible(2);
    this.add.existing(item);
    this.physics.add.existing(item);

    //  Collision with Collectibles

    this.physics.add.overlap(player, item, itemCollect, null, this); 
    function itemCollect(player, item) {
      if (player.lane === item.lane) {
        item.collectAndDestroy();
      }
    }

    this.spawnRocks = function(amt) {

      for (let i=0; i<amt; i++) {

        const areaX = this.mapTracker.getAreaLeftX();
        const minX = areaX + Vars.AREA_WIDTH * .15;
        const maxX = areaX + Vars.AREA_WIDTH * .65;

        const rockX = Phaser.Math.Between(minX, maxX);
        const rockLane = Phaser.Math.Between(1, 3);

        const rock = new Rock(this, rockX, Vars.GROUND_TOP);
        rock.setLane(rockLane);

        allGroup.add(rock);
        this.group_rocks.add(rock);
        this.add.existing(rock);
        this.physics.add.existing(rock);
      }
      
    }

    this.clearRocks = function() {
      this.group_rocks.clear(true, true);
    }

    //  Mining rocks
    
    this.physics.add.overlap(this.group_soldiers, this.group_rocks, this.rockAttack, null, this);

    //  Shadows   -----------------------------------------------------------------------------------

    this.shadows = new Shadow(camera, graphics);
    this.shadows.createStaticShadowLines(buildingsLayer, bgLayer, fgLayer);
    this.shadows.addDynamicLayers(this.lane_1, this.lane_2, this.lane_3, animalLayer);
    this.shadows.setActiveLane(player);
    shadowLayer.add(graphics);

    //  Particles   ---------------------------------------------------------------------------------

    this.emitter = this.add.particles(0, 0, 'atlas', {
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

    //  Controller    -------------------------------------------------------------------------------

    const controllerKeys = new ControlKeys();
    const keyMapper = new KeyboardMapper(this);
    keyMapper.registerKeyboard(controllerKeys);
    
    this.controller = new SpriteController(player, controllerKeys);

    this.isLoaded = posX;
  }

  update(time, delta) {

    if (!this.isLoaded)
      return

    this.updateCameraBounds();    //  Update bounds according to Player location

    const newAreaID = this.mapTracker.checkForNewArea(delta, this.player.x);
    if (newAreaID >= 0) {

      SaveData.SAVE_POS(this.player.x);

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
    this.test();
    this.drawHP();

    this.controller.update();   // Player Controller
  }

  /** Rock when soldier attacks a rock overlap */
  rockAttack(sprite, rock) {

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
        this.shadows.createStaticShadowLines(this.bdL, this.bgL, this.fgL);
      }
    }
  }

  emitDust(x, y, lane) {
    this.emitter.setDepth(lane * 10 + 1);
    this.emitter.emitParticleAt(x, y, 6);
  }

  emitRock(x, y, lane) {
    this.rockEmitter.setDepth(lane * 10 + 1);
    this.rockEmitter.emitParticleAt(x, y, 12);
  }
}
