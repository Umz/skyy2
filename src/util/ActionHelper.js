import Enum from "../const/Enum";

/** Get the closest sprite from the opposing group within the given distance */
export function GetClosestEnemyWithinRange(sprite, maxDistance) {
  const group = getEnemyGroupForSprite(sprite);
  return getClosestToSpriteInGroup(sprite, group, maxDistance);
}

export function GetClosestAllyWithinRange(sprite, maxDistance) {
  const group = getAllyGroupForSprite(sprite);
  return getClosestToSpriteInGroup(sprite, group, maxDistance);
}

export function getAnyEnemyWithinRange(sprite, maxDistance) {
  const group = getEnemyGroupForSprite(sprite);
  return getAnySpriteInGroup(sprite, group, maxDistance);
}

/** Get any soldier within range */
export function getClosestSoldierInRange(sprite, range) {
  const scene = sprite.scene;
  return getClosestToSpriteInGroup(sprite, scene.groupSoldiers, range);
}

/** Get the closest citizen to the Player in village */
export function getClosestCitizen(sprite) {
  const scene = sprite.scene;
  return getClosestToSpriteInGroup(sprite, scene.groupCitizens, 600);
}

/** Get X position close to point with minimum gap distance */
export function GetCloseX(fromX, minDist, maxDist, isAnySide = false) {
  
  let distance = Phaser.Math.Between(minDist, maxDist);
  if (isAnySide) {
    const mul = Math.random() > .5 ? 1 : -1;
    distance *= mul;
  }

  const closeX = fromX + distance;
  return closeX;
}

/** Get the range randomly positive or negative */
export function getPlusMinusRange(min, max) {
  const num = Phaser.Math.Between(min, max);
  return getPlusOrMinus(num);
}

/** Return the number with a random plus or minus number */
export function getPlusOrMinus(num) {
  const mul = Math.random() > .5 ? 1 : -1;
  return num * mul;
}

/** Get any other lane than the current lane */
export function getOtherLane(lane) {
  const targetLanes = [1,2,3].filter(l => l !== lane);
  return Phaser.Utils.Array.GetRandom(targetLanes);
}

/** Get the distance between the two X points */
export function getDistanceFrom(x1, x2) {
  const distance = Math.abs(x1 - x2);
  return distance;
}

//  - INTERNAL FUNCTIONS  ---------------------------------------------------------

function getAllyGroupForSprite(sprite) {
  const scene = sprite.scene;
  return isAlly(sprite) ? scene.groupAllies : scene.groupEnemies;
}

function getEnemyGroupForSprite(sprite) {
  const scene = sprite.scene;
  return isAlly(sprite) ? scene.groupEnemies : scene.groupAllies;
}

function isAlly(sprite) {
  return sprite.team === Enum.TEAM_ALLY;
}

function getSpritesInRange(sprite, group, range) {
  
  const all = group.getChildren();
  const inRange = [];

  for (let member of all) {
    if (member !== sprite) {
      const dist2 = Math.abs(member.x - sprite.x);
      if (dist2 <= range) {
        inRange.push(member);
      }
    }
  }

  return inRange;
}

function getClosestToSpriteInGroup(sprite, group, maxDistance = Infinity) {

  const all = group.getChildren();
  let closest = null;
  let closestDistance = Infinity;

  for (let member of all) {
    if (member !== sprite) {
      const dist2 = Math.abs(member.x - sprite.x);
      if (dist2 < closestDistance && dist2 <= maxDistance) {
        closestDistance = dist2;
        closest = member;
      }
    }
  }

  return closest;
}

function getAnySpriteInGroup(sprite, group, maxDistance) {
  const close = getSpritesInRange(sprite, group, maxDistance);
  return Phaser.Utils.Array.GetRandom(close);
}
