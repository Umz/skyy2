const Vars = {
  
  EVENT_SPAWN: 'event-spawn-enemies',
  EVENT_GAME_STARTED: 'event-game-started',
  EVENT_GAME_EXIT: 'event-game-exit',

  //  -

  SHEET_BIRDS1: 'bg_birds',
  SHEET_BIRDS2: 'bg_bird',
  SHEET_ALL_BANNERS: 'all_banners',
  SHEET_ALL_FLAGS: 'all_flags',

  SHEET_PLAYER: 'player_sheet',
  SHEET_MAM_LANCER: 'mam_lancer_sheet',
  SHEET_MAM_INFANTRY: 'mam_infantry_sheet',
  SHEET_MAM_HEAVY: 'mam_heavy_infantry_sheet',

  SHEET_WILDMAN: "mam_wildman",

  SHEET_GR_LANCER: 'gr_lancer_sheet',
  SHEET_GR_INFANTRY: 'gr_infantry_sheet',
  SHEET_GR_HEAVY: 'gr_heavy_infantry_sheet',
  SHEET_GR_FLAGGER: 'gr_advisor_sheet',

  SHEET_BLUE_BANDIT: 'blue_bandit_sheet',
  SHEET_BLUE_BANDIT_LANCE: 'blue_lancer_bandit_sheet',
  SHEET_BLUE_BANDIT_BOSS: "blue_bandit_boss_sheet",

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

  IC_SPEECH: 26,

  //  -

  ANIM_IDLE: '-idle',
  ANIM_WALK: '-walk',
  ANIM_ATTACK: '-attack',
  ANIM_DEFEND: '-defend',

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

  ACT_MOVE_TO_TARGET_DISTANCE: "action_soldier_move_to_target_within_distance",
  ACT_MOVE_TO_TARGET_OFFSET: "action_soldier_move_to_target_with_offset",
  ACT_MOVE_TO_X: "action_soldier_move_to_x_position",
  ACT_SEARCH_FOR_TARGET: "action_search_for_target",
  ACT_WAIT_TIME: "action_wait_for_timer",
  LISTEN_CONDITION: "action_wait_for_condition",
  ACT_ATTACK: "action_soldier_attack",
  ACT_DEFEND: "action_soldier_defend",
  ACT_COMPLETE: "action_complete_instant",

  LISTEN_PLAYER_DISTANCE: "listener_player_distance",
  LISTEN_AVOID_OVERLAP: "listener_avoid_overlap",
  LISTEN_MATCH_LANE: "listener_match_lane",
  LISTEN_STATE: "listener_soldier_state",
  LISTEN_STATS_RECOVER: "listener_soldier_stats_recover",
  
  VIEW_SOLDIER_FLASH: "view_soldier_flash",
  VIEW_SOLDIER_LANE: "view_soldier_lane_tint",
  VIEW_ANIMATION: "view_soldier_animations",

  WORLD_LENGTHS: 3,
  GRAVITY: 60,

  TILEMAP_FLOOR: 160,
  GROUND_TOP: 207,

  AREA_WIDTH: 1920,

  BIRD_DIVE_SPEED: 240,
  BIRD_FLY_SPEED: 140,
  BIRD_DISTANCE_FROM_EDGE: 50
}
export default Vars;