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
  for (let paragraph of parts) {
    const ele = document.createElement("p");
    ele.innerText = paragraph;
    container.appendChild(ele);
  }
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

  {id:Enum.ACT_GOTO_PLAYER, p:[""]}   // Just to copy
];
