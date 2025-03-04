import LunarBuilder from "../ai/LunarBuilder";
import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Sfx from "../const/Sfx";
import Vars from "../const/Vars";
import Ctr from "../util/Ctr";
import Juke from "../util/Juke";
import SaveData from "../util/SaveData";
import Subtitles from "../util/Subtitles";
import SequenceHelper from "./SequenceHelper";

let zollSprite;

export default class P9 extends TutorialSequence {

  init() {

    const player = this.scene.player;
    const script = Subtitles.GetScript();
    const WIDTH = Vars.AREA_WIDTH;

    this
    .addTitle(" >>> Lunar and Night train come to Storm village - Rebuild the village section -")

    .add(() => {
      const lunar = this.getSoldierbyUID(Enum.ID_LUNAR);
      const night = this.getSoldierbyUID(Enum.ID_NIGHT_TRAIN);
      lunar.setController(new LunarBuilder());
      night.idle();
      lunar.idle();
      lunar.setX(player.x - 240);
      night.setX(player.x - 200);
      SaveData.SaveSoldierData(lunar.getSaveData());
      return true;
    })

    .add(()=>{
      const lunar = this.getSoldierbyUID(Enum.ID_LUNAR);
      const night = this.getSoldierbyUID(Enum.ID_NIGHT_TRAIN);
      Ctr.SetActions(night,
        Ctr.MoveToX(player.x + 48)
      );
      Ctr.SetActions(lunar,
        Ctr.MoveToX(player.x - 40),
        Ctr.Wait(5000)
      );
      lunar.showIcon(Icon.SLEDGE, 60 * 1000)
      return true;
    })
    .addSpeakAndWait(Enum.ID_NIGHT_TRAIN, Icon.PICKAXE, script.NightTrain.storm5, 6000, Sfx.VOICE_HO1)
    .addWait(1000)

    .addTitle(" >>> Night Train runs forward to The Mines to secure the resources")

    .add(()=>{
      const night = this.getSoldierbyUID(Enum.ID_NIGHT_TRAIN);
      Ctr.SetActions(night,
        Ctr.MoveToX(Vars.AREA_WIDTH * 4)
      );
      return true;
    })
    
    .add(()=> player.x >= WIDTH * 3.9 )
    .add(()=>{
      const night = this.getSoldierbyUID(Enum.ID_NIGHT_TRAIN);
      Ctr.SetActions(night,
        Ctr.MoveToX(WIDTH * 4.3)
      );
      return true;
    })
    .addSpeakAndWait(Enum.ID_NIGHT_TRAIN, Icon.HAPPY, script.NightTrain.mines10, 4000, Sfx.VOICE_LAUGH1)
    .addWait(500)

    .addTitle(" >>> Night Train begins transporting the resources back to Storm while Moon Chief mines it -")

    .add(()=>{
      const night = this.getSoldierbyUID(Enum.ID_NIGHT_TRAIN);
      night.faceX(player.x);
      night.speak(Icon.PICKAXE, script.NightTrain.mines11, 5000);
      return true;
    })
    .addWait(8000)
    .add(()=>{
      const night = this.getSoldierbyUID(Enum.ID_NIGHT_TRAIN);
      const lunar = this.getSoldierbyUID(Enum.ID_LUNAR);
      Ctr.SetActions(night,
        Ctr.MoveToX(lunar.x),
        Ctr.Do(()=>{
          SaveData.Data.transportedSilica += SaveData.Data.silica;
          SaveData.Data.silica = 0;
        }),
        Ctr.MoveToX(WIDTH * 4.3)
      );
      return true;
    })
    .addSpeakAndWait(Enum.ID_NIGHT_TRAIN, Icon.DOUBLE_ARROW, script.NightTrain.mines12, 4000, Sfx.VOICE_EFFORT1)
    
    .addWait(1000)
    .add(()=>{
      const night = this.getSoldierbyUID(Enum.ID_NIGHT_TRAIN);
      return night.x >= WIDTH * 4.3
    })

    .addTitle(" >>> Finish mining section and go to Storm to recruit villagers to work -")

    .addSpeakAndWait(Enum.ID_NIGHT_TRAIN, Icon.PICKAXE, script.NightTrain.mines13, 3000, Sfx.VOICE_EFFORT1)
    .add(()=>{
      const night = this.getSoldierbyUID(Enum.ID_NIGHT_TRAIN);
      Ctr.SetActions(night,
        Ctr.MoveToX(WIDTH * 4 - 120)
      );
      return true;
    })
    .addSpeak(Enum.ID_NIGHT_TRAIN, Icon.PICKAXE, script.NightTrain.mines14, 3000, Sfx.VOICE_EFFORT1)

    .add(()=>{ return player.x <= WIDTH * 4 })
    .add(()=>{
      // Convert all villagers to miners
      return true;
    })

    .add(()=>{
      Ctr.SetActions(this.zoll,
        Ctr.MoveToX(player.x - 30)
      );
      this.zoll.speak(Icon.SPEECH, script.Zoll.storm1, 7000);
      Juke.PlaySound(Sfx.VOICE_THANKFUL1);
      return true;
    })
    .addWaitForDialogue()

    .add(()=>{
      Ctr.SetActions(this.zoll,
        Ctr.MoveToX(WIDTH * 2.5),
        Ctr.Wait(60 * 60 * 1000)
      );
      return true;
    })

    .add(()=>{ return player.x <= WIDTH * 2.8})
    .add(()=>{
      
      for (let i=0; i< 15; i++) {
        const pX = this.zoll.x - 24 - (i * 18);
        const ally = SequenceHelper.SpawnAlly(pX, Enum.SOLDIER_ALLY_HEAVY1);
        ally.faceX(this.zoll.x);
        ally.p9 = true;

        Ctr.SetActions(ally,
          Ctr.Wait(60 * 60 * 1000)
        );
      }
      return true;
    })

    .add(()=>{ return player.x <= WIDTH * 2.5 + 60 })

    .add(()=>{
      Ctr.SetActions(this.zoll,
        Ctr.Wait(100)
      );
      this.zoll.faceX(player.x);
      return true;
    })

    .add(()=>{
      this.zoll.speak(Icon.EXCLAIM, script.Zoll.storm2, 7000);
      Juke.PlaySound(Sfx.VOICE_HO1);
      return true;
    })
    .addWaitForDialogue()

    .add(()=>{
      this.zoll.speak(Icon.EXCLAIM, script.Zoll.storm3, 5000);
      Juke.PlaySound(Sfx.VOICE_HO1);
      return true;
    })
    .addWaitForDialogue()
    
    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.SKY_SPEAR, script.MoonChief.rose8, 3000, Sfx.VOICE_LAUGH1)
    .addWait(2000)
    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.BANNER, script.MoonChief.mam5, 5000, Sfx.VOICE_ATTACK1)
  }

  //  -------------------------------------------------------------------------------------

  get zoll() {
    if (!zollSprite) {
      const script = Subtitles.GetScript();
      const player = this.scene.player;
      zollSprite = this.spawnAlly(player.x - 240, Enum.SOLDIER_ALLY_LANCER1, 30, 10, script.Names.Zoll);
      zollSprite.speed = 104;
    }
    return zollSprite;
  }

}
