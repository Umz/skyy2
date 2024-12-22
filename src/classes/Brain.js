import Counter from "../util/Counter";
import Enum from "../util/Enum";

export default class Brain {

  constructor(sprite) {

    this.sprite = sprite;
    this.scene = sprite.scene;
    this.mode = Enum.SM_IDLE;
    this.target = null;
    this.team = Enum.TEAM_ALLY;

    this.battleRangeDistance = 100;
    this.attackRangeDistance = 42;

    this.laneMoveCounter = new Counter(250);
    this.attackDelayCounter = new Counter(750);
  }

  update(delta) {
    switch (this.mode) {
      case Enum.SM_IDLE:
        this.setTargetToClosestEnemy();
        break;
      case Enum.SM_GET_CLOSE:
        if (this.avoidingOverlap()) {
          this.moveIntoBattleRange();
        }
        break;
      case Enum.SM_ATTACK:
        if (this.attackModeChecks()) {
          const isSameLane = this.moveIntoTargetLane(delta);
          if (isSameLane) {
            this.attackWhenAvailable(delta);
          }
        }
        break;
    }
  }

  isAlly() {
    return this.team === Enum.TEAM_ALLY;
  }

  getAllyGroupForSprite() {
    return this.isAlly() ? this.findClosestInAllies() : this.findClosestInEnemies();
  }

  getEnemyGroupForSprite() {
    return this.isAlly() ? this.findClosestInEnemies() : this.findClosestInAllies();
  }

  findClosestInAllies() {
    const group = this.scene.groupAllies;
    return this.getClosestToSpriteInGroup(group);
  }

  findClosestInEnemies() {
    const group = this.scene.groupEnemies;
    return this.getClosestToSpriteInGroup(group);
  }

  //  ---
  
  //  Find will become more advanced?
  //  Find closest, untargetted
  //  Find closest, least targetted

  setTargetToClosestEnemy() {
    const target = this.isAlly() ? this.findClosestInEnemies() : this.findClosestInAllies();
    if (target) {
      this.target = target;
      this.mode = Enum.SM_GET_CLOSE;
    }
  }

  //  ---

  /** The attack logic defines what to do when this sprite is within attacking range */
  attackLogic(delta) {
    this.sprite.faceX(this.target.x);
    this.sprite.stopMove();
    if (this.attackDelayCounter.update(delta)) {
      this.sprite.attack();
    }
  }

  attackWhenAvailable(delta) {
    if (this.sprite.isState(Enum.SS_READY)) {
      const inRangeToAttack = this.isInAttackRange();
      if (inRangeToAttack) {
        this.attackLogic(delta);
      }
    }
  }

  attackModeChecks() {
    if (this.isCancelAttackMode()) {
      this.mode = Enum.SM_GET_CLOSE;
      return false;
    }
    return true;
  }

  isCancelAttackMode() {
    return this.sprite.isState(Enum.SS_HURT);
  }

  isInAttackRange() {
    const distanceToTarget = Math.abs(this.sprite.x - this.target.x);
    return (distanceToTarget <= this.attackRangeDistance);
  }

  //  ---

  moveIntoBattleRange() {
    if (this.moveSpriteToDistance(this.battleRangeDistance)) {
      this.mode = Enum.SM_ATTACK;
    }
  }

  moveSpriteToDistance(distance) {

    const distanceToTarget = Math.abs(this.sprite.x - this.target.x);
    if (distanceToTarget > distance) {
      this.sprite.moveTowards(this.target.x);
    }
    else {
      this.sprite.stopMove();
      this.sprite.faceX(this.target.x);
      return true;
    }
    return false;
  }

  moveIntoTargetLane(delta) {

    if (this.sprite.isState(Enum.SS_READY)) {

      const isSameLane = this.sprite.isLane(this.target.lane);

      if (!isSameLane) {
        if (this.laneMoveCounter.update(delta)) {
          this.sprite.towardsLane(this.target.lane);
        }
      }
      else {
        return true;
      }
    }

    return false;
  }

  //  ---

  avoidingOverlap() {

    const spriteAlliesGroup = thiis.getAllyGroupForSprite();
    const closestAlly = this.getClosestToSpriteInGroup(spriteAlliesGroup);

    if (closestAlly && closestAlly?.target === this.target) {
      
      const distanceToAlly = Math.abs(closestAlly.x - this.sprite.x);
      const distanceToTarget = Math.abs(this.sprite.x - this.target.x);
      const allyDistanceToTarget = Math.abs(closestAlly.x - this.target.x);

      // Stop and allow ally to go ahead if overlapped and they are closer to the target
      if (distanceToAlly < 24 && allyDistanceToTarget < distanceToTarget) {
        this.sprite.stopMove();
        this.sprite.faceX(this.target.x);
        return false;
      }
    }
    
    return true;
  }

  //  ---

  getClosestToSpriteInGroup(group) {

    const all = group.getChildren();
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

  //  ----

  setLaneMoveDelay(millis) {
    this.laneMoveCounter.setMax(millis);
  }

  setAttackDelay(millis) {
    this.attackDelayCounter.setMax(millis);
  }

  setCooldown(millis) {
    this.cooldownCount.setMax(millis);
  }

}