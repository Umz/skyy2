import SaveData from "./util/SaveData";
import Vars from "./const/Vars";
import Sfx from "./const/Sfx";

const LANCERS = [Vars.SHEET_PLAYER, Vars.SHEET_BLUE_BANDIT_LANCE, Vars.SHEET_BLUE_BANDIT_BOSS];
const INFANTRY = [Vars.SHEET_WILDMAN, Vars.SHEET_BLUE_BANDIT, Vars.SHEET_RED_BANDIT, Vars.SHEET_WILDMAN_CREW];
const H_INFANTRY = [Vars.SHEET_RED_FACE, Vars.SHEET_RED_HEAVY_BANDIT, Vars.SHEET_MAM_HEAVY];
const ADVISOR = [Vars.SHEET_LUNAR, Vars.SHEET_ARCHITECT];

export class Preloader extends Phaser.Scene {

    constructor() {
        super({ key: "Preloader" });
    }

    preload() {
        
        this.load.setPath("assets");    // Set folder to load from

        this.load.atlas('atlas', 'atlas/atlas.png', 'atlas/atlas.json');

        //  Load all images for the background scenery

        this.load.image('bg_sky', 'bg_layers/sky.png');
        this.load.image('bg_mountains', 'bg_layers/grassy_mountains.png');
        this.load.image('bg_range', 'bg_layers/far_mountains.png');
        this.load.image('bg_clouds_mid', 'bg_layers/clouds_mid.png');
        this.load.image('bg_clouds_front', 'bg_layers/clouds_front.png');
        this.load.image('bg_clouds_front_t', 'bg_layers/clouds_front_t.png');

        this.load.image('tilemap', 'bg_layers/tilemap.png');

        //  SOLDIER Spritesheets

        for (let lancer of LANCERS) {
            this.load.spritesheet(lancer, `spritesheets/${lancer}`, { frameWidth: 43, frameHeight: 30});
        }

        for (let infantry of INFANTRY) {
            this.load.spritesheet(infantry, `spritesheets/${infantry}`, { frameWidth: 38, frameHeight:34});
        }

        for (let heavy of H_INFANTRY) {
            this.load.spritesheet(heavy, `spritesheets/${heavy}`, { frameWidth: 38, frameHeight:34});
        }

        for (let advisor of ADVISOR) {
            this.load.spritesheet(advisor, `spritesheets/${advisor}`, { frameWidth: 36, frameHeight:26});
        }

        //for (let supplyman) : 38
            //this.load.spritesheet(supplyman, `spritesheets/${supplyman}`, { frameWidth: 38, frameHeight:31});

        
        // - BG Characters
        
        this.load.spritesheet("king", 'spritesheets/Beard_King.png', { frameWidth: 34, frameHeight: 36});
        
        // - BG animals
        
        this.load.spritesheet(Vars.SHEET_BIRDS1, 'spritesheets/bg_birds.png', { frameWidth: 32, frameHeight: 43});
        this.load.spritesheet("doe_test", 'spritesheets/doe_original.png', { frameWidth: 32, frameHeight: 32});

        // - BG Items
        this.load.spritesheet(Vars.SHEET_ALL_BANNERS, 'spritesheets/banner_mam.png', { frameWidth: 26, frameHeight: 48});
        
        // - VFX

        this.load.spritesheet(Vars.VFX_SPEECH_SHEET, 'vfx/icons_full_24.png', { frameWidth: 24, frameHeight: 24});

        this.load.spritesheet(Vars.VFX_CLAIM, 'vfx/Spark0.png', { frameWidth: 16, frameHeight: 80});
        
        this.load.spritesheet(Vars.VFX_SPARKLE0, 'vfx/Spark0.png', { frameWidth: 16, frameHeight: 80});
        this.load.spritesheet(Vars.VFX_SPARKLE1, 'vfx/Spark1.png', { frameWidth: 16, frameHeight: 80});
        this.load.spritesheet(Vars.VFX_SQUAREFORE0, 'vfx/Square0Fore.png', { frameWidth: 16, frameHeight: 32});
        this.load.spritesheet(Vars.VFX_CONSUME, 'vfx/Consume0.png', { frameWidth: 16, frameHeight: 48});
        this.load.spritesheet(Vars.VFX_BLOOD3, 'vfx/BloodSplatter3.png', { frameWidth: 32, frameHeight: 32});

        //  - Audio

        //  Load JSON files

        let jsons = [Vars.JSON_SCRIPT];
        for (let file of jsons) {
            this.load.json(Vars.JSON_SCRIPT, `json/${file}`);
        }
        this.load.json('sprite_configs', 'json/sprite_configs.json');
        this.load.json("hud_html", "json/hud_html.json");

        //  Villages (BG, FG, Buildings)

        const villages = ["mam", "storm", "green"];
        for (let name of villages) {

            const villageRef = `json_${name}`;
            const bgRef = `json_${name}_bg`;
            const fgRef = `json_${name}_fg`;
            
            this.load.json(villageRef, 'json/locations.json', name);
            this.load.json(bgRef, 'json/bg_trees.json', `bg.${name}`);
            this.load.json(fgRef, 'json/bg_trees.json', `fg.${name}`);
        }

        //  Other locations (BG, Location)

        this.load.json("json_mines", "json/locations.json", "mines");
        this.load.json("json_plains", "json/locations.json", "plains");

        this.load.json("json_blue_forest", "json/locations.json", "blue");
        this.load.json("json_rose_forest", "json/locations.json", "rose");
        this.load.json("json_greenleaf_forest", "json/locations.json", "greenleaf");
        
        this.load.json("json_big_forest_bg", "json/bg_trees.json", "bg.big_forest");
        this.load.json("json_mines_bg", "json/bg_trees.json", "bg.mines");
        this.load.json("json_plains_bg", "json/bg_trees.json", "bg.plains");

        //  - Audio
        for (let [_, data] of Object.entries(Sfx))
            this.load.audio(data.key, `./audio/${data.key}`);

        //  All below came with the builder - delete
        //  ------------------------------------------------------------------------------------

        this.load.on("progress", (progress) => {
        });
    }

