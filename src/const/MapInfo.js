import Enum from "../const/Enum";
import Vars from "../const/Vars";

const MapInfo = new Map([
  [Enum.LOC_BLUE_FOREST, {name:"Blue Forest", type: Enum.AREA_FOREST, flags: [Vars.AREA_WIDTH * .48]}],
  [Enum.LOC_MAM, {name:"Moon at Midnight", type: Enum.AREA_VILLAGE}],
  [Enum.LOC_ROSE_FOREST, {name:"Rose Forest", type: Enum.AREA_FOREST, flags: [Vars.AREA_WIDTH * 2.46]}],
  [Enum.LOC_STORM, {name:"Storm Village", type: Enum.AREA_VILLAGE, flags: [x(3.1), x(3.38), x(3.44), x(3.88)]}],
  [Enum.LOC_MINES, {name:"The Mines", type: Enum.AREA_MISC}],
  [Enum.LOC_PLAINS, {name:"Mario Plains", type: Enum.AREA_MISC}],
  [Enum.LOC_GREEN_FOREST, {name:"Greenleaf Forest", type: Enum.AREA_FOREST}],
  [Enum.LOC_GREEN, {name:"Green Village", type: Enum.AREA_VILLAGE}]
]);

export default MapInfo;

function x(mul) {
  return Vars.AREA_WIDTH * mul;
}