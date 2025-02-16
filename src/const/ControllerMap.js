import AllyHeavy1 from "../ai/AllyHeavy1";
import AllyLight1 from "../ai/AllyLight1";
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
import CitizenView from "../ai/CitizenView";
import CitizenWife from "../ai/CitizenWife";
import Defensive from "../ai/Defensive";
import DuelIdle from "../ai/DuelIdle";
import Lunar1 from "../ai/Lunar1";
import Nighttrain from "../ai/Nighttrain";
import RedDuel from "../ai/RedDuel";
import SoldierView from "../ai/SoldierView";
import Wildman from "../ai/Wildman";

const ControllerMap = new Map([
  ["AllyHeavy1", AllyHeavy1],
  ["AllyLight1", AllyLight1],
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
  ["CitizenView", CitizenView],
  ["CitizenWife", CitizenWife],
  ["Defensive", Defensive],
  ["DuelIdle", DuelIdle],
  ["Lunar1", Lunar1],
  ["Nighttrain", Nighttrain],
  ["RedDuel", RedDuel],
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
