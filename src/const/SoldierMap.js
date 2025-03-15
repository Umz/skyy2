import Aggressive from "../ai/Aggressive";
import AllyHeavy1 from "../ai/AllyHeavy1";
import AllyHeavy2 from "../ai/AllyHeavy2";
import AllyLight1 from "../ai/AllyLight1";
import Bandit1 from "../ai/Bandit1";
import Bandit2 from "../ai/Bandit2";
import Bandit3 from "../ai/Bandit3";
import Bandit4 from "../ai/Bandit4";
import BanditBoss from "../ai/BanditBoss";
import Blank from "../ai/Blank";
import BlueMoon from "../ai/BlueMoon";
import CloverBoss from "../ai/CloverBoss";
import Defensive from "../ai/Defensive";
import Lunar1 from "../ai/Lunar1";
import NightTrain from "../ai/Nighttrain";
import RedFace1 from "../ai/RedFace1";
import Wildman from "../ai/Wildman";
import Enum from "../const/Enum";
import Vars from "../const/Vars";

// Stats will be HP ATT - avoid for this game
const SoldierMap = new Map([

  [Enum.SOLDIER_PLAYER, {ctrl: Blank, sheet:Vars.SHEET_PLAYER}],
  [Enum.SOLDIER_WILDMAN, {ctrl: Wildman, sheet:Vars.SHEET_WILDMAN}],
  [Enum.SOLDIER_BLUEMOON, {ctrl: BlueMoon, sheet:Vars.SHEET_WILDMAN}],
  [Enum.SOLDIER_NIGHTTRAIN, {ctrl: NightTrain, sheet:Vars.SHEET_MAM_SUPPLY}],

  [Enum.SOLDIER_ARCHITECT, {ctrl: Lunar1, sheet:Vars.SHEET_ARCHITECT}],
  [Enum.SOLDIER_LUNAR, {ctrl: Lunar1, sheet:Vars.SHEET_LUNAR}],

  [Enum.SOLDIER_ALLY_HEAVY1, {ctrl: AllyHeavy1, sheet:Vars.SHEET_MAM_HEAVY}],
  [Enum.SOLDIER_ALLY_HEAVY2, {ctrl: AllyHeavy2, sheet:Vars.SHEET_MAM_HEAVY}],
  [Enum.SOLDIER_ALLY_INFANTRY1, {ctrl: AllyLight1, sheet:Vars.SHEET_MAM_INFANTRY}],
  [Enum.SOLDIER_ALLY_LANCER1, {ctrl: AllyHeavy1, sheet:Vars.SHEET_MAM_LANCER}],
  [Enum.SOLDIER_ALLY_WILDMAN, {ctrl: AllyLight1, sheet:Vars.SHEET_WILDMAN_CREW}],

  [Enum.SOLDIER_BANDIT1, {ctrl: Bandit1, sheet:Vars.SHEET_BLUE_BANDIT}],
  [Enum.SOLDIER_BANDIT2, {ctrl: Bandit2, sheet:Vars.SHEET_BLUE_BANDIT_LANCE}],
  [Enum.SOLDIER_RABID_BANDIT, {ctrl: BanditBoss, sheet:Vars.SHEET_BLUE_BANDIT_BOSS}],

  [Enum.SOLDIER_RED1, {ctrl: Bandit1, sheet:Vars.SHEET_RED_BANDIT}],
  [Enum.SOLDIER_RED2, {ctrl: Bandit1, sheet:Vars.SHEET_RED_HEAVY_BANDIT}],
  [Enum.SOLDIER_RED3, {ctrl: Bandit4, sheet:Vars.SHEET_RED_BANDIT}],
  [Enum.SOLDIER_REDFACE, {ctrl: RedFace1, sheet:Vars.SHEET_RED_FACE}],

  [Enum.SOLDIER_GR1, {ctrl: Bandit1, sheet:Vars.SHEET_GR_INFANTRY}],
  [Enum.SOLDIER_FALLEN_CLOUD, {ctrl: BanditBoss, sheet:Vars.SHEET_FALLEN_CLOUD}],

  [Enum.SOLDIER_WL_INFANTRY, {ctrl: Aggressive, sheet:Vars.SHEET_WL_INFANTRY}],
  [Enum.SOLDIER_WL_HEAVY, {ctrl: Defensive, sheet:Vars.SHEET_WL_HEAVY}],
  [Enum.SOLDIER_WL_LANCER, {ctrl: Bandit1, sheet:Vars.SHEET_WL_LANCER}],

  [Enum.SOLDIER_WL_GREEN_SWORD, {ctrl: BanditBoss, sheet:Vars.SHEET_WL_GREEN_SWORD}],
  [Enum.SOLDIER_WL_SPLIT_CLOVER, {ctrl: CloverBoss, sheet:Vars.SHEET_WL_SPLIT_CLOVER}],
]);

export default SoldierMap;