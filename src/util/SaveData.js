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
    this.DevData(3);
    console.log("Loaded data", data)

    return data;
  }

  static DevData(dataset = 0) {
    switch (dataset) {
    
      case 2:

        const pX = Vars.AREA_WIDTH * 3.8;

        data.tutorialNumber = 5;
        data.tutorialSequenceStep = 73;
        data.playerX = pX;
        data.soldiers.push(
          {
            uid: Enum.ID_BLUE_MOON, prefix: Vars.SHEET_WILDMAN, x: pX - 32, state: Enum.SS_READY, team: Enum.TEAM_ALLY, sType: Enum.SOLDIER_BLUEMOON,
            speed: 96, hp: 45, gp: 20, lane: 2, home: Enum.LOC_BLUE_FOREST, name: "Blue Moon", ctr: "BlueMoon"
          },
          {
            uid: Enum.ID_NIGHT_TRAIN, prefix: Vars.SHEET_MAM_SUPPLY, x: pX + 200, state: Enum.SS_READY, team: Enum.TEAM_ALLY, sType: Enum.SOLDIER_NIGHTTRAIN,
            speed: 96, hp: 45, gp: 20, lane: 2, home: Enum.LOC_MINES, name: "Night Train", ctr: "Nighttrain"
          },

          {
            uid: 101, prefix: Vars.SHEET_MAM_INFANTRY, x: pX - 32, state: Enum.SS_READY, team:Enum.TEAM_ALLY, sType: Enum.SOLDIER_ALLY_INFANTRY1,
            speed: 96, hp: 5, gp: 4, lane: 3, home: Enum.LOC_STORM, name:"Soldier", ctr: "AllyLight1"
          }
        )

        data.citizens.push(
          {
            uid: Enum.ID_HARVEST_MOON,
            data: {
              role: "citizen"
            },
            sheet: "Citizen_MaM_King.png",
            x: 6336,
            home: Enum.LOC_MAM,
            tribe: Enum.TRIBE_MAM,
            address: -1,
            controller: "CitizenController"
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
