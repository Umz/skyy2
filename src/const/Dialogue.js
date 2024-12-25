import Enum from "../util/Enum";

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
Moon Chief: We are victorious.
Wildman: That we are! Never been so thankful for outsiders, but you saved me there.
Moon Chief: Then join me, Wildman, as Blue Moon of the Moon at Midnight tribe.
Wildman: Ha!…
Moon Chief: Perhaps I misjudged you.
Wildman: No, I am the defender of this forest.
Moon Chief: The forest is safe, the tribe shall defend it.
Wildman: Hahaha! You are an interesting one indeed!
Wildman: Fine, I will join you!
`;

//  -

const Dialogue = new Map([
  [Enum.BF_TEST, bf_entrance],
  [Enum.BF_BATTLE, bf_battle],
  [Enum.BF_WIN, bf_victory],
])
export default Dialogue;