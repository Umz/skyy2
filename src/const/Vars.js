const Vars = {
  
  EVENT_SPAWN: 'event-spawn-enemies',
  EVENT_GAME_STARTED: 'event-game-started',
  EVENT_GAME_EXIT: 'event-game-exit',

  //  -

  SHEET_BIRDS1: 'bg_birds',
  SHEET_BIRDS2: 'bg_bird',
  SHEET_ALL_BANNERS: 'all_banners',
  SHEET_ALL_FLAGS: 'all_flags',

  SHEET_PLAYER: 'Lancer_Player.png',
  SHEET_WILDMAN: "Infantry_Wildman.png",

  SHEET_WILDMAN_CREW: "Infantry_Wildman_Crew.png",
  SHEET_ARCHITECT: "Advisor_Architect.png",
  SHEET_LUNAR: "Advisor_Lunar.png",

  SHEET_MAM_LANCER: 'Lancer_MaM.png',
  SHEET_MAM_INFANTRY: 'Infantry_MaM.png',
  SHEET_MAM_HEAVY: "Heavy_Infantry_MaM.png",
  SHEET_MAM_SUPPLY: "Supplyman_MaM.png",

  SHEET_GR_INFANTRY: "Infantry_GR.png",
  SHEET_FALLEN_CLOUD: "Infantry_Fallen_Cloud.png",

  SHEET_BLUE_BANDIT: 'Infantry_Blue_Bandit.png',
  SHEET_BLUE_BANDIT_LANCE: 'Lancer_Blue_Bandit.png',
  SHEET_BLUE_BANDIT_BOSS: "Lancer_Blue_Bandit_Boss.png",

  SHEET_RED_FACE: "HeavyI_RedFace.png",
  SHEET_RED_HEAVY_BANDIT: "Heavy_Infantry_RF.png",
  SHEET_RED_BANDIT: "Infantry_RF.png",

  SHEET_WL_INFANTRY: "Infantry_WL.png",
  SHEET_WL_HEAVY: "Heavy_WL.png",
  SHEET_WL_LANCER: "Lancer_WL.png",

  SHEET_WL_GREEN_SWORD: "Infantry_WL_Green.png",
  SHEET_WL_SPLIT_CLOVER: "Lancer_WL_Clover.png",

  SHEET_CITIZEN_MAM_KING: "Citizen_MaM_King.png",
  SHEET_CITIZEN_MAM_GLOW: "Citizen_MaM_Glow.png",
  SHEET_CITIZEN_MAM_ROSE: "Citizen_MaM_Rose.png",
  SHEET_CITIZEN_MAM_M1: "Citizen_MaM_M1.png",
  SHEET_CITIZEN_MAM_M2: "Citizen_MaM_M2.png",
  SHEET_CITIZEN_MAM_F1: "Citizen_MaM_F1.png",
  SHEET_CITIZEN_MAM_F2: "Citizen_MaM_F2.png",

  SHEET_CITIZEN_GV_CHIEF: "Citizen_GV_Chief.png",
  SHEET_CITIZEN_GV_M1: "Citizen_GV_M1.png",
  SHEET_CITIZEN_GV_M2: "Citizen_GV_M2.png",
  SHEET_CITIZEN_GV_F1: "Citizen_GV_F1.png",
  SHEET_CITIZEN_GV_F2: "Citizen_GV_F2.png",

  SHEET_CITIZEN_STORM_F1: "Citizen_Storm_F1.png",
  SHEET_CITIZEN_STORM_F2: "Citizen_Storm_F2.png",
  SHEET_CITIZEN_STORM_M1: "Citizen_Storm_M1.png",

  SHEET_CITIZEN_STORM_F1A: "Citizen_Storm_F1A.png",
  SHEET_CITIZEN_STORM_F2A: "Citizen_Storm_F2A.png",
  SHEET_CITIZEN_STORM_F2B: "Citizen_Storm_F2B.png",
  SHEET_CITIZEN_STORM_M1A: "Citizen_Storm_M1A.png",

  //  -

  TX_SPARKLE: "graphic_sparkle",
  TX_HIT: "graphic_hit_fx",

  VFX_SPEECH_SHEET: "vfx_speech_icons",

  VFX_CLAIM: "vfx_claimEffect",

  VFX_BLOOD3: "vfx_bloodsplatter3",
  VFX_CONSUME: "vfx_consume0",
  VFX_SPARKLE0: "vfx_sparkle0",
  VFX_SPARKLE1: "vfx_sparkle1",
  VFX_SQUAREFORE0: "vfx_squarefore0",

  //  -

  JSON_SCRIPT: "script.json",

  //  -

  ANIM_IDLE: '-idle',
  ANIM_WALK: '-walk',
  ANIM_ATTACK: '-attack',
  ANIM_DEFEND: '-defend',

  ANIM_CIT_IDLE: "-idle",
  ANIM_CIT_IDLE_SIDE: "-idle-side",
  ANIM_CIT_IDLE_BACK: "-idle-back",
  ANIM_CIT_WALK: "-walk",
  ANIM_CIT_DIGGING: "-dig-side",
  ANIM_CIT_BOW: "-bow",

  ANIM_BIRD_FLY: 'bird-fly',

  ANIM_FLAG_GR: 'flag-gr',
  ANIM_FLAG_WARM_RAY: 'flag-gr-warm-rays',
  ANIM_FLAG_MID_SUN: 'flag-gr-midday-sun',
  ANIM_FLAG_PURE_SUN: 'flag-gr-pure-sun',
  ANIM_FLAG_SCATTER: 'flag-gr-scattering-rays',
  ANIM_FLAG_GOLDLIGHT: 'flag-gr-goldlight',
  ANIM_FLAG_PIERCING: 'flag-gr-piercing',
  ANIM_FLAG_ELITE: 'flag-gr-golden-elite',
  ANIM_FLAG_KING: 'flag-gr-kings',

  //  - Action Names -

  ACT_MOVE_TO_TARGET_DISTANCE: "action_soldier_move_to_target_within_distance",
  ACT_MOVE_TO_TARGET_OFFSET: "action_soldier_move_to_target_with_offset",
  ACT_MOVE_TO_X: "action_soldier_move_to_x_position",
  ACT_MOVE_OFF_X: "action_soldier_move_offset_x",
  ACT_MATCH_LANE: "action_soldier_move_to_same_lane",
  ACT_SEARCH_FOR_TARGET: "action_search_for_target",
  ACT_SEARCH_FOR_RANDOM: "action_search_for_random_target",
  ACT_SEARCH_FOR_FURTHEST: "action_search_for_furthest_target",
  ACT_SEARCH_FOR_SAME_LANE: "action_search_for_target_same_lane",
  ACT_WAIT_TIME: "action_wait_for_timer",
  ACT_ATTACK: "action_soldier_attack",
  ACT_DEFEND: "action_soldier_defend",
  ACT_COMPLETE: "action_complete_instant",
  
  LISTEN_CONDITION: "listener_for_condition",
  LISTEN_PLAYER_DISTANCE: "listener_player_distance",
  LISTEN_AVOID_OVERLAP: "listener_avoid_overlap",
  LISTEN_MATCH_LANE: "listener_match_lane",
  LISTEN_STATE: "listener_soldier_state",
  LISTEN_STATS_RECOVER: "listener_soldier_stats_recover",
  
  VIEW_SOLDIER_FLASH: "view_soldier_flash",
  VIEW_SOLDIER_LANE: "view_soldier_lane_tint",
  VIEW_ANIMATION: "view_soldier_animations",
  VIEW_CITIZEN_ANIMATION: "view_citizen_animations",
  VIEW_CROWD_CONTROL: "view_crowding_hide_soldiers",

  WORLD_LENGTHS: 3,
  GRAVITY: 60,

  TILEMAP_FLOOR: 160,
  GROUND_TOP: 207,
  //GROUND_TOP: 447,

  AREA_WIDTH: 1920,

  BIRD_DIVE_SPEED: 240,
  BIRD_FLY_SPEED: 140,
  BIRD_DISTANCE_FROM_EDGE: 50
}
export default Vars;