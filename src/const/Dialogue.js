import Enum from "../util/Enum";

//  Line break -#

const bf_entrance = 
  `
  Moon Chief: Hah. So you seek death.
  `;

const bf_battle = 
  `
  Moon Chief: Hold firm, stranger! I have come to aid you!-#
  Wildman: A warrior? You're a welcome sight!-#
  Wildman: By the might of the Blue Forest, they shall fall!-#
  Moon Chief: Your power is impressive.-#
  Wildman: And your style is unmatched! You strike like a bird diving into water!-#
  Wildman: I am Wildman of the Blue Forest. And you?-#
  Moon Chief: I am Moon Chief of the Moon at Midnight tribe.-#
  Wildman: For the Blue Forest, we shall prevail!
  `;

//  -

const Dialogue = new Map([
  [Enum.BF_TEST, bf_entrance],
  [Enum.BF_BATTLE, bf_battle],
])
export default Dialogue;