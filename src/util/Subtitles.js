
let scene;
let fullScript;

let uniqueCount = 0;
let isVisible = false;

/** Technically they are subtitles (Dialogue) */
export default class Subtitles {

  static SetScene(s) {
    scene = s;
  }

  static SetScript(json) {
    fullScript = json;
  }

  static GetScript() {
    return fullScript;
  }

  static IsShowing() {
    return isVisible;
  }

  static ShowDialogue(name, text, ttl = 4000) {
    
    uniqueCount ++;
    const current = uniqueCount;

    scene.time.addEvent({
      delay: ttl,
      callback: ()=>{
        if (current === uniqueCount) {
          this.HideDOM();
        }
      }
    });

    this.SetText(name, text);
    this.ShowDOM();
    
  }

  static SetText(name, content) {
    const speaker = document.getElementById("speech-speaker");
    const text = document.getElementById("speech-text");
    speaker.innerText = name;
    text.innerText = content;
  }

  static ShowDOM() {
    const speechbox = document.getElementById("speech-box");
    speechbox.classList.add("anim-fadeIn");
    isVisible = true;
  }

  static HideDOM() {
    const speechbox = document.getElementById("speech-box");
    speechbox.classList.remove("anim-fadeIn");
    isVisible = false;
  }

}
