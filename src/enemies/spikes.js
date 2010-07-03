var Spike = function(lane, top) {
  this.lane = lane;
  if (top) {
    this.top = top;
  }
  else {
    this.top = C.depth;
  }
};

Spike.prototype.draw = function() {
  c.save();
    grid.laneTranslation(this.lane, this.top);
    c.moveTo(0, 0);
  c.restore();

  c.save();
    grid.laneTranslation(this.lane, C.depth);
    c.lineTo(0, 0);
  c.restore();
};

Spike.prototype.paint = function() {
  c.lineWidth = 0.01;
  // FIXME
  c.strokeStyle = 'yellow';

  c.beginPath();
    this.draw();
  c.stroke();
};


var spikes = [];

spikes.init = function() {
  // Truncate array.
  spikes.length = 0;

  // Create new spikes for each lane.
  var i;
  spikes[grid.numLanes - 1] = null; // Initialize array size.
  for (i = 0; i < grid.numLanes; i++) {
    // FIXME: Spike starting depth should be a level variable.
    spikes[i] = new Spike(i, 80);
  }
};

spikes.paint = function() {
  var i;
  for (i = 0; i < grid.numLanes; i++) {
    spikes[i].paint();
  }
};
