import localforage from "localforage";
import Enum from "../const/Enum";
import Vars from "../const/Vars";

const GAME_DATA = "GAME_DATA";

// Kills, Collects
const data = {
  
  playtime: 0,
  playSecs: 0,
  playMins: 0,
  playHours: 0,

  uid: 100,

  silica: 0,
  transportedSilica: 0,
  buildingMaterial: 0,

  playerX: Vars.AREA_WIDTH * 1.5,
  playerLane: 2,
  hasBlueMoon: false,

  citizens: [],
  soldiers: [],
  houses: [],

  location: Enum.LOC_MAM,
  claimed: [Enum.LOC_MAM],

  tutorialNumber: 1,
  tutorialSequenceStep: 0
}

const settings = {
  controllerActive: true
}

export default class SaveData {

  static SAVE_GAME_DATA() {

    const empty = {};
    const saveData = Object.assign(empty, data);

    convertPlaytime(saveData);
    saveData.playerX = Math.floor(saveData.playerX);

    console.log("Saving data:")
    console.log(saveData)

    localforage.setItem(GAME_DATA, saveData);
  }

  static async LOAD_GAME_DATA() {

    const savedData = await localforage.getItem(GAME_DATA);
    if (savedData) {
      //Object.assign(data, savedData);
    }
    this.DevData(2);
    console.log("Loaded data", data)

    return data;
  }

  static DevData(dataset = 0) {
    switch (dataset) {
    
      case 2:
        data.tutorialNumber = 3;
        data.tutorialSequenceStep = 0;
        data.playerX = Vars.AREA_WIDTH * 1;
        data.soldiers.push(
          {
            uid: Enum.ID_BLUE_MOON, prefix: Vars.SHEET_WILDMAN, x: Vars.AREA_WIDTH * 1, state: Enum.SS_READY, team: Enum.TEAM_ALLY, sType: Enum.SOLDIER_BLUEMOON,
            speed: 96, hp: 45, gp: 20, lane: 2, home: Enum.LOC_BLUE_FOREST, name: "Blue Moon", ctr: "BlueMoon"
          }
        )
        break;
    
      case 1:
        data.tutorialNumber = 2;
        data.tutorialSequenceStep = 88;
        data.hasBlueMoon = true;
        data.playerX = Vars.AREA_WIDTH * .45;
        data.location = Enum.LOC_BLUE_FOREST;
        break;
    
      default:
        // Optional: handle cases where dataset doesn't match 1, 2, or 3
        break;
    }
  }

  static get Data() {
    return data;
  }

  static get Settings() {
    return settings;
  }

  static get NewUID() {
    const uid = data.uid;
    data.uid ++;
    return uid;
  }

  //  -

  static SaveSoldierData(soldierData) {
    const saved = data.soldiers.find(sd => sd.uid === soldierData.uid);
    if (saved) {
      Object.assign(saved, soldierData);
    }
    else {
      data.soldiers.push(soldierData);
    }
  }

  static SaveCitizenData(citData) {
    const saved = data.citizens.find(dd => dd.uid === citData.uid);
    if (saved) {
      Object.assign(saved, citData);
    }
    else {
      data.citizens.push(citData);
    }
  }

  //  =

  static SETUP_LOCALFORAGE_CONFIG() {
    localforage.config({
      name: "skyy2-dev1",
      description: "Data store for Skyy2",
      storeName: "skydata"
    })
  }
}

function convertPlaytime(saveData) {

  const millis = Math.round(saveData.playtime);
  const seconds = Math.floor(millis / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  saveData.playtime = millis;
  saveData.playSecs = seconds;
  saveData.playMins = minutes;
  saveData.playHours = hours;
}
