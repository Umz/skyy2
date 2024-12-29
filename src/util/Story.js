import Enum from "./Enum";

export default class Story {
  
  static ShowStory(storyID) {
    const parts = getParts(storyID);
    addElements(parts.p);
    showBox();
  }

  static HideStory() {
    hideBox();
  }
}

function addElements(parts) {
  const container = document.getElementById("storybox");

  //  Story text

  for (let paragraph of parts) {
    const ele = document.createElement("p");
    ele.innerText = paragraph;
    container.appendChild(ele);
  }

  //  Press Z
  const div = document.createElement("div");
  div.innerHTML = "Press <span class='keyboard-key'>Z</span>"
  container.appendChild(div);
}

function showBox() {
  const container = document.getElementById("storybox");
  container.classList.remove("hidden");
}

function hideBox() {
  const container = document.getElementById("storybox");
  container.classList.add("hidden");
  container.innerHTML = "";
}

function getParts(id) {
  return StoryParts.find(obj => obj.id === id);
}

const StoryParts = [
  {id:Enum.STORY_0_INTRO, p:["After his heroic feats during the Battle of the New Moon, Moon Chief was appointed army commander.", "He now seeks the path to glory by securing these lands."]},
  {id:Enum.STORY_1A_APPRENTICE, p:["Raiders dare to attack our tribe. Pierce through them. This will be their demise."]},
  {id:Enum.STORY_1B_APPRENTICE, p:["There are still enemies here. Find them. Destroy them. Be ruthless."]},
  {id:Enum.STORY_1C_BLUEFOREST, p:["They came from Blue Forest to the West. Go there."]},
  {id:Enum.STORY_2A_CLAIM_BLUE, p:["Leave no enemies alive. They submit or they die.", "This forest will fly the flag of our tribe now."]},
  {id:Enum.STORY_2B_PLACE_FLAG, p:["Now place our banner by the Teal tree! This forest is our territory now."]},
  {id:Enum.STORY_2C_LEAVE_FOREST, p:["The forest is safe now. It belongs to Moon at Midnight.", "Now head east of the village to expand our territory. Show no mercy to any who oppose us."]},
  {id:Enum.STORY_3_DESTROY_ROSE, p:["There are still some who would oppose us here? Take out any who dare."]},
  {id:Enum.STORY_4_CLAIM_STORM, p:["This village must fly with our tribe now. They submit or they die."]},
];
