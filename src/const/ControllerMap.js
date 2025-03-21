import Aggressive from "../ai/Aggressive";
import AllyHeavy1 from "../ai/AllyHeavy1";
import AllyHeavy2 from "../ai/AllyHeavy2";
import AllyLight1 from "../ai/AllyLight1";
import AllyStandby from "../ai/AllyStandby";
import Bandit1 from "../ai/Bandit1";
import Bandit2 from "../ai/Bandit2";
import Bandit3 from "../ai/Bandit3";
import BanditBoss from "../ai/BanditBoss";
import Blank from "../ai/Blank";
import BlueMoon from "../ai/BlueMoon";
import CitizenBattle from "../ai/CitizenBattle";
import CitizenCaptive from "../ai/CitizenCaptive";
import CitizenController from "../ai/CitizenController";
import CitizenMaM from "../ai/CitizenMaM";
import CitizenStorm from "../ai/CitizenStorm";
import CitizenView from "../ai/CitizenView";
import CitizenWife from "../ai/CitizenWife";
import Defensive from "../ai/Defensive";
import DuelIdle from "../ai/DuelIdle";
import Lunar1 from "../ai/Lunar1";
import LunarBuilder from "../ai/LunarBuilder";
import Nighttrain from "../ai/Nighttrain";
import NightTrain2 from "../ai/NightTrain2";
import RedDuel from "../ai/RedDuel";
import RedFace1 from "../ai/RedFace1";
import SoldierView from "../ai/SoldierView";
import Wildman from "../ai/Wildman";

const ControllerMap = new Map([
  ["Aggressive", Aggressive],
  ["AllyHeavy1", AllyHeavy1],
  ["AllyHeavy2", AllyHeavy2],
  ["AllyLight1", AllyLight1],
  ["AllyStandby", AllyStandby],
  ["Bandit1", Bandit1],
  ["Bandit2", Bandit2],
  ["Bandit3", Bandit3],
  ["BanditBoss", BanditBoss],
  ["Blank", Blank],
  ["BlueMoon", BlueMoon],
  ["CitizenBattle", CitizenBattle],
  ["CitizenCaptive", CitizenCaptive],
  ["CitizenController", CitizenController],
  ["CitizenMaM", CitizenMaM],
  ["CitizenStorm", CitizenStorm],
  ["CitizenView", CitizenView],
  ["CitizenWife", CitizenWife],
  ["Defensive", Defensive],
  ["DuelIdle", DuelIdle],
  ["Lunar1", Lunar1],
  ["LunarBuilder", LunarBuilder],
  ["Nighttrain", Nighttrain],
  ["Nighttrain2", NightTrain2],
  ["RedDuel", RedDuel],
  ["RedFace1", RedFace1],
  ["SoldierView", SoldierView],
  ["Wildman", Wildman]
]);

export default ControllerMap;

export function getControllerSaveName(cont) {
  for (let [name, clazz] of ControllerMap) {
    if (cont instanceof clazz) {
      return name;
    }
  }
  console.error("Could not find save name in ControllerMap for:", this);
  return null;
}
