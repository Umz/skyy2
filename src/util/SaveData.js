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
    "playtime": 1467403,
    "playSecs": 1467,
    "playMins": 24,
    "playHours": 0,
    "uid": 738,
    "silica": 46,
    "transportedSilica": 0,
    "buildingMaterial": 0,
    "playerX": 6059,
    "playerLane": 2,
    "citizens": [
      {
        "uid": 101,
        "data": {
          "role": "citizen"
        },
        "sheet": "Citizen_MaM_F2.png",
        "x": 3260.666666666615,
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
        "x": 3010.666666666621,
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
        "x": 2986.000000000039,
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
        "x": 2684.0000000000978,
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
        "x": 2714.3333333334745,
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
        "x": 2865.6666666666406,
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
        "x": 3059.66666666665,
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
        "x": 2741.666666666668,
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
        "x": 2464.6666666668243,
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
        "x": 3065.9999999992388,
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
        "x": 7103.333333333725,
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
        "x": 6449.666666666833,
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
        "x": 5024.999999999471,
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
        "x": 6074.999999999708,
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
        "x": 6310.6666666663905,
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
        "x": 7361.333333333852,
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
        "x": 6655.333333333419,
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
        "x": 5206.999999999516,
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
        "x": 6239.3333333333185,
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
        "x": 7283.666666666967,
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
        "x": 7836.464755200212,
        "state": 1,
        "team": 1,
        "sType": 10,
        "speed": 96,
        "hp": 45,
        "gp": 10,
        "lane": 3,
        "home": 2,
        "name": "Blue Moon",
        "ctr": "BlueMoon"
      },
      {
        "uid": 191,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 7829.224676267369,
        "state": 1,
        "team": 1,
        "sType": 202,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyHeavy1"
      },
      {
        "uid": 192,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 6222.992512000375,
        "state": 1,
        "team": 1,
        "sType": 202,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyHeavy1"
      },
      {
        "uid": 193,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 7446.0534016001575,
        "state": 1,
        "team": 1,
        "sType": 202,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyHeavy1"
      },
      {
        "uid": 194,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 6187.3011648003685,
        "state": 1,
        "team": 1,
        "sType": 202,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyHeavy1"
      },
      {
        "uid": 219,
        "prefix": "Infantry_MaM.png",
        "x": 7327.9412224000325,
        "state": 1,
        "team": 1,
        "sType": 201,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyLight1"
      },
      {
        "uid": 220,
        "prefix": "Infantry_MaM.png",
        "x": 6275.918504533503,
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
        "x": 6188.3980544003225,
        "state": 1,
        "team": 1,
        "sType": 202,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyHeavy1"
      },
      {
        "uid": 222,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 6228.727577599974,
        "state": 2,
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
        "x": 6099.238229333763,
        "state": 1,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyLight1"
      },
      {
        "uid": 247,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 7810.667942400726,
        "state": 1,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyLight1"
      },
      {
        "uid": 248,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 7719.870438400736,
        "state": 1,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyLight1"
      },
      {
        "uid": 249,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 6295.75783680045,
        "state": 1,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyLight1"
      },
      {
        "uid": 250,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 7883.151136000692,
        "state": 1,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyLight1"
      },
      {
        "uid": 251,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 6262.19827840041,
        "state": 1,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyLight1"
      },
      {
        "uid": 252,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 7401.176620800054,
        "state": 1,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyHeavy2"
      },
      {
        "uid": 253,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 6191.54887680037,
        "state": 1,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyHeavy2"
      },
      {
        "uid": 254,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 6248.174498133747,
        "state": 1,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 1,
        "home": 4,
        "name": "Soldier",
        "ctr": "AllyHeavy2"
      },
      {
        "uid": 3,
        "prefix": "Supplyman_MaM.png",
        "x": 6857.770504533614,
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
        "prefix": "Advisor_Lunar.png",
        "x": 6585.554310400505,
        "state": 1,
        "team": 1,
        "sType": 13,
        "speed": 96,
        "hp": 15,
        "gp": 10,
        "lane": 1,
        "home": 2,
        "name": "Lunar",
        "ctr": "LunarBuilder"
      },
      {
        "uid": 623,
        "prefix": "Lancer_MaM.png",
        "x": 6240.777248000398,
        "state": 1,
        "team": 1,
        "sType": 203,
        "speed": 96,
        "hp": 20,
        "gp": 12,
        "lane": 3,
        "home": 2,
        "name": "Braver",
        "ctr": "AllyHeavy1"
      },
      {
        "uid": 668,
        "prefix": "Lancer_MaM.png",
        "x": 6219.707155200375,
        "state": 1,
        "team": 1,
        "sType": 203,
        "speed": 96,
        "hp": 20,
        "gp": 12,
        "lane": 3,
        "home": 2,
        "name": "Braver",
        "ctr": "AllyHeavy1"
      },
      {
        "uid": 669,
        "prefix": "Infantry_MaM.png",
        "x": 7282.654873600298,
        "state": 1,
        "team": 1,
        "sType": 201,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 2,
        "name": "Soldier",
        "ctr": "AllyLight1"
      },
      {
        "uid": 680,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 4712.113126400026,
        "state": 5,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 2,
        "name": "Soldier",
        "ctr": "AllyLight1"
      },
      {
        "uid": 697,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 4989.833939199941,
        "state": 6,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 2,
        "name": "Soldier",
        "ctr": "AllyLight1"
      },
      {
        "uid": 705,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 6330.167852800009,
        "state": 5,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 2,
        "name": "Soldier",
        "ctr": "AllyLight1"
      },
      {
        "uid": 721,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 5917.1679167998855,
        "state": 1,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 2,
        "name": "Soldier",
        "ctr": "AllyLight1"
      }
    ],
    "houses": [
      {
        "num": 0,
        "progress": 0,
        "level": 2,
        "location": 4
      },
      {
        "num": 1,
        "progress": 0,
        "level": 2,
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
        "level": 2,
        "location": 4
      },
      {
        "num": 4,
        "progress": 0,
        "level": 2,
        "location": 4
      },
      {
        "num": 5,
        "progress": 0,
        "level": 2,
        "location": 4
      },
      {
        "num": 6,
        "progress": 0,
        "level": 2,
        "location": 4
      },
      {
        "num": 7,
        "progress": 0,
        "level": 2,
        "location": 4
      },
      {
        "num": 8,
        "progress": 0,
        "level": 2,
        "location": 4
      },
      {
        "num": 9,
        "progress": 0,
        "level": 2,
        "location": 4
      },
      {
        "num": 10,
        "progress": 0,
        "level": 2,
        "location": 4
      },
      {
        "num": 11,
        "progress": 0,
        "level": 2,
        "location": 4
      },
      {
        "num": 12,
        "progress": 0,
        "level": 2,
        "location": 4
      },
      {
        "num": 13,
        "progress": 0,
        "level": 2,
        "location": 4
      },
      {
        "num": 14,
        "progress": 0,
        "level": 2,
        "location": 4
      },
      {
        "num": 15,
        "progress": 0,
        "level": 2,
        "location": 4
      },
      {
        "num": 16,
        "progress": 0,
        "level": 2,
        "location": 4
      },
      {
        "num": 17,
        "progress": 0,
        "level": 2,
        "location": 4
      },
      {
        "num": 18,
        "progress": 0,
        "level": 2,
        "location": 4
      },
      {
        "num": 19,
        "progress": 0,
        "level": 2,
        "location": 4
      },
      {
        "num": 20,
        "progress": 0,
        "level": 2,
        "location": 4
      },
      {
        "num": 21,
        "progress": 0,
        "level": 2,
        "location": 4
      },
      {
        "num": 22,
        "progress": 0,
        "level": 2,
        "location": 4
      }
    ],
    "location": 4,
    "claimed": [
      2,
      1,
      4,
      3,
      5
    ],
    "tutorialNumber": 9,
    "tutorialSequenceStep": 1
  }
}
