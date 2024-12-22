export default class Move {

  static ToBattleRange(sprite, target, distance) {

    const distanceToTarget = Math.abs(sprite.x - target.x);
    if (distanceToTarget > distance) {
      sprite.moveTowards(target.x);
    }
    else {
      sprite.stopMove();
      sprite.faceX(target.x);
      return true;
    }
    return false;
  }

}