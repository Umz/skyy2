import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Sfx from "../const/Sfx";
import Vars from "../const/Vars";
import Ctr from "../util/Ctr";
import Juke from "../util/Juke";
import Subtitles from "../util/Subtitles";
import SequenceHelper from "./SequenceHelper";

let ashSprite, willowSprite, meadowSprite;

export default class P10 extends TutorialSequence {

  init() {

    const player = this.scene.player;
    const script = Subtitles.GetScript();
    const WIDTH = Vars.AREA_WIDTH;
    let killed = 0;

    //  - Full scale war in The Plains with multiple duels -

    this
    .addTitle(" >>> Instructions to go and start a war - duel and kill Tall Ash -")

    .addInstruction(script.Story.P10_GOTO_WAR)
    .add(()=> {
      const group = this.scene.groupAllies.getChildren();
      for (let sol of group) {
        if (sol.uid > 100) {
          sol.controller.resume();
        }
      }
      return true;
    })
    .addUpdateSaveStep()
    .add(()=> player.x >= WIDTH * 5)

    .add(()=>{
      this.tallash.idle();
      player.boostAttack(405);
      this.pauseSoldiersForDuel();
      return true;
    })
    .addShowDuelDOM()
    .add(()=>{
      this.tallash.speak(Icon.CONFUSED, script.Boss.TallAsh, 5000);
      Juke.PlaySound(Sfx.VOICE_HO2);
      return true;
    })
    .add(()=> this.tallash.hp <= 0)
    .addHideDuelDOM()

    .addTitle(" >>> Battle is concluded after Moon Chief wins the duel and attack the soldiers -")
    
    .add(()=>{
      this.resumeSoldiersAfterDuel();
      return true;
    })
    .addSave()
    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.BANNER, script.MoonChief.plains6, 5000, Sfx.VOICE_ATTACK1)

    .add(()=>{
      SequenceHelper.SpawnEnemiesAt(player.x + 200, 15, [Enum.SOLDIER_WL_INFANTRY]);
      return true;
    })
    .add(()=>{
      const enemies = this.scene.groupEnemies.getChildren();
      for (let en of enemies) {
        en.faceX(WIDTH * 6);
        en.showIcon(Icon.CONFUSED, 10 * 1000);
        Ctr.SetActions(en,
          Ctr.Wait(15000)
        )
      }
      return true;
    })
    .add(() => SequenceHelper.CheckEnemiesLessOrEqual(0))
    .add(()=>{
      killed += 15;
      return true;
    })

