var Plasma = function(lane) {
  this.lane = lane;
  this.depth = C.depth;
};

// Returns true when the plasma is done.
Plasma.prototype.update = function() {
  // FIXME: Speed should be a level variable.
  this.depth -= 8;

  if (this.depth < 0) {
    Snd.whiz();
    // FIXME: Interact with hero.
    return true;
  }
  else {
    return false;
  }
};

Plasma.prototype.draw = function() {
  var pos = grid.translate(this.lane, this.depth),
      angle = this.depth * 21 + 2 * Math.PI,
      depthFactor = grid.depthFactorAt(this.depth),
      i, dx, dy;

  c.save();
    grid.applyCanvasTranslation();

    c.lineWidth = 0.01;
    // FIXME
    c.strokeStyle = 'white';
    c.fillStyle = 'white';

    c.beginPath();
      c.moveTo(pos[0], pos[1]);
      for (i = 0; i < 3; i++) {
        angle += Math.PI * 2 / 3;
        dx = (Math.cos(angle) * depthFactor) / 5;
        dy = (Math.sin(angle) * depthFactor) / 5;
        c.lineTo(pos[0] + dx, pos[1] + dy);
        c.fillRect(pos[0] - (dx / 3), pos[1] - (dy / 3), 0.02, 0.02);
      }
    c.stroke();
  c.restore();
};
