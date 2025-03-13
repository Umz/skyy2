import localforage from "localforage";
import Enum from "../const/Enum";
import Vars from "../const/Vars";

const GAME_DATA = "GAME_DATA";

// Kills, Collects
let data = {
  
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

  static SAVE_GAME_DATA() {

    const empty = {};
    const saveData = Object.assign(empty, data);

    convertPlaytime(saveData);
    saveData.playerX = Math.floor(saveData.playerX);

    console.log("Saving data:")
    console.log(saveData)

    localforage.setItem(GAME_DATA, saveData);
  }

  static LOAD_DEV() {
    data = getSaveDataChrome();
    console.log("Game Data loaded with DEV data:")
    console.log(data)
  }

  static PRELOAD() {
    SaveData.isLoaded = false;
    localforage.getItem(GAME_DATA)
      .then(saveData => {
        if (saveData) {
          data = saveData;
          data = getSaveDataChrome();
          console.log("Game Data loaded with preload:")
          console.log(data)
        }
        SaveData.isLoaded = true;
      })
      .catch(error => {
        console.error("Error loading data from localForage: ", error);
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
  return {
    "playtime": 1278594,
    "playSecs": 1278,
    "playMins": 21,
    "playHours": 0,
    "uid": 580,
    "silica": 46,
    "transportedSilica": 0,
    "buildingMaterial": 0,
    "playerX": 11403,
    "playerLane": 2,
    "citizens": [
      {
        "uid": 101,
        "data": {
          "role": "citizen"
        },
        "sheet": "Citizen_MaM_F2.png",
        "x": 2329.3333333334936,
        "home": 2,
        "tribe": 1,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenMaM"
      },
      {
        "uid": 102,
        "data": {
          "role": "citizen"
        },
        "sheet": "Citizen_MaM_M2.png",
        "x": 2989.999999999959,
        "home": 2,
        "tribe": 1,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenMaM"
      },
      {
        "uid": 103,
        "data": {
          "role": "citizen"
        },
        "sheet": "Citizen_MaM_F1.png",
        "x": 3313.9999999999645,
        "home": 2,
        "tribe": 1,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenMaM"
      },
      {
        "uid": 104,
        "data": {
          "role": "citizen"
        },
        "sheet": "Citizen_MaM_M2.png",
        "x": 2424.000000000157,
        "home": 2,
        "tribe": 1,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenMaM"
      },
      {
        "uid": 105,
        "data": {
          "role": "citizen"
        },
        "sheet": "Citizen_MaM_M2.png",
        "x": 3260.3333333333503,
        "home": 2,
        "tribe": 1,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenMaM"
      },
      {
        "uid": 106,
        "data": {
          "role": "citizen"
        },
        "sheet": "Citizen_MaM_M2.png",
        "x": 2715.000000000008,
        "home": 2,
        "tribe": 1,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenMaM"
      },
      {
        "uid": 107,
        "data": {
          "role": "citizen"
        },
        "sheet": "Citizen_MaM_F1.png",
        "x": 1473.6666666668038,
        "home": 2,
        "tribe": 1,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenMaM"
      },
      {
        "uid": 108,
        "data": {
          "role": "citizen"
        },
        "sheet": "Citizen_MaM_F2.png",
        "x": 3016.333333333272,
        "home": 2,
        "tribe": 1,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenMaM"
      },
      {
        "uid": 109,
        "data": {
          "role": "citizen"
        },
        "sheet": "Citizen_MaM_F1.png",
        "x": 3299.333333333301,
        "home": 2,
        "tribe": 1,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenMaM"
      },
      {
        "uid": 5,
        "data": {
          "role": "citizen"
        },
        "sheet": "Citizen_MaM_King.png",
        "x": 1976.6666666661176,
        "home": 2,
        "tribe": 1,
        "name": "Harvest Moon",
        "address": -1,
        "controller": "CitizenMaM"
      },
      {
        "uid": 6,
        "data": {
          "role": "citizen"
        },
        "sheet": "Citizen_MaM_Glow.png",
        "x": 2819.733333333356,
        "home": 2,
        "tribe": 1,
        "name": "Moon Glow",
        "address": -1,
        "controller": "CitizenWife"
      },
      {
        "uid": 7,
        "data": {
          "role": "citizen"
        },
        "sheet": "Citizen_MaM_Rose.png",
        "x": 2779.600000000014,
        "home": 2,
        "tribe": 1,
        "name": "Moon Rose",
        "address": -1,
        "controller": "CitizenWife"
      },
      {
        "uid": 281,
        "data": {
          "role": "citizen",
          "isJoining": true
        },
        "sheet": "Citizen_Storm_F1.png",
        "x": 6693.333333333539,
        "home": 4,
        "tribe": 1,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenController"
      },
      {
        "uid": 282,
        "data": {
          "role": "citizen",
          "isJoining": true
        },
        "sheet": "Citizen_Storm_F1.png",
        "x": 6595.6666666669,
        "home": 4,
        "tribe": 1,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenController"
      },
      {
        "uid": 283,
        "data": {
          "role": "citizen",
          "isJoining": true
        },
        "sheet": "Citizen_Storm_F2.png",
        "x": 5455.666666666333,
        "home": 4,
        "tribe": 1,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenController"
      },
      {
        "uid": 284,
        "data": {
          "role": "citizen",
          "isJoining": true
        },
        "sheet": "Citizen_Storm_M1.png",
        "x": 6557.666666666594,
        "home": 4,
        "tribe": 1,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenController"
      },
      {
        "uid": 285,
        "data": {
          "role": "citizen",
          "isJoining": true
        },
        "sheet": "Citizen_Storm_M1.png",
        "x": 6651.333333333212,
        "home": 4,
        "tribe": 1,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenController"
      },
      {
        "uid": 286,
        "data": {
          "role": "citizen",
          "isJoining": true
        },
        "sheet": "Citizen_Storm_M1.png",
        "x": 6997.333333333687,
        "home": 4,
        "tribe": 1,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenController"
      },
      {
        "uid": 287,
        "data": {
          "role": "citizen",
          "isJoining": true
        },
        "sheet": "Citizen_Storm_M1.png",
        "x": 6546.000000000036,
        "home": 4,
        "tribe": 1,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenController"
      },
      {
        "uid": 288,
        "data": {
          "role": "citizen",
          "isJoining": true
        },
        "sheet": "Citizen_Storm_M1.png",
        "x": 5480.999999999641,
        "home": 4,
        "tribe": 1,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenController"
      },
      {
        "uid": 289,
        "data": {
          "role": "citizen",
          "isJoining": true
        },
        "sheet": "Citizen_Storm_M1.png",
        "x": 6236.666666666651,
        "home": 4,
        "tribe": 1,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenController"
      },
      {
        "uid": 290,
        "data": {
          "role": "citizen",
          "isJoining": true
        },
        "sheet": "Citizen_Storm_F1.png",
        "x": 7241.666666666948,
        "home": 4,
        "tribe": 1,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenController"
      }
    ],
    "soldiers": [
      {
        "uid": 2,
        "prefix": "Infantry_Wildman.png",
        "x": 9015.453881600592,
        "state": 1,
        "team": 1,
        "sType": 10,
        "speed": 96,
        "hp": 45,
        "gp": 10,
        "lane": 2,
        "home": 2,
        "name": "Blue Moon",
        "ctr": "Lunar1"
      },
      {
        "uid": 191,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 7380.564433067242,
        "state": 1,
        "team": 1,
        "sType": 202,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 192,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 7424.859315200639,
        "state": 1,
        "team": 1,
        "sType": 202,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 193,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 6479.829260800403,
        "state": 1,
        "team": 1,
        "sType": 202,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 194,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 6523.559884800456,
        "state": 1,
        "team": 1,
        "sType": 202,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 219,
        "prefix": "Infantry_MaM.png",
        "x": 6487.3386176002605,
        "state": 1,
        "team": 1,
        "sType": 201,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 220,
        "prefix": "Infantry_MaM.png",
        "x": 13837.046146135224,
        "state": 1,
        "team": 1,
        "sType": 201,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 2,
        "name": "Soldier",
        "ctr": "AllyLight1"
      },
      {
        "uid": 221,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 6503.805376000396,
        "state": 1,
        "team": 1,
        "sType": 202,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 222,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 13719.311731201818,
        "state": 1,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 2,
        "name": "CC 192",
        "ctr": "AllyHeavy2"
      },
      {
        "uid": 246,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 6597.703534933899,
        "state": 1,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 247,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 6602.59776640045,
        "state": 1,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 248,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 7441.467430400592,
        "state": 1,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 249,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 6619.728768000473,
        "state": 1,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 250,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 6489.451769600309,
        "state": 1,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 251,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 6920.247622400509,
        "state": 1,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 252,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 6480.481856000335,
        "state": 1,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 253,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 6616.494438400449,
        "state": 1,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 254,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 6524.379579733769,
        "state": 1,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 3,
        "prefix": "Supplyman_MaM.png",
        "x": 6372.644354133539,
        "state": 1,
        "team": 1,
        "sType": 12,
        "speed": 128,
        "hp": 25,
        "gp": 10,
        "lane": 3,
        "home": 2,
        "name": "NightTrain",
        "ctr": "Nighttrain"
      },
      {
        "uid": 4,
        "prefix": "Advisor_Architect.png",
        "x": 2870.5783039977323,
        "state": 1,
        "team": 1,
        "sType": 13,
        "speed": 96,
        "hp": 25,
        "gp": 10,
        "lane": 1,
        "home": 2,
        "name": "Architect",
        "ctr": "Lunar1"
      }
    ],
    "houses": [
      {
        "num": 0,
        "progress": 0,
        "level": 1,
        "location": 4
      },
      {
        "num": 1,
        "progress": 0,
        "level": 1,
        "location": 4
      },
      {
        "num": 2,
        "progress": 0,
        "level": 1,
        "location": 4
      },
      {
        "num": 3,
        "progress": 0,
        "level": 1,
        "location": 4
      },
      {
        "num": 4,
        "progress": 0,
        "level": 1,
        "location": 4
      },
      {
        "num": 5,
        "progress": 0,
        "level": 1,
        "location": 4
      },
      {
        "num": 6,
        "progress": 0,
        "level": 1,
        "location": 4
      },
      {
        "num": 7,
        "progress": 0,
        "level": 1,
        "location": 4
      },
      {
        "num": 8,
        "progress": 0,
        "level": 1,
        "location": 4
      },
      {
        "num": 9,
        "progress": 0,
        "level": 1,
        "location": 4
      },
      {
        "num": 10,
        "progress": 0,
        "level": 1,
        "location": 4
      },
      {
        "num": 11,
        "progress": 0,
        "level": 1,
        "location": 4
      },
      {
        "num": 12,
        "progress": 0,
        "level": 1,
        "location": 4
      },
      {
        "num": 13,
        "progress": 0,
        "level": 1,
        "location": 4
      },
      {
        "num": 14,
        "progress": 0,
        "level": 1,
        "location": 4
      },
      {
        "num": 15,
        "progress": 0,
        "level": 1,
        "location": 4
      },
      {
        "num": 16,
        "progress": 0,
        "level": 1,
        "location": 4
      },
      {
        "num": 17,
        "progress": 0,
        "level": 1,
        "location": 4
      },
      {
        "num": 18,
        "progress": 0,
        "level": 1,
        "location": 4
      },
      {
        "num": 19,
        "progress": 0,
        "level": 1,
        "location": 4
      },
      {
        "num": 20,
        "progress": 0,
        "level": 1,
        "location": 4
      },
      {
        "num": 21,
        "progress": 0,
        "level": 1,
        "location": 4
      },
      {
        "num": 22,
        "progress": 0,
        "level": 1,
        "location": 4
      }
    ],
    "location": 6,
    "claimed": [
      2,
      1,
      4,
      3,
      5
    ],
    "tutorialNumber": 7,
    "tutorialSequenceStep": 64
  }
}
