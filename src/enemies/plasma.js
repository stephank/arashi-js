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
  var angle = this.depth * 21 + 2 * Math.PI,
      i, dx, dy;

  c.save();
    grid.screenTranslation();
    grid.laneTranslation(this.lane, this.depth)

    c.lineWidth = 0.01;
    // FIXME
    c.strokeStyle = 'white';
    c.fillStyle = 'white';

    c.beginPath();
      c.moveTo(0, 0);
      for (i = 0; i < 3; i++) {
        angle += Math.PI * 2 / 3;
        dx = Math.cos(angle) / 5;
        dy = Math.sin(angle) / 5;
        c.lineTo(dx, dy);
        c.fillRect(-(dx / 2), -(dy / 2), 0.02, 0.02);
      }
    c.stroke();
  c.restore();
};
