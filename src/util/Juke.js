let scene;
let musicKey;

export default class Juke {

    static SetScene(s) {
        scene = s;
        musicKey = null;
    }

    static PlaySound(sfx) {

        const max = sfx.max || 10;
        const key = sfx.key;
        const config = sfx.config;

        const instances = scene.sound.getAll(key);
        if (instances.length < max)
            scene.sound.play(key, config);
    }

    static StopSound(sfx) {
        const key = sfx.key;
        scene.sound.removeByKey(key);
    }

    static PlayMusic(sfx) {
        
        const key = sfx.key;
        const config = sfx.config;
        
        if (key !== musicKey) {
            
            scene.sound.stopByKey(musicKey);
            scene.sound.play(key, config);

            musicKey = key;

            return true;
        }

        return false;
    }
}
