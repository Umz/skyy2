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

export function getPlusOrMinus(num) {
  const mul = Math.random() > .5 ? 1 : -1;
  return num * mul;
}

/** Get any other lane than the current lane */
export function getOtherLane(lane) {
  const targetLanes = [1,2,3].filter(l => l !== lane);
  return Phaser.Utils.Array.GetRandom(targetLanes);
}

//  - INTERNAL FUNCTIONS  -

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

function findClosestInAllies(scene) {
  const group = scene.groupAllies;
  return this.getClosestToSpriteInGroup(group);
}

function findClosestInEnemies(scene) {
  const group = scene.groupEnemies;
  return this.getClosestToSpriteInGroup(group);
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

//  -
