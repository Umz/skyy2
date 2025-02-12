import TutorialSequence from "../classes/TutorialSequence";
import Enum from "../const/Enum";
import Icon from "../const/Icon";
import Instructions from "../const/Instructions";
import Vars from "../const/Vars";
import Ctr from "../util/Ctr";
import SaveData from "../util/SaveData";
import Subtitles from "../util/Subtitles";
import SequenceHelper from "./SequenceHelper";

let ashSprite, willowSprite, meadowSprite;

export default class P10 extends TutorialSequence {

  init() {

    const { scene } = this;
    const player = this.scene.player;
    const script = Subtitles.GetScript();

    const WIDTH = Vars.AREA_WIDTH;

    const MAX = 300;
    let killed = 0;

    //  - Full scale war in The Plains with multiple duels -

    this
    .addStopSaving()  // Temp (dev)

    .addTitle(" >>> Instructions to go and start a war - duel and kill Tall Ash -")

    .addInstruction(Instructions.P10_GOTO_WAR)
    .add(()=> player.x >= WIDTH * 5)

    .add(()=>{
      this.tallash.idle();
      return true;
    })
    .add(()=>{
      this.stopSoldiersForDuel();
      return true;
    })
    .addShowDuelDOM()
    .add(()=>{
      this.tallash.speak(Icon.CONFUSED, "Why are you here!? Moon Chief the bastard warrior!", 5000);
      return true;
    })
    .add(()=>{
      return this.tallash.hp <= 0;
    })
    .addHideDuelDOM()
    
    .add(()=>{
      this.startSoldiersAfterDuel();
      return true;
    })
    .addSpeakerAndWait(player, Icon.BANNER, "Slaughter the rest of them while they are surprised", 5000)

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
          Ctr.Wait(5000)
        )
      }
    })
    .add(() => SequenceHelper.CheckEnemiesLessOrEqual(0))
    .add(()=>{
      killed += 15;
      return true;
    })

    .addTitle(" >>> Sneak attack on Falling Willow - duel and kill the unit")

    .addSpeakerAndWait(player, Icon.SKY_SPEAR, "Move forward, quickly, we still have the upper hand", 5000)
    .add(()=> player.x >= WIDTH * 5.3)

    .addTitle(" >>> Starting a duel with Willow")

    .add(()=>{
      this.willow.idle();
      return true;
    })
    .add(()=>{
      this.stopSoldiersForDuel();
      return true;
    })
    .addShowDuelDOM()
    .add(()=>{
      this.willow.speak(Icon.CONFUSED, "Hah! So you caught us off guard!", 5000);
      return true;
    })
    .add(()=>{
      return this.willow.hp <= 0;
    })
    .addHideDuelDOM()

    .addTitle(" >>> Battle with the unit under Willow")

    .add(()=>{
      this.startSoldiersAfterDuel();
      return true;
    })
    .addSpeakerAndWait(player, Icon.BANNER, "Slaughter the rest! Don't let them regroup", 5000)

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
    })
    .add(() => SequenceHelper.CheckEnemiesLessOrEqual(0))
    .add(()=>{
      killed += 20;
      return true;
    })
    
    .addTitle(" >>> Green Meadow attacks Moon Chief - duel and kill the unit")

    .addWait(2000)
    .addSpeakerAndWait(player, Icon.SKY_SPEAR, "Come my warriors, now we charge their main force", 5000)
    .add(()=> player.x >= WIDTH * 5.7)

    .add(()=>{
      SequenceHelper.SpawnEnemiesAt(player.x + 200, 20, [Enum.SOLDIER_WL_INFANTRY]);
      return true;
    })
    .add(() => SequenceHelper.CheckEnemiesLessOrEqual(10))

    .addSpeakerAndWait(player, Icon.SHIELDED_IMPACT, "Brace yourselves! More are coming!", 3000)
    .add(()=>{
      SequenceHelper.SpawnEnemiesAt(player.x + 200, 20, [Enum.SOLDIER_WL_INFANTRY]);
      return true;
    })
    .add(() => SequenceHelper.CheckEnemiesLessOrEqual(10))

    .addTitle(" >>> Madogu arrives with more troops to help Moon Chief")

    .add(()=>{
      const cap = this.spawnAlly(player.x - 200, "Madogu", 20, 10);
      for (let i=0; i<15; i++) {
        SequenceHelper.SpawnAlly(player.x - 200, Enum.SOLDIER_ALLY_WILDMAN);
      }
      cap.speak(Icon.BANNER, "You should have called us Moon Chief! We came here to aid you!", 5000)
      return true;
    })
    .addWaitForDialogue()

    .add(() => SequenceHelper.CheckEnemiesLessOrEqual(3))
    .add(()=>{
      SequenceHelper.SpawnEnemiesAt(player.x + 200, 20, [Enum.SOLDIER_WL_INFANTRY]);
      return true;
    })
    .addSpeakerAndWait(player, Icon.SKY_SPEAR, "Hah! Dig deep for the next wave!", 3000)

    .add(()=>{
      SequenceHelper.SpawnEnemiesAt(player.x + 200, 30, [Enum.SOLDIER_WL_INFANTRY]);
      return true;
    })
    .add(() => SequenceHelper.CheckEnemiesLessOrEqual(10))

    .addTitle(" >>> Last duel with Green Meadow final captain of the game")

    .add(()=>{
      this.meadow.idle();
      return true;
    })
    .add(()=>{
      this.stopSoldiersForDuel();
      return true;
    })
    .addShowDuelDOM()
    .add(()=>{
      this.meadow.speak(Icon.ANGER, "What a joke. Who knew this backwater hovel had any actual warriors!", 5000);
      return true;
    })
    .addWaitForDialogue()
    .addSpeakerAndWait(player, Icon.QUESTION, "I am Moon Chief of Moon at Midnight.", 3000)
    .add(()=>{
      this.meadow.speak(Icon.HAPPY, "Country bumpkin. You are no one! From this unknown jut in the middle of nowhere!", 7000);
      return true;
    })
    .addWaitForDialogue()
    .addIcon(player, Icon.ANGER, 4000)

    .add(()=>{
      return this.meadow.hp <= 0;
    })
    .addDialogueAndWait("Green Meadow", "Powerful indeed. You have defeated me bumpkin. Maybe you will be strong enough to see the real world.", 8000)
    .addHideDuelDOM()

    .addTitle(" >>> After Moon Chief is victorious the rest of the enemies flee")
    
    .add(()=>{
      this.startSoldiersAfterDuel();
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

    .addIcon(player, Icon.ELLIPSE, 2000)
    .addWait(3000)
    .addSpeakerAndWait(player, Icon.BANNER, "We have defeated the Whiteleaf Army!", 3000)

    .add(()=> false)
  }

  //  ----------------------------------------------------------------------------------------------------

  /** Start Soldiers to start activity after the duel */
  startSoldiersAfterDuel() {
    const group = this.scene.groupSoldiers.getChildren();
    for (let sol of group) {
      if (sol !== player && sol !== this.tallash) {
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
  stopSoldiersForDuel() {
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
      ashSprite = this.spawnBoss(player.x + 200, "Tall Ash", 25, 15);
    }
    return ashSprite;
  }

  get willow() {
    if (!willowSprite) {
      const player = this.scene.player;
      willowSprite = this.spawnBoss(player.x + 200, "Falling Willow", 25, 15);
    }
    return willowSprite;
  }

  get meadow() {
    if (!meadowSprite) {
      const player = this.scene.player;
      meadowSprite = this.spawnBoss(player.x + 200, "Green Meadow", 25, 15);
    }
    return meadowSprite;
  }

  spawnBoss(x, name, hp, gp) {
    const sprite = SequenceHelper.SpawnEnemy(x, Enum.SOLDIER_WL_SPLIT_CLOVER);
    sprite.setDisplayName(name, Enum.TEAM_ENEMY);
    sprite.setHP(hp, hp);
    sprite.setGP(gp, gp);
    return sprite;
  }

  spawnAlly(x, name, hp, gp) {
    const sprite = SequenceHelper.SpawnAlly(x, Enum.SOLDIER_ALLY_LANCER1);
    sprite.setDisplayName(name, Enum.TEAM_ALLY);
    sprite.setHP(hp, hp);
    sprite.setGP(gp, gp);
    return sprite;
  }
}
