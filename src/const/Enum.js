const Enum = {
  
  GS_IDLE: 1,
  GS_MENU: 2,
  GS_COUNTDOWN: 3,
  GS_SPAWN: 4,
  GS_BATTLE: 5,
  GS_VICTORY: 6,
  GS_DEFEAT: 7,
  GS_PAUSE_LISTEN: 8,
  GS_PAUSE: 9,
  GS_VIEW: 10,
  GS_ENDING: 11,

  //  Locations

  AREA_VILLAGE: 101,
  AREA_FOREST: 102,
  AREA_MISC: 103,

  LOC_BLUE_FOREST: 1,
  LOC_MAM: 2,
  LOC_ROSE_FOREST: 3,
  LOC_STORM: 4,
  LOC_MINES: 5,
  LOC_PLAINS: 6,
  LOC_GREEN_FOREST: 7,
  LOC_GREEN: 8,

  // Sprite States
  
  SS_READY: 1,
  SS_DEFEND: 2,
  SS_ATTACK: 3,
  SS_BACKSTEP: 4,
  SS_HURT: 5,
  SS_REBOUND: 6,
  SS_COOLDOWN: 7,
  SS_DEAD: 8,
  SS_REPELLED: 9,

  // Citizen States

  CS_IDLE: 1,
  CS_DIGGING: 2,
  CS_TALKING: 3,
  CS_TRAVELLING: 4,
  CS_BOWING: 5,

  // Tribes

  TRIBE_MAM: 1,
  TRIBE_BLUE_FOREST: 2,
  TRIBE_STORM: 3,
  TRIBE_WHITELEAF: 4,

  // Soldier

  TEAM_ALLY: 1,
  TEAM_ENEMY: 2,
  TEAM_PLAYER: 3,

  SOLDIER_BANDIT1: 1,
  SOLDIER_BANDIT2: 2,
  SOLDIER_BANDIT_BOSS: 10,

  SOLDIER_RED1: 11,
  SOLDIER_RED2: 12,
  SOLDIER_RED3: 13,
  SOLDIER_REDFACE: 20,

  SOLDIER_GR1: 11,
  SOLDIER_FALLEN_CLOUD: 30,

  SOLDIER_ALLY_INFANTRY1: 101,
  SOLDIER_ALLY_HEAVY1: 102,
  SOLDIER_ALLY_LANCER1: 103,
  SOLDIER_ALLY_WILDMAN: 104,

  SOLDIER_WILDMAN: 10001,
  SOLDIER_BLUEMOON: 10002,
  SOLDIER_NIGHTTRAIN: 10003,
  SOLDIER_PLAYER: 1000001,

  //  Story References

  STORY_0_INTRO: 0,
  STORY_1A_APPRENTICE: 1,
  STORY_1B_APPRENTICE: 2,
  STORY_1C_BLUEFOREST: 3,
  STORY_2A_CLAIM_BLUE: 4,
  STORY_2B_PLACE_FLAG: 5,
  STORY_2C_LEAVE_FOREST: 6,
  STORY_3_CHASE_REDFACE: 7,

  STORY_4_CLAIM_STORM: 8,
  STORY_4_CITIZEN_TRIALS: 9,

  STORY_5_BREAK_ROCKS: 10,
  STORY_5_MISSION: 11,
  STORY_5_CLAIM_MINES: 12,
  STORY_5_GREEN_VILLAGE: 13,

  //  Dialogue

  BF_TEST: 1,
  BF_BATTLE: 2,   // Blue Forest Battle
  BF_WIN: 3,      // Blue Forest Victory

  BF_BOSS1: 4,
  BF_BOSS2: 5,
  BF_BOSS3: 6,

  MAM_BM_FIRST: 10,   // Blue Moon first time in MaM
  MAM_SOLDIER_ALERT: 11,
  MAM_MC_WHO_DARES: 12,

  MC_TAUNT: 101,
  MC_PEOMS: 102,

}
export default Enum;