    .addTitle(" >>> Sneak attack on Falling Willow - duel and kill the unit -")

    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.SKY_SPEAR, script.MoonChief.plains7, 5000, Sfx.VOICE_HO1)
    .add(()=> player.x >= WIDTH * 5.3)

    .addTitle(" >>> Starting a duel with Willow after clearing Soldiers and moving forward -")

    .add(()=>{
      this.pauseSoldiersForDuel();
      this.willow.idle();
      return true;
    })
    .addShowDuelDOM()
    .add(()=>{
      this.willow.speak(Icon.CONFUSED, script.Boss.FallingWillow, 5000);
      Juke.PlaySound(Sfx.VOICE_HO2);
      return true;
    })
    .add(()=> this.willow.hp <= 0)
    .addHideDuelDOM()

    .addTitle(" >>> Battle with the unit under Willow -")

    .add(()=>{
      this.resumeSoldiersAfterDuel();
      return true;
    })
    .addSave()
    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.BANNER, script.MoonChief.plains8, 5000)

    .add(()=>{
      SequenceHelper.SpawnEnemiesAt(player.x + 200, 20, [Enum.SOLDIER_WL_INFANTRY]);
      return true;
    })
    .add(()=>{
      const enemies = this.scene.groupEnemies.getChildren();
      for (let en of enemies) {
        en.faceX(WIDTH * 6);
        en.showIcon(Icon.CONFUSED, 10 * 1000);
        Ctr.SetActions(en,
          Ctr.Wait(5000)
        )
      }
      return true;
    })
    .add(() => SequenceHelper.CheckEnemiesLessOrEqual(0))
    .add(()=>{
      killed += 20;
      return true;
    })
    .addUpdateSaveStep()
    
    .addTitle(" >>> Green Meadow attacks Moon Chief - duel and kill the unit")

    .addWait(2000)
    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.SKY_SPEAR, script.MoonChief.plains9, 5000, Sfx.VOICE_HO1)
    .add(()=> player.x >= WIDTH * 5.7)

    .add(()=>{
      SequenceHelper.SpawnEnemiesAt(player.x + 200, 20, [Enum.SOLDIER_WL_INFANTRY]);
      return true;
    })
    .add(() => SequenceHelper.CheckEnemiesLessOrEqual(10))

    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.SHIELDED_IMPACT, script.MoonChief.plains10, 3000, Sfx.VOICE_ATTACK1)
    .add(()=>{
      SequenceHelper.SpawnEnemiesAt(player.x + 200, 20, [Enum.SOLDIER_WL_INFANTRY]);
      return true;
    })
    .add(() => SequenceHelper.CheckEnemiesLessOrEqual(10))
    .addUpdateSaveStep()

    .addTitle(" >>> Madogu arrives with more troops to help Moon Chief -")

    .add(()=>{
      for (let i=0; i<15; i++) {
        SequenceHelper.SpawnAlly(player.x - 200, Enum.SOLDIER_ALLY_WILDMAN);
      }
      const captain = this.spawnAlly(player.x - 160, Enum.SOLDIER_ALLY_LANCER1, 25, 20, script.Names.Madogu);
      captain.speak(Icon.BANNER, script.Madogu.plains1, 5000);
      Juke.PlaySound(Sfx.VOICE_AMUSED3);
      return true;
    })

    .add(() => SequenceHelper.CheckEnemiesLessOrEqual(3))
    .add(()=>{
      SequenceHelper.SpawnEnemiesAt(player.x + 200, 20, [Enum.SOLDIER_WL_INFANTRY]);
      return true;
    })
    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.SKY_SPEAR, script.MoonChief.plains11, 3000, Sfx.VOICE_ATTACK1)

    .add(()=>{
      SequenceHelper.SpawnEnemiesAt(player.x + 200, 30, [Enum.SOLDIER_WL_INFANTRY]);
      return true;
    })
    .add(() => SequenceHelper.CheckEnemiesLessOrEqual(10))

    .addTitle(" >>> Last duel with Green Meadow final captain of the game -")

    .add(()=>{
      this.pauseSoldiersForDuel();
      this.meadow.idle();
      return true;
    })
    .addShowDuelDOM()
    .add(()=>{
      this.meadow.speak(Icon.ANGER, script.Boss.GreenMeadow1, 5000);
      Juke.PlaySound(Sfx.VOICE_ANGRY2);
      return true;
    })
    .addWaitForDialogue()
    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.QUESTION, script.MoonChief.plains12, 3000, Sfx.VOICE_HO1)
    .add(()=>{
      this.meadow.speak(Icon.HAPPY, script.Boss.GreenMeadow2, 7000);
      Juke.PlaySound(Sfx.VOICE_AMUSED1);
      return true;
    })
    .addWaitForDialogue()
    .addIcon(Enum.ID_MOON_CHIEF, Icon.ANGER, 4000)

    .add(()=> this.meadow.hp <= 0 )
    .addDialogueAndWait(script.Names.GreenMeadow, script.Boss.GreenMeadow3, 8000)
    .addSound(Sfx.VOICE_AMUSED3)
    .addHideDuelDOM()
    .addSave()

    .addTitle(" >>> After Moon Chief is victorious the rest of the enemies flee -")
    
    .add(()=>{
      this.resumeSoldiersAfterDuel();
      return true;
    })
    .add(()=>{

      const allEns = this.scene.groupEnemies.getChildren();
      for (let en of allEns) {
        Ctr.SetActions(en,
          Ctr.Do(()=> en.idle()),
          Ctr.MoveToX(en.x + 640),
          Ctr.Die()
        )
      }

      const allies = this.scene.groupAllies.getChildren();
      for (let ally of allies) {
        const icon = Phaser.Utils.Array.GetRandom([Icon.BANNER, Icon.STANDARD, Icon.FIST_SHIELD, Icon.FIST_FIRE])
        const iconWait = Phaser.Math.Between(1000, 6000);
        Ctr.SetActions(ally,
          Ctr.Do(()=> ally.idle()),
          Ctr.Wait(iconWait),
          Ctr.Do(()=>{ ally.showIcon(icon, 7000) }),
          Ctr.Wait(20 * 1000)
        )
      }

      return true;
    })

    .addIcon(Enum.ID_MOON_CHIEF, Icon.ELLIPSE, 2000)
    .addWait(3000)
    .addSpeakAndWait(Enum.ID_MOON_CHIEF, Icon.BANNER, script.MoonChief.plains13, 3000, Sfx.VOICE_ATTACK1)
  }

  //  ----------------------------------------------------------------------------------------------------

  /** Start Soldiers to start activity after the duel */
  pauseSoldiersForDuel() {
    const player = this.scene.player;
    const group = this.scene.groupSoldiers.getChildren();
    for (let sol of group) {
      if (sol !== player) {
        sol.controller.pause();
        sol.viewController.pause();
        sol.setActive(false);
        sol.setAlpha(.05);
        sol.idle();
        sol.stopMove();
        sol.body.enable = false;
      }
    }
  }
  
  /** Stop Soldiers activity for the duel */
  resumeSoldiersAfterDuel() {
    const player = this.scene.player;
    const group = this.scene.groupSoldiers.getChildren();
    for (let sol of group) {
      if (sol !== player) {
        sol.controller.resume();
        sol.viewController.resume();
        sol.setActive(true);
        sol.setAlpha(1);
        sol.body.enable = true;
      }
    }
  }

  //  - Sprites -
  
  get tallash() {
    if (!ashSprite) {
      const player = this.scene.player;
      const script = Subtitles.GetScript();
      ashSprite = this.spawnEnemy(player.x + 200, Enum.SOLDIER_WL_SPLIT_CLOVER, 25, 15, script.Names.TallAsh);
    }
    return ashSprite;
  }

  get willow() {
    if (!willowSprite) {
      const player = this.scene.player;
      const script = Subtitles.GetScript();
      willowSprite = this.spawnEnemy(player.x + 200, Enum.SOLDIER_WL_SPLIT_CLOVER, 25, 15, script.Names.FallingWillow);
    }
    return willowSprite;
  }

  get meadow() {
    if (!meadowSprite) {
      const player = this.scene.player;
      const script = Subtitles.GetScript();
      meadowSprite = this.spawnEnemy(player.x + 200, Enum.SOLDIER_WL_SPLIT_CLOVER, 25, 15, script.Names.GreenMeadow);
    }
    return meadowSprite;
  }

  spawnLancer(x, name, hp, gp) {
    const sprite = this.spawnAlly(x, Enum.SOLDIER_ALLY_LANCER1, hp, gp, name);
    return sprite;
  }
}
