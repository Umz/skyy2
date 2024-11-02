import Vars from "./Vars";

/**
 * Utility Class checks the areas that have been visited each session for dynamic resources loading
 */
export default class MapTracker {

  constructor() {
    this.visitedAreas = [];
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