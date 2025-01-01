import SaveData from "./util/SaveData";
import Vars from "./const/Vars";

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

        this.load.spritesheet(Vars.SHEET_PLAYER, 'spritesheets/Lancer_Player.png', { frameWidth: 43, frameHeight: 30});
        this.load.spritesheet(Vars.SHEET_WILDMAN, 'spritesheets/Infantry_Wildman.png', { frameWidth: 38, frameHeight:34});
        
        this.load.spritesheet(Vars.SHEET_BANDIT_BLUE, 'spritesheets/Infantry_Bandit_Blue.png', { frameWidth: 38, frameHeight:34});
        this.load.spritesheet(Vars.SHEET_BANDIT_LANCE_BLUE, 'spritesheets/Lancer_Blue_Bandit.png', { frameWidth: 43, frameHeight:30});
        
        // - BG Characters
        
        this.load.spritesheet("king", 'spritesheets/Beard_King.png', { frameWidth: 34, frameHeight: 36});
        
        // - BG animals
        
        this.load.spritesheet(Vars.SHEET_BIRDS1, 'spritesheets/bg_birds.png', { frameWidth: 32, frameHeight: 43});
        this.load.spritesheet("doe_test", 'spritesheets/doe_original.png', { frameWidth: 32, frameHeight: 32});

        // - BG Items
        this.load.spritesheet(Vars.SHEET_ALL_BANNERS, 'spritesheets/banner_mam.png', { frameWidth: 26, frameHeight: 48});
        
        // - FX
        this.load.spritesheet('consume0', 'vfx/Consume0.png', { frameWidth: 16, frameHeight: 48});

        //  Load JSON files

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

        this.anims.create({
            key: 'consume0',
            frames: this.anims.generateFrameNumbers("consume0", { start: 0, end: 13 }),
            frameRate: 18,
            repeat: -1
        });

        //  Sprite animation

        const data = this.cache.json.get('sprite_configs');

        this.createSpritesheetAnimation(Vars.SHEET_PLAYER, data.lancer);
        this.createSpritesheetAnimation(Vars.SHEET_WILDMAN, data.infantry);
        this.createSpritesheetAnimation(Vars.SHEET_BANDIT_BLUE, data.infantry);
        this.createSpritesheetAnimation(Vars.SHEET_BANDIT_LANCE_BLUE, data.lancer);

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

        graphics.destroy();

    }
}