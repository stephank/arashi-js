C.plasmaRotation = 21 / 120 * 2 * Math.PI;
C.plasmaCorner = Math.PI * 2 / 3;

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

Plasma.prototype.paint = function() {
  var angle = this.depth * C.plasmaRotation,
      i, dx, dy;

  c.save();
    grid.laneTranslation(this.lane, this.depth);

    c.lineWidth = 0.02;
    // FIXME
    c.strokeStyle = 'white';
    c.fillStyle = 'white';

    c.beginPath();
      c.moveTo(0, 0);
      for (i = 0; i < 3; i++) {
        angle += C.plasmaCorner;
        dx = Math.cos(angle) / 6;
        dy = Math.sin(angle) / 6;
        c.lineTo(dx, dy);
        c.fillRect(-(dx / 2), -(dy / 2), 0.03, 0.03);
      }
    c.stroke();
  c.restore();
};
