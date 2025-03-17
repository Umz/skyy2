import localforage from "localforage";
import Enum from "../const/Enum";
import Vars from "../const/Vars";

const GAME_DATA = "GAME_DATA";

// Kills, Collects
let data = {
}

const initial = {
  
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
  // Language
  // Sound
  // Music
  // Difficulty
}

export default class SaveData {

  static DELETE_SAVE() {
    localforage.removeItem(GAME_DATA).then(function() {
      data = {...initial};
    }).catch(function(err) {
      console.log(err);
    });
  }

  static SAVE_GAME_DATA() {

    const empty = {};
    const saveData = Object.assign(empty, data);

    convertPlaytime(saveData);
    saveData.playerX = Math.floor(saveData.playerX);

    //console.log("Saving data:")
    //console.log(saveData)

    localforage.setItem(GAME_DATA, saveData);
  }

  static PRELOAD() {
    SaveData.isLoaded = false;
    localforage.getItem(GAME_DATA)
      .then(saveData => {
        if (saveData) {
          data = saveData;
          //console.log("Game Data loaded with preload:")
          //console.log(data)
        }
        SaveData.isLoaded = true;
      })
      .catch(error => {
        console.error("Error loading data: ", error);
      })
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

  static RemoveSoldier(uid) {
    data.soldiers = data.citizens.filter(citData => citData.uid !== uid);
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

function getSaveDataChrome() {
  return {}
}
