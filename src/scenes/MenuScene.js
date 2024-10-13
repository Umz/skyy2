import { Scene } from "phaser";
import Scenery from "../bg/Scenery";

export class MenuScene extends Scene {

    constructor() {
        super("MenuScene");
    }

    create() {

        //  Set world size
        const camera = this.cameras.main;
        const width = 1280;
        camera.setBounds(0, 0, width, camera.height);
        camera.centerOn(width * .5, camera.height / 2);

        //  Add groups and layers
        const allGroup = this.add.group({
            runChildUpdate: true
        });
        const allLayer = this.add.layer();

        const scenery = new Scenery(this);      // Background scene
        scenery.addFullScene(allLayer, allGroup);

        this.fadeOutSplash();   // Fade out splash logo
    }

    fadeOutSplash() {
        //  Fade out the splash logo (HTML element)
        const fadeElement = document.getElementById('splash-container');
        this.tweens.add({
            targets: fadeElement.style,
            opacity: {from: 1, to: 0},
            delay: 500,
            duration: 500,
            ease: 'Linear',
            onComplete: () => {
                fadeElement.style.display = 'none';
                this.scene.start("MenuScene");
            }
        });
        
    }
}