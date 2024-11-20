import Counter from "../util/Counter";
import Enum from "../util/Enum";

export default class EnemyBrain {
  
  constructor(sprite) {
    this.sprite = sprite;

    this.maxDistance = 120;
    
    this.delayCount = new Counter(750);
    this.cooldownCount = new Counter(500).setLooping(false);
  }

  update(delta) {
    
    const enemy = this.sprite;
    const target = enemy.scene.player;

    const distanceFromTarget = Math.abs(target.x - enemy.x);

    if (enemy.isState(Enum.SS_READY)) {
      if (distanceFromTarget < 30 && this.cooldownCount.update(delta) && enemy.isLane(target.lane)) {
        
        if (this.delayCount.update(delta)) {
          enemy.attack();
          this.cooldownCount.resetCount();
          this.delayCount.resetCount(this.delayCount.maxCount - 150);
        }
      }
      else if (distanceFromTarget > this.maxDistance) {
        enemy.moveTowards(target.x);
      }
      else if (!enemy.isLane(target.lane)) {
        if (this.delayCount.update(delta)) {
          enemy.towardsLane(target.lane);
        }
      }
      else {
        enemy.stopMove();
        enemy.faceX(target.x);
        enemy.clearTint();
      }
    }
    else if (enemy.isState(Enum.SS_HURT)) {
      this.delayCount.resetCount(this.delayCount.maxCount - 50);
    }

  }
}