var Pulsar = function(lane) {
  this.lane = lane;
  this.depth = C.depth;
  this.rotation = grid.adjacents[Math.round(lane)][0] * C.radPerDeg;
  this.power = 0;
};

Pulsar.prototype.update = function() {
  // FIXME: Speed should be a level variable.
  this.depth -= 2;
  if (this.depth < 0) { this.depth = 0; }

  // FIXME: Flip and pulse.
};

Pulsar.prototype.draw = function() {
  c.save();
    var ex = Math.cos(this.rotation) / 2;
    var ey = -Math.sin(this.rotation) / 2;
    var dx = ex - (this.power * ex) / 32;
    var dy = ey - (this.power * ey) / 32;
    var bx = dx / 3;
    var by = dy / 3;
    var normx = (-dy*this.power) / 16;
    var normy = ( dx*this.power) / 16;
    c.moveTo(ex+dx,           ey+dy);
    c.lineTo(ex+dx-bx+normx,  ey+dy-by+normy);
    c.lineTo(ex+bx-normx,     ey+by-normy);
    c.lineTo(ex+normx,        ey+normy);
    c.lineTo(ex-bx-normx,     ey-by-normy);
    c.lineTo(ex-dx+bx+normx,  ey-dy+by+normy);
    c.lineTo(ex-dx,           ey-dy);
  c.restore();
};

Pulsar.prototype.paint = function() {
  c.save();
    grid.laneTranslation(this.lane, this.depth);

    c.lineWidth = 0.02;
    // FIXME
    c.strokeStyle = 'yellow';

    c.beginPath();
      this.draw();
    c.stroke();
  c.restore();
};
