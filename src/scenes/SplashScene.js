import { Scene } from "phaser";

export class SplashScene extends Scene {

    constructor() {
        super("SplashScene");
    }

    create() {
        this.scene.start("MenuScene");
    }
}
