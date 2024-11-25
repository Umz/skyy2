import localforage from "localforage";

const PLAYER_POS = "PLAYER_POSITION";

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

  static SETUP_LOCALFORAGE_CONFIG() {
    localforage.config({
      name: "skyy2-dev1",
      description: "Data store for Skyy2",
      storeName: "skydata"
    })
  }

}
