// Phaser.Input.Gamepad.Gamepad - Check Phaser docs here for keys
const PS3_X = 0;
const PS3_CIRCLE = 1;
const PS3_SQUARE = 2;
const PS3_TRIANGLE = 3;
const PS3_START = 9;
const PS3_UP = 12;
const PS3_DOWN = 13;
const PS3_LEFT = 14;
const PS3_RIGHT = 15;

export default class KeyboardMapper {

  constructor(scene) {
    this.scene = scene;
  }

  registerGamepad(keyMapper) {

    const controllerChecks = [
      {index: PS3_SQUARE, action:keyMapper.attack},
      {index: PS3_TRIANGLE, action:keyMapper.attack},
      {index: PS3_X, action:keyMapper.defend},
      {index: PS3_CIRCLE, action:keyMapper.defend},
      {index: PS3_START, action:keyMapper.start},
      {index: PS3_DOWN, action:keyMapper.down},
      {index: PS3_UP, action:keyMapper.up},
      {index: PS3_LEFT, action:keyMapper.left},
      {index: PS3_RIGHT, action:keyMapper.right},
    ];

    this.scene.input.gamepad.on('down', (pad, button, values) => {
      for (let presses of controllerChecks) {
        if (button.index === presses.index) {
          keyMapper.pressKey(presses.action);
          break;
        }
      }
    });
    this.scene.input.gamepad.on('up', (pad, button, values) => {
      for (let presses of controllerChecks) {
        if (button.index === presses.index) {
          keyMapper.releaseKey(presses.action);
          break;
        }
      }
    });
  }

  registerKeyboard(keyMapper) {

    this.addPress('Z', keyMapper, keyMapper.attack);
    this.addPress('X', keyMapper, keyMapper.defend);

    this.addPress('ENTER', keyMapper, keyMapper.start);
    this.addPress('SPACE', keyMapper, keyMapper.start);
    this.addPress('P', keyMapper, keyMapper.pause);

    this.addPress('RIGHT', keyMapper, keyMapper.right);
    this.addPress('LEFT', keyMapper, keyMapper.left);
    this.addPress('UP', keyMapper, keyMapper.up);
    this.addPress('DOWN', keyMapper, keyMapper.down);
  }

  addPress(button, mapper, action) {
    const scene = this.scene;
    scene.input.keyboard.on(`keydown-${button}`, event => {mapper.pressKey(action)});
    scene.input.keyboard.on(`keyup-${button}`, event => {mapper.releaseKey(action)});
  }

}