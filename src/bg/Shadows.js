export default class Shadow {

  constructor() {
    this.staticShadowLines = [];
    this.dynamicShadowLines = [];
    this.dynamicLayers = [];
  }

  createShadowsLines(...layers) {

    const all_sprites = [];
    const all_points = [];

    for (let layer of layers) {
      all_sprites.push(...layer.getAll())
    }
    
    for (let sprite of all_sprites) {
      const left = {x: sprite.getBottomLeft().x, y: sprite.getBottomCenter().y, left:true};
      const right = {x: sprite.getBottomRight().x, y: sprite.getBottomCenter().y, left:false};

      if (sprite.visible)
        all_points.push(left, right);
    }
    all_points.sort((p1, p2) => p1.x - p2.x); // Ascending order

    //  Clean points to have only left and right pairs

    let leftCount = 0;  // Initial point
    let shadow_start_x = 0;
    const shadow_lines = [];
    
    for (let point of all_points) {

      const isRightEdge = !point.left;
      const isLeftEdge = point.left;

      if (isLeftEdge) {
        if (leftCount === 0) {
          shadow_start_x = point.x;
        }
        leftCount ++;
      }

      if (isRightEdge) {
        leftCount --;
        if (leftCount === 0) {
          const shadowLine = {x1:shadow_start_x, x2:point.x, y:point.y};
          shadow_lines.push(shadowLine);
        }
      }
    }

    return shadow_lines;
  }

  createStaticShadowLines(...layers) {
    const lines = this.createShadowsLines(...layers);
    this.staticShadowLines.push(...lines);
  }

  createDynamicShadowLines(...layers) {
    for (let layer of layers) {
      const lines = this.createShadowsLines(layer);
      this.dynamicShadowLines.push(...lines);
    }
  }

  addGraphics(graphics) {
    this.graphics = graphics;
  }

  addDynamicLayers(...layers) {
    this.dynamicLayers.push(...layers);
  }

  updateDynamicShadows() {
    this.dynamicShadowLines.length = 0;
    this.createDynamicShadowLines(...this.dynamicLayers);
  }

  drawShadows(graphics) {

    graphics.clear();

    for (let line of this.staticShadowLines) {
      
      graphics.lineStyle(1, 0x000000, .3);
      graphics.lineBetween(line.x1, line.y+1, line.x2, line.y+1);

      const padding = 4;
      graphics.lineBetween(line.x1, line.y, line.x1 + padding, line.y);
      graphics.lineBetween(line.x2, line.y, line.x2 - padding, line.y);

      graphics.lineStyle(1, 0x000000, .5);
      graphics.lineBetween(line.x1 + padding, line.y, line.x2 - padding, line.y);

    }

    for (let line of this.dynamicShadowLines) {
      
      const y1 = line.y - 1;
      const padding = 7;

      graphics.lineStyle(1, 0x000000, .4);
      graphics.lineBetween(line.x1 + padding, y1, line.x2 - padding, y1);
      
      //graphics.lineStyle(1, 0x000000, .3);
      //graphics.lineBetween(line.x1, y1, line.x1 + padding, y1);
      //graphics.lineBetween(line.x2, y1, line.x2 - padding, y1);
    }

  }
}