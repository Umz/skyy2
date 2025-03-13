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

          /*
          data.tutorialNumber = 7;
          data.playerX = Vars.AREA_WIDTH * 7;
          data.soldiers = [{
            "uid": 2,
            "prefix": "Infantry_Wildman.png",
            "x": data.playerX,
            "state": 1,
            "team": 1,
            "sType": 10,
            "speed": 96,
            "hp": 45,
            "gp": 10,
            "lane": 2,
            "home": 2,
            "name": "Blue Moon",
            "ctr": "BlueMoon"
          }];
          */
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
    "playtime": 651959,
    "playSecs": 651,
    "playMins": 10,
    "playHours": 0,
    "uid": 400,
    "silica": 0,
    "transportedSilica": 0,
    "buildingMaterial": 0,
    "playerX": 6490,
    "playerLane": 1,
    "citizens": [
      {
        "uid": 101,
        "data": {
          "role": "citizen"
        },
        "sheet": "Citizen_MaM_F2.png",
        "x": 2116.0000000002087,
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
        "x": 1424.6666666667577,
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
        "x": 1141.3333333334715,
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
        "x": 2776.6666666667434,
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
        "x": 2877.000000000104,
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
        "x": 1829.000000000124,
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
        "x": 2653.000000000076,
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
        "x": 2810.9999999999854,
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
        "x": 1150.0000000001392,
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
        "x": 2843.5999999999995,
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
        "x": 6326.000000000038,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenCaptive"
      },
      {
        "uid": 282,
        "data": {
          "role": "citizen",
          "isJoining": true
        },
        "sheet": "Citizen_Storm_F1.png",
        "x": 6319.666666666774,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenCaptive"
      },
      {
        "uid": 283,
        "data": {
          "role": "citizen",
          "isJoining": true
        },
        "sheet": "Citizen_Storm_F2.png",
        "x": 6196.333333333337,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenCaptive"
      },
      {
        "uid": 284,
        "data": {
          "role": "citizen",
          "isJoining": true
        },
        "sheet": "Citizen_Storm_M1.png",
        "x": 6794.3333333333685,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenCaptive"
      },
      {
        "uid": 285,
        "data": {
          "role": "citizen",
          "isJoining": true
        },
        "sheet": "Citizen_Storm_M1.png",
        "x": 6895.99999999999,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenCaptive"
      },
      {
        "uid": 286,
        "data": {
          "role": "citizen",
          "isJoining": true
        },
        "sheet": "Citizen_Storm_M1.png",
        "x": 6215.333333333331,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenCaptive"
      },
      {
        "uid": 287,
        "data": {
          "role": "citizen",
          "isJoining": true
        },
        "sheet": "Citizen_Storm_M1.png",
        "x": 6732.666666666788,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenCaptive"
      },
      {
        "uid": 288,
        "data": {
          "role": "citizen",
          "isJoining": true
        },
        "sheet": "Citizen_Storm_M1.png",
        "x": 6198.3333333333,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenCaptive"
      },
      {
        "uid": 289,
        "data": {
          "role": "citizen",
          "isJoining": true
        },
        "sheet": "Citizen_Storm_M1.png",
        "x": 6711.333333333533,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenCaptive"
      },
      {
        "uid": 290,
        "data": {
          "role": "citizen",
          "isJoining": true
        },
        "sheet": "Citizen_Storm_F1.png",
        "x": 6813.666666666753,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenCaptive"
      },
      {
        "uid": 291,
        "data": {
          "role": "citizen",
          "isJoining": false
        },
        "sheet": "Citizen_Storm_F1.png",
        "x": 7257.666666666618,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenCaptive"
      },
      {
        "uid": 292,
        "data": {
          "role": "citizen",
          "isJoining": false
        },
        "sheet": "Citizen_Storm_F1.png",
        "x": 7259.00000000004,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenCaptive"
      },
      {
        "uid": 293,
        "data": {
          "role": "citizen",
          "isJoining": false
        },
        "sheet": "Citizen_Storm_M1.png",
        "x": 6910.000000000242,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenCaptive"
      },
      {
        "uid": 294,
        "data": {
          "role": "citizen",
          "isJoining": false
        },
        "sheet": "Citizen_Storm_F2.png",
        "x": 6799.666666666796,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenCaptive"
      },
      {
        "uid": 295,
        "data": {
          "role": "citizen",
          "isJoining": false
        },
        "sheet": "Citizen_Storm_M1.png",
        "x": 6312.999999999946,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenCaptive"
      }
    ],
    "soldiers": [
      {
        "uid": 2,
        "prefix": "Infantry_Wildman.png",
        "x": 6511.132512000223,
        "state": 1,
        "team": 1,
        "sType": 10,
        "speed": 96,
        "hp": 45,
        "gp": 10,
        "lane": 1,
        "home": 2,
        "name": "Blue Moon",
        "ctr": "BlueMoon"
      },
      {
        "uid": 191,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 6504.007370667043,
        "state": 1,
        "team": 1,
        "sType": 202,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 192,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 6587.575763200432,
        "state": 1,
        "team": 1,
        "sType": 202,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 193,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 7436.56048000061,
        "state": 1,
        "team": 1,
        "sType": 202,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 194,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 6358.48122880043,
        "state": 1,
        "team": 1,
        "sType": 202,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 219,
        "prefix": "Infantry_MaM.png",
        "x": 5938.230156800147,
        "state": 1,
        "team": 1,
        "sType": 201,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 220,
        "prefix": "Infantry_MaM.png",
        "x": 5477.648857600134,
        "state": 1,
        "team": 1,
        "sType": 201,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 1,
        "home": 2,
        "name": "Soldier",
        "ctr": "AllyLight1"
      },
      {
        "uid": 221,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 6609.959667200362,
        "state": 1,
        "team": 1,
        "sType": 202,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 222,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 5654.883270400157,
        "state": 1,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 1,
        "home": 2,
        "name": "CC 192",
        "ctr": "AllyHeavy2"
      },
      {
        "uid": 246,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 6583.591573333882,
        "state": 1,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 247,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 6523.116742400419,
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
        "x": 6610.754496000404,
        "state": 1,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 249,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 6511.0661568004325,
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
        "x": 5968.513984000179,
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
        "x": 6384.525561600414,
        "state": 1,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 252,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 7429.435910400547,
        "state": 1,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 253,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 6628.6267648004405,
        "state": 1,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 254,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 6480.890210133742,
        "state": 1,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyStandby"
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
    "location": 4,
    "claimed": [
      2,
      1,
      4,
      3
    ],
    "tutorialNumber": 4,
    "tutorialSequenceStep": 59
  }
}
