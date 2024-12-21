import Counter from "./Counter";
import Vars from "./Vars";

/** Utility Class checks the areas that have been visited each session for dynamic resources loading */
export default class MapTracker {

  constructor() {

    this.visitedAreas = [];
    
    this.currentAreaID = -1;
    this.lastAreaID = -1;
    this.lastAreaCheck = -1;
    this.isSetInNewArea = false;

    this.cooldownCountdown = new Counter(3000);
  }

  /** Update the current area by the player position */
  updateCurrentArea(playerX) {
    this.currentAreaID = this.getCurrentAreaID(playerX);
  }

  updateLastAreaVisited() {
    if (this.currentAreaID !== this.lastAreaID && !this.isSetInNewArea) {
      this.lastAreaID = this.currentAreaID;
      this.isSetInNewArea = true;
      return true;
    }
    return false;
  }

  /** Check if this is a new area and the name needs to be displayed */
  updateAreaDisplayCount(delta) {

    if (this.currentAreaID !== this.lastAreaID) {
      if (this.cooldownCountdown.update(delta)) {
        this.isSetInNewArea = false;
      }
    }
    else {
      this.isSetInNewArea = true;
    }
    
  }

  /** Check if this is a new area, returning true when it is */
  checkNewArea() {
    if (this.currentAreaID !== this.lastAreaCheck) {
      this.lastAreaCheck = this.currentAreaID;
      return true;
    }
    return false;
  }

  /** Get the left X of the area */
  getAreaLeftX() {
    return (this.currentAreaID - 1) * Vars.AREA_WIDTH;
  }

  /** Get the right X of the area */
  getAreaRightC() {
    return this.currentAreaID * Vars.AREA_WIDTH;
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