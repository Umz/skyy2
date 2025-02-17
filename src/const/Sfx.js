const Sfx = {

  ATTACK1: { key: "fx_attack1.mp3", config: {volume: .3} },
  ATTACK2: { key: "fx_attack2.mp3", config: {volume: .3} },
  BLOCK_ACTION: { key: "fx_block_action.mp3", config: {volume: .1} },
  MOVE: { key: "fx_move.mp3", config: {volume: .1} },

  HIT1: { key: "fx_hit1.mp3", config: {volume: .2} },
  DEFENDED: { key: "fx_defended.mp3", config: {volume: .2} },
  CLASHED: { key: "fx_clashed.mp3", config: {volume: .2} },
  HEAL: { key: "fx_heal.mp3", config: {volume: .2} },
  DIE1: { key: "fx_die1.mp3", config: {volume: .2} },

  ROCK_SMASH: { key: "fx_stone_smash.mp3", config: {volume: .2} },
  CLAIMING: { key: "fx_claiming.mp3", config: {volume: .2, loop: true} },
  LAND_CLAIMED: { key: "fx_claim_land.mp3", config: {volume: .4} },

  MUS_GAME: { key: "bg_game.ogg", config: {volume: .3, music:true, loop:true} }
}
export default Sfx;