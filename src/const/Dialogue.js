import Enum from "../const/Enum";

//  Line break -#

const bf_entrance = `
Moon Chief: Hah. So you seek death.
`;

const bf_battle = `
Moon Chief: Hold firm, stranger! I have come to aid you!-#
Wildman: A warrior? You're a welcome sight!-#
Wildman: By the might of the Blue Forest, they shall fall!-#
Moon Chief: Your power is impressive.-#
Wildman: And your style is unmatched! You strike like a bird diving into water!-#
Wildman: I am Wildman of the Blue Forest. And you?-#
Moon Chief: I am Moon Chief of the Moon at Midnight tribe.-#
Wildman: For the Blue Forest, we shall prevail!
`;

const bf_victory = `
Moon Chief: We are victorious.-#
Wildman: That we are! Never been so thankful for outsiders, but you saved me there.-#
Moon Chief: Then join me, Wildman, as Blue Moon of the Moon at Midnight tribe.-#
Wildman: Ha!…-#
Moon Chief: Perhaps I misjudged you.-#
Wildman: No, I am the defender of this forest.-#
Moon Chief: The forest is safe, the tribe shall defend it.-#
Wildman: Hahaha! You are an interesting one indeed!-#
Wildman: Fine, I will join you!
`;

const bf_boss1 = `
Rabid Bandit: Ruthless animals! Curse you!-#
Rabid Bandit: Murderous dogs! You slaughtered them all!
`;

const bf_boss2 = `
Rabid Bandit: Where were you when the Rays of Gold massacred us!-#
Rabid Bandit: Where were you when we were slain!
`;

const bf_boss3 = `
Rabid Bandit: What choice did we have! We had to eat!-#
Rabid Bandit: Curse you! Heartless dogs! Curse you both!-#
Rabid Bandit: Come on my brethren! Kill them!
`;

const mam_bm_first = `
Blue Moon: So the rumours were true..-#
Blue Moon: They are indeed as beautiful as they say.
`;

//  -

const Dialogue = new Map([

  [Enum.BF_TEST, bf_entrance],
  [Enum.BF_BATTLE, bf_battle],
  [Enum.BF_WIN, bf_victory],
  [Enum.BF_BOSS1, bf_boss1],
  [Enum.BF_BOSS2, bf_boss2],
  [Enum.BF_BOSS3, bf_boss3],

  [Enum.MAM_BM_FIRST, mam_bm_first],

  [Enum.MC_TAUNT, "Moon Chief: Come! I shall grant you a swift death."],
  [Enum.MC_PEOMS, "Moon Chief: More peons. How futile"]
])
export default Dialogue;