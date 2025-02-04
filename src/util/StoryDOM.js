export default class StoryDOM {
  
  static ShowInstruction(instructionsArray) {
    addElements(instructionsArray);
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
