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
    console.log("DEV DATA LOADED", data)
  }

  static PRELOAD() {
    SaveData.isLoaded = false;
    localforage.getItem(GAME_DATA)
      .then(saveData => {
        if (saveData) {
          //data = saveData;
          console.log("Loaded again")
          console.log(data)
          data.tutorialNumber = 7;
          data.playerX = Vars.AREA_WIDTH * 7;
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
    "playtime": 869700,
    "playSecs": 869,
    "playMins": 14,
    "playHours": 0,
    "uid": 302,
    "silica": 0,
    "transportedSilica": 0,
    "buildingMaterial": 0,
    "playerX": 5842,
    "playerLane": 2,
    "citizens": [
      {
        "uid": 101,
        "data": {
          "role": "citizen"
        },
        "sheet": "Citizen_MaM_F1.png",
        "x": 3206.666666666731,
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
        "sheet": "Citizen_MaM_M1.png",
        "x": 2571.666666666788,
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
        "sheet": "Citizen_MaM_M2.png",
        "x": 3145.3333333332625,
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
        "x": 1672.0000000001028,
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
        "x": 1589.3333333335613,
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
        "sheet": "Citizen_MaM_M1.png",
        "x": 3325.6666666666406,
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
        "sheet": "Citizen_MaM_F2.png",
        "x": 2721.0000000000064,
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
        "sheet": "Citizen_MaM_F1.png",
        "x": 1491.0000000000846,
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
        "sheet": "Citizen_MaM_M2.png",
        "x": 3212.6666666666,
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
        "x": 3386.2666666665427,
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
        "uid": 269,
        "data": {
          "role": "citizen",
          "isJoining": true
        },
        "sheet": "Citizen_Storm_F1.png",
        "x": 6416.333333333374,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenBattle"
      },
      {
        "uid": 270,
        "data": {
          "role": "citizen",
          "isJoining": true
        },
        "sheet": "Citizen_Storm_F2.png",
        "x": 6299.000000000053,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenBattle"
      },
      {
        "uid": 271,
        "data": {
          "role": "citizen",
          "isJoining": true
        },
        "sheet": "Citizen_Storm_F1.png",
        "x": 7400,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenBattle"
      },
      {
        "uid": 272,
        "data": {
          "role": "citizen",
          "isJoining": true
        },
        "sheet": "Citizen_Storm_F2.png",
        "x": 6508,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenBattle"
      },
      {
        "uid": 273,
        "data": {
          "role": "citizen",
          "isJoining": true
        },
        "sheet": "Citizen_Storm_M1.png",
        "x": 6485.666666666689,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenBattle"
      },
      {
        "uid": 274,
        "data": {
          "role": "citizen",
          "isJoining": true
        },
        "sheet": "Citizen_Storm_F1.png",
        "x": 6709,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenBattle"
      },
      {
        "uid": 275,
        "data": {
          "role": "citizen",
          "isJoining": true
        },
        "sheet": "Citizen_Storm_F1.png",
        "x": 7216,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenBattle"
      },
      {
        "uid": 276,
        "data": {
          "role": "citizen",
          "isJoining": true
        },
        "sheet": "Citizen_Storm_F2.png",
        "x": 6549,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenBattle"
      },
      {
        "uid": 277,
        "data": {
          "role": "citizen",
          "isJoining": true
        },
        "sheet": "Citizen_Storm_M1.png",
        "x": 6629,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenBattle"
      },
      {
        "uid": 278,
        "data": {
          "role": "citizen",
          "isJoining": true
        },
        "sheet": "Citizen_Storm_F2.png",
        "x": 6826,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenBattle"
      },
      {
        "uid": 279,
        "data": {
          "role": "citizen",
          "isJoining": false
        },
        "sheet": "Citizen_Storm_F2.png",
        "x": 6562,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenBattle"
      },
      {
        "uid": 280,
        "data": {
          "role": "citizen",
          "isJoining": false
        },
        "sheet": "Citizen_Storm_F2.png",
        "x": 7167,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenBattle"
      },
      {
        "uid": 281,
        "data": {
          "role": "citizen",
          "isJoining": false
        },
        "sheet": "Citizen_Storm_F1.png",
        "x": 6512,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenBattle"
      },
      {
        "uid": 282,
        "data": {
          "role": "citizen",
          "isJoining": false
        },
        "sheet": "Citizen_Storm_F2.png",
        "x": 6286.666666666735,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenBattle"
      },
      {
        "uid": 283,
        "data": {
          "role": "citizen",
          "isJoining": false
        },
        "sheet": "Citizen_Storm_F1.png",
        "x": 7377,
        "home": 4,
        "tribe": 3,
        "name": "Citizen",
        "address": -1,
        "controller": "CitizenBattle"
      }
    ],
    "soldiers": [
      {
        "uid": 2,
        "prefix": "Infantry_Wildman.png",
        "x": 6338.288569600381,
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
      },
      {
        "uid": 208,
        "prefix": "Infantry_MaM.png",
        "x": 5732.292243200148,
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
        "uid": 209,
        "prefix": "Infantry_MaM.png",
        "x": 6336.328006400409,
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
        "uid": 210,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 6344.118521600435,
        "state": 1,
        "team": 1,
        "sType": 202,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 2,
        "name": "Soldier",
        "ctr": "AllyHeavy1"
      },
      {
        "uid": 211,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 6306.22762880029,
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
        "uid": 232,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 6332.6399552004605,
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
      },
      {
        "uid": 233,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 6336.999340800418,
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
      },
      {
        "uid": 234,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 6317.392633600432,
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
      },
      {
        "uid": 235,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 6351.813600000459,
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
      },
      {
        "uid": 236,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 6336.621331200466,
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
      },
      {
        "uid": 237,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 6336.305139200429,
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
      },
      {
        "uid": 238,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 6318.276953600385,
        "state": 1,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 2,
        "name": "Soldier",
        "ctr": "AllyHeavy2"
      },
      {
        "uid": 239,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 6325.004915200381,
        "state": 1,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 2,
        "name": "Soldier",
        "ctr": "AllyHeavy2"
      },
      {
        "uid": 240,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 6297.418540800413,
        "state": 1,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 2,
        "name": "Soldier",
        "ctr": "AllyHeavy2"
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
      1
    ],
    "tutorialNumber": 4,
    "tutorialSequenceStep": 43
  }
}
