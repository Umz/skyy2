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
    
    const posAreaID = Math.ceil(posX / Vars.AREA_WIDTH);

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

  /** Check if the area is being visited for the first time this session */
  isFirstTimeInAreaThisSession(posX) {
    
    const areaID = Math.ceil(posX / Vars.AREA_WIDTH);
    if (!this.visitedAreas.includes(areaID)) {
      this.visitedAreas.push(areaID);
      return true;
    }

    return false;
  }
}