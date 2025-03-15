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

export function getAllEnemiesWithinRange(sprite, maxDistance) {
  const group = getEnemyGroupForSprite(sprite);
  return getSpritesInRange(sprite, group, maxDistance);
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

/** Get closest citizen from MaM village for a conversation */
export function getClosestMaMCitizenForChat(sprite) {
  const scene = sprite.scene;
  const citizens = scene.groupCitizens.getChildren();
  const available = citizens.filter(sprite => sprite.home === Enum.LOC_MAM && sprite.tribe === Enum.TRIBE_MAM && sprite.uid > 100);
  return getClosestToSpriteInArray(sprite, available, 400);
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

/** Check if the number is within the given ranges (including the minimum and maximum) */
export function isNumberInRange(number, min, max) {
  return number >= min && number <= max;
}

/**
 * Checks if a sprite is within the camera's horizontal view.
 * @param {Phaser.GameObjects.Sprite} sprite The sprite to check.
 * @param {Phaser.Cameras.Scene2D.Camera} camera The camera to check against.
 * @returns {boolean} True if the sprite is within the camera's X bounds, false otherwise.
 */
export function isSpriteInCameraViewX(sprite) {
  const camera = sprite.scene.cameras.main;
  const cameraView = camera.worldView;
  return sprite.x >= cameraView.x && sprite.x <= cameraView.x + cameraView.width;
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
  return getClosestToSpriteInArray(sprite, group.getChildren(), maxDistance);
}

function getClosestToSpriteInArray(sprite, all, maxDistance = Infinity) {

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
