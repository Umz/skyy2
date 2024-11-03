import Vars from "./util/Vars";

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

        //  Spritesheets

        this.load.spritesheet(Vars.SHEET_ALL_BANNERS, 'spritesheets/banner_mam.png', { frameWidth: 26, frameHeight:48});
        this.load.spritesheet(Vars.SHEET_PLAYER, 'spritesheets/Lancer_Player.png', { frameWidth: 43, frameHeight:30});

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

        this.load.image("floor");
        this.load.image("background", "background.png");

        this.load.image("player", "player/player.png");
        this.load.atlas("propulsion-fire", "player/propulsion/propulsion-fire.png", "player/propulsion/propulsion-fire_atlas.json");
        this.load.animation("propulsion-fire-anim", "player/propulsion/propulsion-fire_anim.json");

        // Enemies
        this.load.atlas("enemy-blue", "enemies/enemy-blue/enemy-blue.png", "enemies/enemy-blue/enemy-blue_atlas.json");
        this.load.animation("enemy-blue-anim", "enemies/enemy-blue/enemy-blue_anim.json");

        // Fonts
        this.load.bitmapFont("pixelfont", "fonts/pixelfont.png", "fonts/pixelfont.xml");
        this.load.image("knighthawks", "fonts/knight3.png");

        // Event to update the loading bar
        this.load.on("progress", (progress) => {
            //console.log("Loading: " + Math.round(progress * 100) + "%");
        });
    }

    create() {

        //  MaM Banner Flapping
        this.anims.create({
            key: 'banner_mam',
            frames: this.anims.generateFrameNumbers(Vars.SHEET_ALL_BANNERS, { start: 0, end: 5 }),
            frameRate: 6,
            repeat: -1
        });

        //  Sprite animation

        const data = this.cache.json.get('sprite_configs');

        this.createSpritesheetAnimation(Vars.SHEET_PLAYER, data.lancer);

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
}