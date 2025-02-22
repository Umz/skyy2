import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Instructions from "../const/Instructions";
import Vars from "../const/Vars";
import Subtitles from "../util/Subtitles";
import SequenceHelper from "./SequenceHelper";

export default class P3 extends TutorialSequence {

  init() {

    const { scene } = this;
    const player = scene.player;
    const script = Subtitles.GetScript();

    const redface = "Red Face";

    this
    .addTitle("Moon Chief and Blue Moon arrive in Moon at Midnight together")
    .add(()=>{
      if (player.x > Vars.AREA_WIDTH * 1.35) {
        this.bluemoonSpeak(script.BlueMoon.mam1, 5000);
        return true;
      }
    })
    .add(()=>{ return (player.x > Vars.AREA_WIDTH * 1.6) })
    
    .addTitle("Soldier arrives on high alert to inform of attacking enemies")
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
    .addWaitForDialogue()
    .addWait(500)
    .addSpeaker(player, Icon.SPEECH, script.MoonChief.mam1, 4000)

    .addTitle("Enemies spawning from the right - initial wave without Red Face")
    .addEnemiesRight(4, Enum.SOLDIER_RED1)
    .addWait(10 * 1000)
    .addEnemiesRight(4, Enum.SOLDIER_RED1)
    .addPlayerSpeak(Icon.SPEECH, script.MoonChief.peons)
    .addWait(10 * 1000)
    .addEnemiesRight(5, Enum.SOLDIER_RED1)
    .addWait(5 * 1000)
    .addEnemiesRight(2, Enum.SOLDIER_RED2)
    .add(()=>{return SequenceHelper.CheckEnemiesLessOrEqual(0)})

    .addTitle("Red Face dialogue, then appears from the right")
    .addWait(2000)
    .addDialogueAndWait(redface, script.RedFace.mam1, 7000)

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
      Subtitles.ShowDialogue(redface, script.RedFace.retreat, 7000)
      return true;
    })
    .add(()=>{ return !Subtitles.IsShowing(); })
    
    //  -

    .addInstruction(Instructions.P3_CHASE_REDFACE)
  }

  //  ============================================================================

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
