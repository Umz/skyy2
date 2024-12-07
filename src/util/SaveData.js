import localforage from "localforage";

const GAME_DATA = "GAME_DATA";

const data = {
  playtime: 0,
  playerX: 240,
  playerLane: 1
}

const settings = {
  controllerActive: true
}

export default class SaveData {

  static SAVE_GAME_DATA(obj) {
    localforage.setItem(GAME_DATA, obj);
  }

  static async LOAD_GAME_DATA() {
    const savedData = await localforage.getItem(GAME_DATA);
    return savedData || data;
  }

  static GET_GAME_DATA() {
    return data;
  }

  static GET_SETTINGS() {
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
