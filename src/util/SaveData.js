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
    "playtime": 1970393,
    "playSecs": 1970,
    "playMins": 32,
    "playHours": 0,
    "uid": 1116,
    "silica": 11,
    "transportedSilica": 0,
    "buildingMaterial": 0,
    "playerX": 13376,
    "playerLane": 1,
    "citizens": [
      {
        "uid": 101,
        "data": {
          "role": "citizen"
        },
        "sheet": "Citizen_MaM_F2.png",
        "x": 3231.3333333332885,
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
        "x": 2604.000000000047,
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
        "x": 3132.6666666666724,
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
        "x": 2575.333333333456,
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
        "x": 3230.333333333357,
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
        "x": 3407.6666666665174,
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
        "x": 2988.9999999999995,
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
        "x": 2425.6666666667397,
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
        "x": 2891.333333333394,
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
        "x": 2457.3333333327105,
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
        "x": 7718.000000000671,
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
        "x": 6661.000000000263,
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
        "x": 5126.999999999517,
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
        "x": 6227.666666666444,
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
        "x": 6201.333333333007,
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
        "x": 7788.66666666738,
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
        "x": 6057.9999999998145,
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
        "x": 4996.999999999421,
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
        "x": 6404.00000000006,
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
        "x": 7491.000000000395,
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
        "x": 12167.817740801145,
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
        "x": 8859.032422400907,
        "state": 1,
        "team": 1,
        "sType": 202,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 5,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 192,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 9002.417574400944,
        "state": 1,
        "team": 1,
        "sType": 202,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 5,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 193,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 9240.269971200552,
        "state": 1,
        "team": 1,
        "sType": 202,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 5,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 194,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 8069.669952000758,
        "state": 1,
        "team": 1,
        "sType": 202,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 5,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 219,
        "prefix": "Infantry_MaM.png",
        "x": 8835.933800533685,
        "state": 1,
        "team": 1,
        "sType": 201,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 5,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 220,
        "prefix": "Infantry_MaM.png",
        "x": 9240.499611734114,
        "state": 1,
        "team": 1,
        "sType": 201,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 5,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 221,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 8827.950852267548,
        "state": 1,
        "team": 1,
        "sType": 202,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 5,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 222,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 9261.2005440006,
        "state": 1,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 5,
        "name": "CC 192",
        "ctr": "AllyStandby"
      },
      {
        "uid": 246,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 9255.145134934422,
        "state": 1,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 5,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 247,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 9231.94184960103,
        "state": 1,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 5,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 248,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 9241.35992960103,
        "state": 1,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 5,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 249,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 8820.42115200098,
        "state": 1,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 5,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 250,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 9259.749440000978,
        "state": 1,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 5,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 251,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 8098.757926400781,
        "state": 1,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 5,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 252,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 9024.46136320042,
        "state": 1,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 5,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 253,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 8817.406816000905,
        "state": 1,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 5,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 254,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 8067.223737600766,
        "state": 1,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 5,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 3,
        "prefix": "Supplyman_MaM.png",
        "x": 7542.21975040022,
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
        "x": 6618.932857600535,
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
        "x": 9250.420025601064,
        "state": 1,
        "team": 1,
        "sType": 203,
        "speed": 96,
        "hp": 20,
        "gp": 12,
        "lane": 3,
        "home": 5,
        "name": "Braver",
        "ctr": "AllyStandby"
      },
      {
        "uid": 668,
        "prefix": "Lancer_MaM.png",
        "x": 9258.638867201043,
        "state": 1,
        "team": 1,
        "sType": 203,
        "speed": 96,
        "hp": 20,
        "gp": 12,
        "lane": 3,
        "home": 5,
        "name": "Braver",
        "ctr": "AllyStandby"
      },
      {
        "uid": 669,
        "prefix": "Infantry_MaM.png",
        "x": 8650.758474667195,
        "state": 1,
        "team": 1,
        "sType": 201,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 5,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 680,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 9243.831505067648,
        "state": 1,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 5,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 697,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 8818.574316800736,
        "state": 1,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 5,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 705,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 9225.725228800658,
        "state": 1,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 5,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 721,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 9247.166374400551,
        "state": 1,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 5,
        "name": "Soldier",
        "ctr": "AllyStandby"
      },
      {
        "uid": 788,
        "prefix": "Lancer_MaM.png",
        "x": 12168.902043200904,
        "state": 1,
        "team": 1,
        "sType": 203,
        "speed": 104,
        "hp": 30,
        "gp": 10,
        "lane": 2,
        "home": 2,
        "name": "Zoll",
        "ctr": "AllyHeavy1"
      },
      {
        "uid": 789,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 11522.083193601495,
        "state": 2,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 3,
        "name": "Soldier",
        "ctr": "AllyHeavy2"
      },
      {
        "uid": 790,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 11423.401723734802,
        "state": 2,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 3,
        "name": "Soldier",
        "ctr": "AllyHeavy2"
      },
      {
        "uid": 791,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 11528.676349868172,
        "state": 2,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 3,
        "name": "Soldier",
        "ctr": "AllyHeavy2"
      },
      {
        "uid": 792,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 12156.762180268339,
        "state": 1,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 3,
        "name": "Soldier",
        "ctr": "AllyHeavy2"
      },
      {
        "uid": 793,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 11830.565715201554,
        "state": 2,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 3,
        "name": "Soldier",
        "ctr": "AllyHeavy2"
      },
      {
        "uid": 794,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 12167.189499734981,
        "state": 1,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 1,
        "home": 3,
        "name": "Soldier",
        "ctr": "AllyHeavy2"
      },
      {
        "uid": 795,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 12178.050248534946,
        "state": 1,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 3,
        "name": "Soldier",
        "ctr": "AllyHeavy2"
      },
      {
        "uid": 796,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 12177.076499201683,
        "state": 1,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 1,
        "home": 3,
        "name": "Soldier",
        "ctr": "AllyHeavy2"
      },
      {
        "uid": 797,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 12158.199148801697,
        "state": 1,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 3,
        "name": "Soldier",
        "ctr": "AllyHeavy2"
      },
      {
        "uid": 798,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 12186.167091201707,
        "state": 1,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 3,
        "name": "Soldier",
        "ctr": "AllyHeavy2"
      },
      {
        "uid": 799,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 12153.76652373498,
        "state": 1,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 3,
        "name": "Soldier",
        "ctr": "AllyHeavy2"
      },
      {
        "uid": 800,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 11589.696326401563,
        "state": 2,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 2,
        "home": 3,
        "name": "Soldier",
        "ctr": "AllyHeavy2"
      },
      {
        "uid": 801,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 11576.361382401677,
        "state": 2,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 3,
        "name": "Soldier",
        "ctr": "AllyHeavy2"
      },
      {
        "uid": 802,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 11795.178291201577,
        "state": 2,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 3,
        "name": "Soldier",
        "ctr": "AllyHeavy2"
      },
      {
        "uid": 803,
        "prefix": "Heavy_Infantry_MaM.png",
        "x": 12152.987788801578,
        "state": 1,
        "team": 1,
        "sType": 205,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 3,
        "home": 3,
        "name": "Soldier",
        "ctr": "AllyHeavy2"
      },
      {
        "uid": 967,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 12164.41885866681,
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
        "uid": 968,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 12184.26165546683,
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
        "uid": 969,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 12178.535272533562,
        "state": 1,
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
        "uid": 970,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 12164.11064106686,
        "state": 1,
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
        "uid": 971,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 12188.52954666688,
        "state": 1,
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
        "uid": 972,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 12178.31592533352,
        "state": 1,
        "team": 1,
        "sType": 204,
        "speed": 96,
        "hp": 5,
        "gp": 5,
        "lane": 1,
        "home": 2,
        "name": "Soldier",
        "ctr": "AllyLight1"
      },
      {
        "uid": 973,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 12182.70652586685,
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
        "uid": 974,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 12180.835332266848,
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
        "uid": 975,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 12162.387658666805,
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
        "uid": 976,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 12167.977282133454,
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
        "uid": 977,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 12185.1408618668,
        "state": 1,
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
        "uid": 978,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 12191.265979733458,
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
        "uid": 979,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 12177.866724266827,
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
        "uid": 980,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 12179.475249066827,
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
        "uid": 981,
        "prefix": "Infantry_Wildman_Crew.png",
        "x": 12153.50786133355,
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
        "uid": 982,
        "prefix": "Lancer_MaM.png",
        "x": 12169.835313066838,
        "state": 1,
        "team": 1,
        "sType": 203,
        "speed": 96,
        "hp": 25,
        "gp": 20,
        "lane": 3,
        "home": 2,
        "name": "Madogu",
        "ctr": "AllyHeavy1"
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
        "progress": 36,
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
        "progress": 7,
        "level": 2,
        "location": 4
      },
      {
        "num": 16,
        "progress": 14,
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
    "location": 7,
    "claimed": [
      2,
      1,
      4,
      3,
      5,
      7,
      8
    ],
    "tutorialNumber": 11,
    "tutorialSequenceStep": 18
  }
}
