import localforage from "localforage";

const PLAYER_POS = "PLAYER_POSITION";
const GAME_DATA = "GAME_DATA";

export default class SaveData {

  static SAVE_POS(posX) {
    localforage.setItem(PLAYER_POS, posX);
  }

  static async GET_PLAYER_POS() {
    
    const areaWidth = 1920;
    const initPlayerX = areaWidth + (areaWidth * .5);
    const savedX = await localforage.getItem(PLAYER_POS);

    return savedX || initPlayerX;
  }

  static SAVE_GAME_DATA(obj) {
    localforage.setItem(GAME_DATA, obj);
  }

  static async LOAD_GAME_DATA() {

    const data = {
      playtime: 0,
      playerX: 240,
      playerLane: 1
    }
    const savedData = await localforage.getItem(GAME_DATA);

    return savedData || data;
  }

  static SETUP_LOCALFORAGE_CONFIG() {
    localforage.config({
      name: "skyy2-dev1",
      description: "Data store for Skyy2",
      storeName: "skydata"
    })
  }

}
