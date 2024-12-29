import Enum from "../util/Enum";
import Vars from "../util/Vars";

const MapInfo = new Map([
  [Enum.LOC_BLUE_FOREST, {name:"Blue Forest", type: Enum.AREA_FOREST, flags: [Vars.AREA_WIDTH * .48]}],
  [Enum.LOC_MAM, {name:"Moon at Midnight", type: Enum.AREA_VILLAGE}],
  [Enum.LOC_ROSE_FOREST, {name:"Rose Forest", type: Enum.AREA_FOREST}],
  [Enum.LOC_STORM, {name:"Storm Village", type: Enum.AREA_VILLAGE}],
  [Enum.LOC_MINES, {name:"The Mines", type: Enum.AREA_MISC}],
  [Enum.LOC_PLAINS, {name:"Mario Plains", type: Enum.AREA_MISC}],
  [Enum.LOC_GREEN_FOREST, {name:"Greenleaf Forest", type: Enum.AREA_FOREST}],
  [Enum.LOC_GREEN, {name:"Green Village", type: Enum.AREA_VILLAGE}]
]);

export default MapInfo;