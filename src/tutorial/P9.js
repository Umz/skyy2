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

let nightSprite, lunarSprite;

export default class P9 extends TutorialSequence {

  init() {

    const { scene } = this;
    const player = this.scene.player;
    const script = Subtitles.GetScript();

    const WIDTH = Vars.AREA_WIDTH;

    //  - Rebuild the village  -----------------------------------------------------------

    this
    .addStopSaving()  // Temp (dev)

    .addWait(1000)
    .add(()=>{
      scene.resetAllStorm();
      return true;
    })
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
    .addWait(6000)
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

    /*
    After 2 trips NT says to recruit the villagers
    Recruit the villagers and optionally continue mining
    Soldier report - Whiteleaf are gathering in the Plains.
    Take an army for a Surprise attack while they are off guard
    */

    // AI - NT goes back and forward delivering (respawns rocks)
    // AI - Citizens go to the mines to increase amount
    // AI - Citizens go to MaM to come back well dressed - save new sheet

    // Sounds - Building - Crafting
    // Delivery - Pickup
    // Break rock -
    
    // Animation - Citizen miniing - Walk with pick

    .add(()=>false)
  }

  //  -------------------------------------------------------------------------------------


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

}
