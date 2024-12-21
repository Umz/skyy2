import localforage from "localforage";
import Enum from "./Enum";
import Vars from "./Vars";

const GAME_DATA = "GAME_DATA";

const data = {
  
  playtime: 0,
  playerX: Vars.AREA_WIDTH * 1.5,
  playerLane: 2,

  location: Enum.LOC_MAM,
}

const settings = {
  controllerActive: true
}

export default class SaveData {

  static SAVE_GAME_DATA() {
    localforage.setItem(GAME_DATA, data);
  }

  static async LOAD_GAME_DATA() {
    const savedData = await localforage.getItem(GAME_DATA);
    if (savedData) {
      Object.assign(data, savedData);
    }
    return data;
  }

  static get Data() {
    return data;
  }

  static get Settings() {
    return settings;
  }

  static SETUP_LOCALFORAGE_CONFIG() {
    localforage.config({
      name: "skyy2-dev1",
      description: "Data store for Skyy2",
      storeName: "skydata"
    })
  }
}
