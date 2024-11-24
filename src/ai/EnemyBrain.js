import Counter from "../util/Counter";
import Enum from "../util/Enum";

export default class EnemyBrain {
  
  constructor(sprite) {
    
    this.sprite = sprite;
    this.scene = sprite.scene;

    this.maxDistance = 100;
    this.mode = Enum.SM_IDLE;

    this.target = null;
    
    this.laneMoveCounter = new Counter(250);
    this.attackDelayCounter = new Counter(750);
    this.cooldownCount = new Counter(500).setLooping(false);
  }

  //  Action based?
  //  Enemy modes?
  //  Mix up of both
  // 1- Goto, 2- Check, 3- Wait, 4- Attack

  // 1- Go to enemy and attack, back off, attack

  update(delta) {

    switch (this.mode) {
      
      case Enum.SM_IDLE:
        this.findTarget();
        break;

      case Enum.SM_ATTACK:
        this.attackModeUpdate(delta);
        break;

      case Enum.SM_CLOSE:
        if (!this.avoidAllyOverlap()) {
          this.moveToBattleRange();
        }
        break;
    }

  }

  // This will check that the sprites have the same target
  getClosestAlly() {

    const all = this.scene.group_enemies.getChildren();
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

  // This must check that the closest ally has the same target
  getClosestAllyToTarget() {
    
    const all = this.scene.group_enemies.getChildren();
    let closest = null;
    let closestDistance = Infinity;

    for (let member of all) {
      const dist2 = Math.abs(member.x - this.target.x);
      if (dist2 < closestDistance) {
        closestDistance = dist2;
        closest = member;
      }
    }

    return closest;
  }

  // This should only check for the side of the target this sprite is on - other side should check that side (all lanes included)
  isClosestToTarget() {
    const closestToTarget = this.getClosestAllyToTarget();
    return this.sprite === closestToTarget;
  }

  // Vanish if too far from player

  // Find target will find the closest target
  findTarget() {
    if (!this.target) {
      this.target = this.scene.player;
      this.mode = Enum.SM_CLOSE;
    }
  }

  attackModeUpdate(delta) {

    // Check here if target exists and return if it does not!

    switch (this.sprite.state) {
      case Enum.SS_READY:

        const inAttackRange = this.moveToAttackRange();
        const isSameLane = this.sprite.isLane(this.target.lane);
        
        if (inAttackRange && isSameLane) {
          this.sprite.faceX(this.target.x);
          this.sprite.stopMove();
          if (this.attackDelayCounter.update(delta)) {
            this.sprite.attack();
          }
        }
        else if (!isSameLane) {
          if (this.laneMoveCounter.update(delta)) {
            this.sprite.towardsLane(this.target.lane);
          }
        }

        if (!this.isClosestToTarget()) {
          this.mode = Enum.SM_CLOSE;
        }

        // Go close enough to attack and then attack (if you are the closest)
        // If not the closest? Change modes

        break;

      case Enum.SS_HURT:
        this.mode = Enum.SM_CLOSE;
        break;
    }
  }

  avoidAllyOverlap() {

    const enemy = this.sprite;
    const target = enemy.scene.player;

    const closestAlly = this.getClosestAlly();
    const distBetweenAlly = closestAlly ? Math.abs(closestAlly.x - enemy.x) : 100;

    const distanceToTarget = Math.abs(enemy.x - target.x);
    const allyDistanceToTarget = closestAlly ? Math.abs(closestAlly.x - target.x) : 100;

    // Stop and allow ally to go if they are closer to the target
    if (distBetweenAlly < 24 && allyDistanceToTarget < distanceToTarget) {
      enemy.stopMove();
      enemy.faceX(target.x);
      return true;
    }

    return false;
  }

  moveToBattleRange() {
    const distanceToTarget = Math.abs(this.sprite.x - this.target.x);
    const attackDistance = this.maxDistance;
    if (distanceToTarget > attackDistance) {
      this.sprite.moveTowards(this.target.x);
    }
    else {
      this.sprite.stopMove();
      this.sprite.faceX(this.target.x);
      if (this.isClosestToTarget()) {
        this.mode = Enum.SM_ATTACK;
      }
    }
  }

  moveToAttackRange() {
    const distanceToTarget = Math.abs(this.sprite.x - this.target.x);
    const attackDistance = 42;
    if (distanceToTarget > attackDistance) {
      this.sprite.moveTowards(this.target.x);
      return false;
    }
    return true;
  }

}
