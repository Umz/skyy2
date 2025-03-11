import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Instructions from "../const/Instructions";
import Sfx from "../const/Sfx";
import Vars from "../const/Vars";
import Juke from "../util/Juke";
import Subtitles from "../util/Subtitles";
import SequenceHelper from "./SequenceHelper";

export default class P3 extends TutorialSequence {

  init() {

    const { scene } = this;
    const player = scene.player;
    const script = Subtitles.GetScript();

    const redface = script.Names.RedFace;

    this
    .addTitle(" >>> Moon Chief and Blue Moon arrive in Moon at Midnight together -")
    
    .add(()=> player.x > Vars.AREA_WIDTH * 1.35 )
    .addSpeak(Enum.ID_BLUE_MOON, Icon.SPARKLE, script.BlueMoon.mam1, 5000, Sfx.VOICE_HO2)

    .add(()=> player.x > Vars.AREA_WIDTH * 1.6 )
    
    .addTitle(" >>> Soldier arrives on high alert to inform of attacking enemies -")

    .add(()=>{
      
      const spawnDist = .15;
      const sP = 1.6;
      const spawnX = Vars.AREA_WIDTH * (sP - spawnDist);
      
      SequenceHelper.SpawnAlly(spawnX, Enum.SOLDIER_ALLY_HEAVY1);
      SequenceHelper.SpawnAlly(spawnX + 20, Enum.SOLDIER_ALLY_HEAVY1);
      SequenceHelper.SpawnAlly(spawnX - 20, Enum.SOLDIER_ALLY_HEAVY1);

      const ally1 = SequenceHelper.SpawnAlly(Vars.AREA_WIDTH * (sP + spawnDist), Enum.SOLDIER_ALLY_HEAVY1);
      ally1.speak(Icon.ALARM, script.Soldier.mam_alert, 2000);
      Juke.PlaySound(Sfx.VOICE_HO1)

      return true;
    })
    .addWaitForDialogue()

    //  From herre down = add sounds to speech 

    .addUpdateSaveStep()
    .addSpeak(Enum.ID_MOON_CHIEF, Icon.SPEECH, script.MoonChief.mam1, 4000, Sfx.VOICE_ANGRY2)

    .addTitle(" >>> Enemies spawning from the right - initial wave without Red Face -")

    .addEnemiesRight(4, Enum.SOLDIER_RED1)
    .addWait(10 * 1000)
    .addEnemiesRight(4, Enum.SOLDIER_RED1)

    .addSpeak(Enum.ID_MOON_CHIEF, Icon.SPEECH, script.MoonChief.peons, 4000, Sfx.VOICE_HO2)

    .addWait(10 * 1000)
    .addEnemiesRight(5, Enum.SOLDIER_RED1)
    .addWait(5 * 1000)
    .addEnemiesRight(2, Enum.SOLDIER_RED2)
    .add(()=>{return SequenceHelper.CheckEnemiesLessOrEqual(0)})
    .addUpdateSaveStep()

    .addTitle(" >>> Red Face dialogue, then he appears from the left -")

    .addWait(2000)
    .addSound(Sfx.VOICE_LAUGH1)
    .addDialogueAndWait(redface, script.RedFace.mam1, 7000)

    .addWait(1000)
    .addSpawnRedFace()
    .addSpeak(Enum.ID_MOON_CHIEF, Icon.ANGER, script.MoonChief.mam2, 3000, Sfx.VOICE_ANGRY2)

    .addEnemiesRight(4, Enum.SOLDIER_RED1)
    .addWait(7 * 1000)
    .addEnemiesRight(4, Enum.SOLDIER_RED2)

    .add(()=>{
      return this.redface.hp <= 0;
    })
    .addSound(Sfx.VOICE_THANKFUL1)
    .addDialogueAndWait(redface, script.RedFace.retreat, 7000)
    .addUpdateSaveStep()
    
    //  -

    .addInstruction(Instructions.P3_CHASE_REDFACE)
  }

  //  ============================================================================

  addSpawnRedFace() {
    this.add(()=>{
      const { left } = this.scene.cameras.main.worldView;
      this.redface = this.spawnEnemy(left - 40, Enum.SOLDIER_REDFACE, 15, 10, "Red Face");
      return true;
    });
    return this;
  }
  
  //  -

  addEnemiesRight(amt, ...types) {
    this.add(() => {
      const { right } = this.scene.cameras.main.worldView;
      SequenceHelper.SpawnEnemiesAt(right + Phaser.Math.Between(20, 70), amt, types);
      return true;
    });
    return this;
  }

}
