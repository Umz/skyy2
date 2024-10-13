import { Game } from "phaser";
import { Preloader } from "./preloader";
import { GameOverScene } from "./scenes/GameOverScene";
import { HudScene } from "./scenes/HudScene";
import { MainScene } from "./scenes/MainScene";
import { MenuScene } from "./scenes/MenuScene";
import { SplashScene } from "./scenes/SplashScene";

// More information about config: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig

//  Dimensions for the game display

const viewBox = document.getElementById('app');
const rect = viewBox.getBoundingClientRect();
const ratio = rect.width / rect.height;
const HEIGHT = 240;
const WIDTH = Math.round(HEIGHT * ratio);

const config = {

    type: Phaser.AUTO,
    parent: "phaser-container",

    width: WIDTH,
    height: HEIGHT,

    backgroundColor: "#028af8",
    pixelArt: true,
    roundPixel: true,

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

    scene: [
        Preloader,
        SplashScene,
        MainScene,
        MenuScene,
        HudScene,
        GameOverScene
    ]
};

new Game(config);