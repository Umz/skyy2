import LunarBuilder from "../ai/LunarBuilder";
import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Vars from "../const/Vars";
import { getDistanceFrom } from "../util/ActionHelper";
import Ctr from "../util/Ctr";
import SaveData from "../util/SaveData";
import Subtitles from "../util/Subtitles";
import SequenceHelper from "./SequenceHelper";

let nightSprite, lunarSprite, zollSprite;

export default class P9 extends TutorialSequence {

  init() {

    const { scene } = this;
    const player = this.scene.player;
    const script = Subtitles.GetScript();

    const WIDTH = Vars.AREA_WIDTH;

    //  - Rebuild the village  -----------------------------------------------------------

    this
    .add(() => {
      this.night.idle();
      this.lunar.idle();
      return true;
    })

    .add(()=>{
      Ctr.SetActions(this.night,
        Ctr.MoveToX(player.x + 48)
      );
      Ctr.SetActions(this.lunar,
        Ctr.MoveToX(player.x - 40),
        Ctr.Wait(5000)
      );
      this.lunar.showIcon(Icon.SLEDGE, 60 * 1000)
      this.night.speak(Icon.PICKAXE, "No time to rest MC! We need to secure The Mines!", 6000)
      return true;
    })
    .addWaitForDialogue()
    .addWait(1000)

    .add(()=>{
      Ctr.SetActions(this.night,
        Ctr.MoveToX(Vars.AREA_WIDTH * 4)
      );
      return true;
    })
    
    .add(()=> player.x >= WIDTH * 3.9)
    .add(()=>{
      Ctr.SetActions(this.night,
        Ctr.MoveToX(WIDTH * 4.3)
      );
      this.night.speak(Icon.HAPPY, "Hah! I was worried for nothing, it's all clear!", 4000)
      return true;
    })
    .addWaitForDialogue()
    .addWait(500)

    .add(()=>{
      this.night.faceX(player.x);
      this.night.speak(Icon.PICKAXE, "Come on MC! We need more silica. Let's work.", 5000);
      return true;
    })
    .addWait(8000)
    .add(()=>{
      Ctr.SetActions(this.night,
        Ctr.MoveToX(this.lunar.x),
        Ctr.Do(()=>{
          SaveData.Data.transportedSilica += SaveData.Data.silica;
          SaveData.Data.silica = 0;
        }),
        Ctr.MoveToX(WIDTH * 4.3)
      );
      this.night.speak(Icon.DOUBLE_ARROW, "I'll run it to Storm. Keep it coming!", 4000)
      return true;
    })
    
    .addWait(1000)
    .add(()=>{ return this.night.x >= WIDTH * 4.3 })

    .addNightSpeak(Icon.PICKAXE, "We'll need more. We'll need alot more!", 3000)
    .add(()=>{
      Ctr.SetActions(this.night,
        Ctr.MoveToX(WIDTH * 4 - 120)
      );
      this.night.speak(Icon.SPEECH, "Come to Storm, I'll hire some villagers.", 3000);
      return true;
    })

    .add(()=>{ return player.x <= WIDTH * 4 })
    .add(()=>{
      // Convert all villagers to miners
      return true;
    })

    .add(()=>{
      Ctr.SetActions(this.zoll,
        Ctr.MoveToX(player.x - 30)
      );
      this.zoll.speak(Icon.SPEECH, "Sir, we have news on Whiteleaf. Please come to Rose Forest.", 7000);
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
      this.zoll.speak(Icon.EXCLAIM, "Sir! The Whiteleaf tribe are camped in The Plains preparing an attack.", 7000);
      return true;
    })
    .addWaitForDialogue()

    .add(()=>{
      this.zoll.speak(Icon.EXCLAIM, "My unit are ready to ambush them. Please lead us!.", 5000);
      return true;
    })
    .addWaitForDialogue()
    
    .addSpeakerAndWait(player, Icon.SKY_SPEAR, "A true warrior!", 3000)
    .addWait(2000)
    .addSpeakerAndWait(player, Icon.BANNER, "To battle!", 5000)
  }

  //  -------------------------------------------------------------------------------------

  addNightSpeak(icon, text, ttl) {
    this.add(()=>{
      this.night.speak(icon, text, ttl);
      return true;
    })
    .addWaitForDialogue()
    .addWait(500);
    return this;
  }

  //  - Creation of Sprites -
  get night() {
    if (!nightSprite) {
      const player = this.scene.player;
      nightSprite = SequenceHelper.SpawnAlly(player.x - 200, Enum.SOLDIER_NIGHTTRAIN);
      nightSprite.setDisplayName("Night Train", Enum.TEAM_ALLY);
      nightSprite.setHP(30, 30);
      nightSprite.setGP(10, 10);
      nightSprite.speed = 128;
    }
    return nightSprite;
  }

  get lunar() {
    if (!lunarSprite) {
      const player = this.scene.player;
      lunarSprite = SequenceHelper.SpawnAlly(player.x - 240, Enum.SOLDIER_LUNAR);
      lunarSprite.setDisplayName("Lunar", Enum.TEAM_ALLY);
      lunarSprite.setHP(30, 30);
      lunarSprite.setGP(10, 10);
      lunarSprite.setController(new LunarBuilder());
      lunarSprite.speed = 64;
    }
    return lunarSprite;
  }

  get zoll() {
    if (!zollSprite) {
      const player = this.scene.player;
      zollSprite = SequenceHelper.SpawnAlly(player.x - 240, Enum.SOLDIER_ALLY_LANCER1);
      zollSprite.setDisplayName("Zoll", Enum.TEAM_ALLY);
      zollSprite.setHP(30, 30);
      zollSprite.setGP(10, 10);
      zollSprite.speed = 104;
    }
    return zollSprite;
  }

}
