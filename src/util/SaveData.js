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
      Object.assign(data, savedData);
    }
    this.DevData(6);
    console.log("Loaded data", data)

    return data;
  }

  static DevData(dataset = 0) {
    switch (dataset) {

      case 5:
        data.transportedSilica = 1050;
        data.tutorialNumber = 9;
        data.tutorialSequenceStep = 0;
        data.hasBlueMoon = true;
        break;

      case 4:
        data.hasBlueMoon = true;
        //data.playerX = Vars.AREA_WIDTH * 1.8;
        data.tutorialSequenceStep = 40;
        data.tutorialNumber = 4;
        data.claimed = [1,2,3];
        break;

      case 3:
        data.hasBlueMoon = true;
        data.playerX = Vars.AREA_WIDTH * 4.5;
        data.tutorialSequenceStep = 0;
        data.tutorialNumber = 7;
        data.silica = 0;
        break;
    
      case 2:
        data.tutorialSequenceStep = 86;
        data.playerX = Vars.AREA_WIDTH * 0.65;
        break;
    
      case 1:
        data.claimed = [2];
        data.tutorialNumber = 5;
        data.tutorialSequenceStep = 0;
        // data.tutorialSequenceStep = 27;
        data.hasBlueMoon = true;
        data.playerX = Vars.AREA_WIDTH * 1.45;
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
