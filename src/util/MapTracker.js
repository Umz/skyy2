import Vars from "./Vars";

/**
 * Utility Class checks the areas that have been visited each session for dynamic resources loading
 */
export default class MapTracker {

  constructor() {
    this.visitedAreas = [];
    this.currentAreaID = -1;
    this.areaEnterCooldown = 0;
  }

  /** Check if the player has entered a new area (only accepts after cooldown) */
  checkForNewArea(delta, posX) {
    
    const posAreaID = this.getCurrentAreaID(posX);

    //  Initially just set the value
    if (this.currentAreaID === -1) {
      this.currentAreaID = posAreaID;
    }
    else if (this.currentAreaID !== posAreaID) {
      this.areaEnterCooldown += delta;
      if (this.areaEnterCooldown >= 3000) {

        this.currentAreaID = posAreaID;
        this.areaEnterCooldown = 0;

        return posAreaID;
      }
    }
    else {
      this.areaEnterCooldown = 0;
    }

    return -1;
  }

  /** Get the left X of the area */
  getAreaLeftX() {
    return (this.currentAreaID - 1) * Vars.AREA_WIDTH;
  }

  /** Get the right X of the area */
  getAreaRightC() {
    return this.currentAreaID * Vars.AREA_WIDTH;
  }

  /** Update the area ID from position X */
  updateAreaID(posX) {
    const areaID = Math.ceil(posX / Vars.AREA_WIDTH);
    this.currentAreaID = areaID;
  }

  /** The ID for the current area based on position and uniform area size */
  getCurrentAreaID(posX) {
    const areaID = Math.ceil(posX / Vars.AREA_WIDTH);
    return areaID;
  }

  /** Check if the area is being visited for the first time this session */
  isFirstTimeInAreaThisSession(posX) {
    
    const areaID = this.getCurrentAreaID(posX);
    if (!this.visitedAreas.includes(areaID)) {
      this.visitedAreas.push(areaID);
      return true;
    }

    return false;
  }
}