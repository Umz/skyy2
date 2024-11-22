import Counter from "../util/Counter";
import Enum from "../util/Enum";

export default class EnemyBrain {
  
  constructor(sprite) {
    
    this.sprite = sprite;
    this.scene = sprite.scene;

    this.maxDistance = 100;
    
    this.delayCount = new Counter(750);
    this.cooldownCount = new Counter(500).setLooping(false);
  }

  update(delta) {
    
    const enemy = this.sprite;
    const target = enemy.scene.player;

    const distanceFromTarget = Math.abs(target.x - enemy.x);

    if (enemy.isState(Enum.SS_READY)) {

      const closest = this.getClosest();
      const enDist = closest ? Math.abs(closest.x - enemy.x) : 100;

      const toTarget = Math.abs(enemy.x - target.x)
      const enToTarget = closest ? Math.abs(closest.x - target.x) : 100;

      // Get closest ally

      if (enDist < 24 && enToTarget < toTarget) {
        enemy.stopMove();
        enemy.faceX(target.x);
      }
      else if (distanceFromTarget < 30 && this.cooldownCount.update(delta) && enemy.isLane(target.lane)) {
        
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

  getClosest() {

    let all = this.scene.group_enemies.getChildren();
    let closest = null;
    let closestDistance = Infinity;

    for (let member of all) {
      if (member !== this.sprite) {
        const dist2 = Math.abs(member.x - this.sprite.x);
        if (dist2 < closestDistance) {
          closestDistance = dist2;
          closest = member;
        }
      }
    }

    return closest;
  }

}