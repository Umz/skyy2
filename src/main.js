import { Game } from "phaser";
import { Preloader } from "./preloader";
import { PlayScene } from "./scenes/PlayScene";
import MenuScene from "./scenes/MenuScene";

// More information about config: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig

//  Dimensions for the game display

const viewBox = document.getElementById('app');
const rect = viewBox.getBoundingClientRect();
const ratio = rect.width / rect.height;
const HEIGHT = 240;
const WIDTH = Math.ceil(HEIGHT * ratio);

const config = {

    type: Phaser.AUTO,
    parent: "phaser-container",

    width: WIDTH,
    height: HEIGHT,

    backgroundColor: "#028af8",
    pixelArt: true,
    roundPixel: true,

    dom: {
        createContainer: true
    },

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },

    fps: {
        target: 60,
        forceSetTimeout: true,
    },

    scene: [
        Preloader,
        PlayScene,
        MenuScene
    ]
};

new Game(config);
