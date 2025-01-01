/** Handles all active actions for a Sprite */
export default class ActionManager {

  constructor() {

    this.actionsArray = [];
    this.backgroundActionMap = new Map();

    this.actionsActive = true;
    this.backgroundActive = true;
  }

  update(time, delta) {

    if (this.actionsActive) {

      const first = this.actionsArray[0];
      if (first) {
        first.mainUpdate(time, delta);
        if (first.isComplete()) {
          this.actionsArray.shift();
        }
      }

      if (this.actionsArray.length === 0) {
        this.setDefaultActions();
      }
    }

    if (this.backgroundActive) {
      mapUpdate(this.backgroundActionMap, time, delta);
    }
  }

  setSprite(sprite) {
    this.sprite = sprite;
    this.scene = sprite.scene;
    return this;
  }

  setDefaultActions() {}

  addAction(action) {
    this.actionsArray.push(action);
    return action;
  }

  addActions(...actions) {
    this.actionsArray.push(...actions);
  }

  insertAction(action) {
    this.actionsArray.unshift(action);
    return action;
  }

  insertActions(...actions) {
    this.actionsArray.unshift(...actions);
  }

  removeAction(actionName) {
    const actionIndex = this.actionsArray.findIndex(action => action.name === actionName);
    if (actionIndex !== -1) {
      array.splice(actionIndex, 1);
    }
  }

  addBackgroundAction(action) {
    this.backgroundActionMap.set(action.name, action);
    return action;
  }

  removeBackgroundAction(actionName) {
    this.backgroundActionMap.delete(actionName);
  }

  setActionsActive(b) {
    this.actionsActive = b;
  }

  setBackgroundActive(b) {
    this.backgroundActive = b;
  }

  hasAction(actionName) {
    const actionIndex = this.actionsArray.findIndex(action => action.name === actionName);
    return (actionIndex !== -1)
  }

  hasBackgroundAction(key) {
    return this.backgroundActionMap.has(key);
  }

  clearActions() {
    const first = this.actionsArray[0];
    if (first) {
      first.stop();
    }
    this.actionsArray.length = 0;
  }

  clearBackgroundActions() {
    clearActionMap(this.backgroundActionMap);
    this.backgroundActionMap.clear();
  }

  clearAllActions() {
    this.clearActions();
    this.clearBackgroundActions();
  }

  getCurrentAction() {
    return this.actionsArray[0] || null;
  }

}

function mapUpdate(map, time, delta) {
  let completeActions = [];
  for (let action of map.values()) {
    action.mainUpdate(time, delta);
    if (action.isComplete()) {
      completeActions.push(action.name);
    }
  }
  for (let actionName of completeActions) {
    map.delete(actionName);
  }
}

function clearActionMap(map) {
  let allNames = [];
  for (let action of map.values()) {
    action.stop();
    allNames.push(action.name);
  }
  for (let name of allNames) {
    map.delete(name);
  }
}