    create() {

        SaveData.SETUP_LOCALFORAGE_CONFIG();

        this.createGraphics();

        //  Citizens - King Idle (walk, mine, cheer)
        //  MaM Banner Flapping
        this.anims.create({
            key: 'king_idle',
            frames: this.anims.generateFrameNumbers('king', { start: 0, end: 5 }),
            frameRate: 6,
            repeat: -1
        });

        //  MaM Banner Flapping
        this.anims.create({
            key: 'banner_mam',
            frames: this.anims.generateFrameNumbers(Vars.SHEET_ALL_BANNERS, { start: 0, end: 5 }),
            frameRate: 6,
            repeat: -1
        });

        //  BG Birds 1

        this.anims.create({
            key: 'anim_bird_grey',
            frames: this.anims.generateFrameNumbers(Vars.SHEET_BIRDS1, { start: 0, end: 4 }),
            frameRate: 18,
            repeat: -1
        });

        this.anims.create({
            key: 'anim_bird_brown',
            frames: this.anims.generateFrameNumbers(Vars.SHEET_BIRDS1, { start: 5, end: 9 }),
            frameRate: 16,
            repeat: -1
        });

        //  DOES

        this.anims.create({
            key: 'doe1',
            frames: this.anims.generateFrameNumbers("doe_test", { start: 6, end: 9 }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: 'doe2',
            frames: this.anims.generateFrameNumbers("doe_test", { start: 42, end: 45 }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: 'doe3',
            frames: this.anims.generateFrameNumbers("doe_test", { start: 78, end: 81 }),
            frameRate: 12,
            repeat: -1
        });

        // VFX

        this.createVFXAnimation(Vars.VFX_CLAIM, 10, 16, -1);

        this.createVFXAnimation(Vars.VFX_SPARKLE0, 10, 16, -1);
        this.createVFXAnimation(Vars.VFX_SPARKLE1, 10, 16, -1);
        this.createVFXAnimation(Vars.VFX_SQUAREFORE0, 19, 16, 0);
        this.createVFXAnimation(Vars.VFX_CONSUME, 13, 18, -1);
        this.createVFXAnimation(Vars.VFX_BLOOD3, 7, 16, 0);

        //  Sprite animation

        const data = this.cache.json.get('sprite_configs');

        for (let lancer of LANCERS) {
            this.createSpritesheetAnimation(lancer, data.lancer);
        }

        for (let infantry of INFANTRY) {
            this.createSpritesheetAnimation(infantry, data.infantry);
        }

        for (let heavy of H_INFANTRY) {
            this.createSpritesheetAnimation(heavy, data.heavyInfantry);
        }

        for (let advisor of ADVISOR) {
            this.createSpritesheetAnimation(advisor, data.advisor);
        }

        //  -

        this.scene.start("PlayScene");      // Next Scene when all assets are loaded
    }

    //  CREATE animations   -------------------------------------------------------------------------

    createSpritesheetAnimation(texture, configs) {
        for (let config of configs) {
            this.anims.create({
                key: `${texture}${config.suffix}`,
                frames: this.anims.generateFrameNumbers(texture, { start: config.start, end: config.end }),
                frameRate: config.frameRate,
                repeat: config.repeat
            });
        }
    }

    createVFXAnimation(key, frames, frameRate = 10, repeat = 0) {
        this.anims.create({
            key: key,
            frames: this.anims.generateFrameNumbers(key, { start: 0, end: frames }),
            frameRate: frameRate,
            repeat: repeat
        });
    }

    //  -

    /** Create each graphic within scope to reuse variable names */
    createGraphics() {

        const graphics = this.add.graphics();
        
        {   // CREATE sparkle 
            const x = 0;
            const y = 0;
            const size = 4;
            const radius = size * .5;

            graphics.beginPath();
            
            graphics.arc(x, y, radius, 0, .5 * Math.PI);
            graphics.arc(x, size, radius, 1.5 * Math.PI, 0);
            graphics.arc(size, size, radius, 1 * Math.PI, 1.5 * Math.PI);
            graphics.arc(size, y, radius, .5 * Math.PI, 1 * Math.PI);

            graphics.closePath();

            graphics.fillStyle(0xffffff, 1);
            graphics.fillPath();

            graphics.generateTexture(Vars.TX_SPARKLE, size, size);
            graphics.clear();
        }

        {   // CREATE Blood
            const size = 4;

            graphics.fillStyle(0xCC0000, 1);
            graphics.fillRect(0, 0, 3, 1);

            graphics.generateTexture(Vars.TX_HIT, 3, 1);
            graphics.clear();
        }

        {   // CREATE Blood Add
            const size = 4;

            graphics.fillStyle(0x000000, 1);
            graphics.fillRect(0, 0, 3, 1);

            graphics.generateTexture('bbb', 3, 1);
            graphics.clear();
        }

        graphics.destroy();

    }
}