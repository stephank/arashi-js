C.spikerRotation = 5 / 120 * 2 * Math.PI;
C.spikerCorner = Math.PI * 2 / 5;

var Spiker = function(lane) {
  this.lane = lane;
  this.depth = C.depth;
  this.rotation = 0;
  this.movingUp = true;
};

// Returns true when the spiker is done.
Spiker.prototype.update = function() {
  var spike = spikes[this.lane];

  this.rotation += C.spikerRotation;

  // FIXME: Speed should be a level variable.
  this.depth += 1 * (this.movingUp ? -1 : +1);
  spike.top = Math.min(spike.top, this.depth);

  // FIXME: Minimum depth should be a level variable
  if (this.depth < 40) {
    this.movingUp = false;
  }
  else if (this.depth > C.depth) {
    return true;
  }

  // FIXME: Interact with hero.
  return false;
};

Spiker.prototype.paint = function() {
  var angle = this.rotation,
      i, dx, dy;

  c.save();

    c.lineWidth = 0.015;
    // FIXME
    c.strokeStyle = 'white';

    // Brighten the spike section between the bottom and this spiker.
    c.beginPath();
      c.save();
        grid.laneTranslation(this.lane, this.depth);
        c.moveTo(0, 0);
      c.restore();

      c.save();
        grid.laneTranslation(this.lane, C.depth);
        c.lineTo(0, 0);
      c.restore();
    c.stroke();

    // The spike itself
    c.beginPath();
      c.save();
        grid.laneTranslation(this.lane, this.depth);
        dx = Math.cos(angle) / 6;
        dy = Math.sin(angle) / 6;
        c.moveTo(dx, dy);
        for (i = 0; i < 4; i++) {
          angle += C.spikerCorner;
          dx = Math.cos(angle) / 6;
          dy = Math.sin(angle) / 6;
          c.lineTo(dx, dy);
        }
      c.restore();
      c.closePath();
    c.stroke();

  c.restore();
};
