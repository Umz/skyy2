import { Scene } from "phaser";

export class SplashScene extends Scene {

    constructor() {
        super("SplashScene");
    }

    create() {
        console.log("Tweening")
        //  Fade out the splash logo (HTML element)
        const fadeElement = document.getElementById('splash-container');
        this.tweens.add({
            targets: fadeElement.style,
            opacity: {from: 1, to: 0},
            delay: 5000,
            duration: 1000,
            ease: 'Linear',
            onComplete: () => {
                fadeElement.style.display = 'none';
                this.scene.start("MenuScene");
            }
        });
    }
}
