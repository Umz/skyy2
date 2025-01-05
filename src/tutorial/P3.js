import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Vars from "../const/Vars";
import Subtitles from "../util/Subtitles";
import SequenceHelper from "./SequenceHelper";

export default class P3 extends TutorialSequence {

  init() {

    const { scene } = this;
    const player = scene.player;
    const script = Subtitles.GetScript();

    this
    .add(()=>{
      if (player.x > Vars.AREA_WIDTH * 1.45) {
        this.bluemoonSpeak(script.BlueMoon.mam1, 5000);
        return true;
      }
    })
    .add(()=>{ return (player.x > Vars.AREA_WIDTH * 1.6) })

    //  -
    
    .add(()=>{
      
      const spawnDist = .15;
      const sP = 1.6;
      
      SequenceHelper.SpawnAlly(Vars.AREA_WIDTH * (sP - spawnDist), Enum.SOLDIER_ALLY_HEAVY1);
      SequenceHelper.SpawnAlly(Vars.AREA_WIDTH * (sP - spawnDist), Enum.SOLDIER_ALLY_HEAVY1);
      SequenceHelper.SpawnAlly(Vars.AREA_WIDTH * (sP - spawnDist), Enum.SOLDIER_ALLY_HEAVY1);

      const ally1 = SequenceHelper.SpawnAlly(Vars.AREA_WIDTH * (sP + spawnDist), Enum.SOLDIER_ALLY_HEAVY1);
      ally1.speak(Icon.ALARM, script.Soldier.mam_alert, 2000);

      return true;
    })
    .addWait(2500)
    .add(()=>{
      player.speak(Icon.SPEECH, script.MoonChief.mam1, 4000);
      return true;
    })
    .addEnemiesRight(4, Enum.SOLDIER_RED1)
    .addWait(10 * 1000)
    .addEnemiesRight(4, Enum.SOLDIER_RED1)
    .addPlayerSpeak(Icon.SPEECH, script.MoonChief.peons)
    .addWait(10 * 1000)
    .addEnemiesRight(5, Enum.SOLDIER_RED1)
    .addWait(5 * 1000)
    .addEnemiesRight(2, Enum.SOLDIER_RED2)
    .add(()=>{return SequenceHelper.CheckEnemiesLessOrEqual(0)})

    //  -

    .addWait(2000)
    .add(()=>{
      Subtitles.ShowDialogue("Red Face", script.RedFace.mam1, 7000)
      return true;
    })
    .add(()=>{ return !Subtitles.IsShowing(); })

    // Stop saving - RefFace is one block

    .addWait(1000)
    .add(()=>{
      this.spawnRedFace();
      player.speak(Icon.ANGER, script.MoonChief.mam2, 3000);
      return true;
    })
    .addEnemiesRight(4, Enum.SOLDIER_RED1)
    .addWait(7 * 1000)
    .addEnemiesRight(4, Enum.SOLDIER_RED2)

    .add(()=>{
      return this.redface.hp <= 0;
    })
    .add(()=>{
      Subtitles.ShowDialogue("Red Face", script.RedFace.retreat, 7000)
      return true;
    })
    .add(()=>{ return !Subtitles.IsShowing(); })
    //  -

    .addInstruction(Enum.STORY_3_CHASE_REDFACE)
    .add(()=>{
      return false;
    })
  }

  //  -

  spawnRedFace() {
    const camera = this.scene.cameras.main;
    const worldView = camera.worldView;
    const pX = worldView.left - 40;

    this.redface = this.scene.spawnEnemy(pX, Enum.SOLDIER_REDFACE);
    this.redface.setHP(15, 15);
    this.redface.setGP(10, 10);
    this.redface.setDisplayName("Red Face", Enum.TEAM_ENEMY);
  }

  //  -

  addEnemiesRight(amt, ...types) {

    this.add(()=>{
      const camera = this.scene.cameras.main;
      const worldView = camera.worldView;
      const pX = worldView.right + Phaser.Math.Between(20, 70);
      SequenceHelper.SpawnEnemiesAt(pX, amt, types);
      return true;
    });

    return this;
  }

  //  -

  addPlayerSpeak(ic, text, ttl) {
    this.add(()=>{
      const { scene } = this;
      const player = scene.player;
      player.speak(ic, text, ttl);
      return true;
    })
    return this;
  }

  bluemoonSpeak(text, ttl) {
    const bluemoon = this.scene.bluemoon;
    bluemoon.speak(Icon.SPEECH, text, ttl);
  }

}
