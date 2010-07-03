// Margin to account for when drawing the grid. Grid unit length.
C.gridMargin = 1.05;
// A constant used in converting grid twist into grid units, or some such. :S
C.gridTwistFactor = 1 / 32;
// The starting distance of the grid as we fly in.
C.flyInStart = 2 * C.depth;
// The Z-distance to advance the grid per frame.
C.flyInAdvance = 8;

// Just a fancy container.
var Grids = {};

var Grid = function(info) {
  // Store some things
  this.wraps = info.wraps;
  this.angles = info.angles;
  this.twist = [info.twist[0] * C.gridTwistFactor, info.twist[1] * C.gridTwistFactor];

  // Calculate the front edge grid-screen coordinates, sans distance transformations.
  // Also calculate the size of the bounding box, and build an array of adjacents.
  var coords = [], adjacents = [],
      angle = 0, x = 0, y = 0, i, radians, // State.
      xmin = 0, xmax = 0, ymin = 0, ymax = 0; // Used to keep track of boundaries.
  // Initialize array sizes.
  coords[this.angles.length-1]  = null;
  adjacents[this.angles.length] = null;
  for (i = 0; i < this.angles.length; i++) {
    // Store current position.
    coords[i] = [x, y];

    // Keep track of the boundaries.
    xmin = Math.min(x, xmin); xmax = Math.max(x, xmax);
    ymin = Math.min(y, ymin); ymax = Math.max(y, ymax);

    // Iterate around the grid.
    angle += this.angles[i];
    // Normalize the angle.
    while (angle < 0) { angle += 360; }
    angle %= 360;
    // Calculate the coordinates.
    radians = angle * C.radPerDeg;
    x += Math.cos(radians); y -= Math.sin(radians);

    // Store the absolute angle of the CW adjacent vertex.
    // The CCW angle is added later, and simply set to null here.
    adjacents[i] = [angle, null];
  }
  // Close the grid, or add the final lane.
  if (this.wraps) {
    // -1 signifies a closing segment, used in #draw
    coords[i] = coords[0].concat([-1]);
    adjacents[i] = adjacents[0];
  }
  else {
    coords[i] = [x, y];
    adjacents[i] = [null, null];
    xmin = Math.min(x, xmin); xmax = Math.max(x, xmax);
    ymin = Math.min(y, ymin); ymax = Math.max(y, ymax);
  }

  // Calculate the absolute angles of the CCW adjacent vertices.
  for (i = 0; i < adjacents.length; i++) {
    var previous = (i !== 0) ? i - 1 : adjacents.length - 1;
    adjacents[i][1] = (180 + adjacents[previous][0]) % 360;
  }

  // Add margins to the boundaries.
  xmin -= C.gridMargin; xmax += C.gridMargin;
  ymin -= C.gridMargin; ymax += C.gridMargin;

  // Account for twist, by twisting the boundaries we just calculated as if they were at the back
  // of the grid. Then maximimze between our original and these new boundaries.
  var factor = C.startDepth / C.endDepth;
  xmin = Math.min(xmin, (xmin - this.twist[0]) * factor + this.twist[0]);
  xmax = Math.max(xmax, (xmax - this.twist[0]) * factor + this.twist[0]);
  ymin = Math.min(ymin, (ymin - this.twist[1]) * factor + this.twist[1]);
  ymax = Math.max(ymax, (ymax - this.twist[1]) * factor + this.twist[1]);

  // Calculate the total size, including margins.
  this.size = [xmax - xmin, ymax - ymin];

  // Translate all coordinates, so the origin becomes the center of the drawing.
  var translation = [-(xmin + xmax) / 2, -(ymin + ymax) / 2];
  for (i = 0; i < coords.length; i++) {
    coords[i][0] += translation[0];
    coords[i][1] += translation[1];
  }

  // Store coordinates.
  this.coords = coords;
  this.adjacents = adjacents;
  this.numLanes = this.coords.length - 1;

  // Initialize.
  this.color = [255, 255, 255];
  this.scoords = [];
  this.scoords[this.coords.length - 1] = null; // Initialize array size.
  this.setDistance(0);
};

// Apply canvas translations required before drawing grid-screen coordinates.
Grid.prototype.screenTranslation = function() {
  // Translate to the center of the screen.
  c.translate(frame.w / 2, frame.h / 2);
  // Scale to fit the grid neatly on the screen.
  var scale = Math.min(frame.w / this.size[0], frame.h / this.size[1]);
  c.scale(scale, scale);
  // Translate with the grid twist, so that the origin becomes the point of convergence.
  c.translate(this.twist[0], this.twist[1]);
  // Apply the alpha factor to everything on the grid.
  c.globalAlpha = this.alphaFactor;
};

// Find the width factor at the given depth.
Grid.prototype.depthFactorAt = function(depth) {
  return C.startDepth / (C.startDepth + depth + this.distance);
};

// Apply canvas translations required before drawing grid-lane coordinates.
// This should be applied after the screen translation.
Grid.prototype.laneTranslation = function(lane, depth) {
  var laneIndex = Math.round(lane),
      posFactor = lane + 0.5 - laneIndex;

  // Find both corners belonging to this lane.
  var cornerA = this.coords[laneIndex],
      cornerB = this.coords[(laneIndex + 1) % this.coords.length];

  // Calculate the horizontal position on the lane.
  var posX = cornerA[0] + posFactor * (cornerB[0] - cornerA[0]),
      posY = cornerA[1] + posFactor * (cornerB[1] - cornerA[1]);

  // Translate.
  var depthFactor = this.depthFactorAt(depth);
  c.scale(depthFactor, depthFactor);
  c.translate(posX - this.twist[0], posY - this.twist[1]);
};

// Distance setter, which caches some drawing variables.
Grid.prototype.setDistance = function(distance) {
  this.distance = distance;

  // Calculate grid-screen coordinates for each grid corner.
  var frontDepthFactor = this.depthFactorAt(0),
      backDepthFactor  = this.depthFactorAt(C.depth),
      i, corner;
  for (i = 0; i < this.coords.length; i++) {
    corner = this.coords[i];
    this.scoords[i] = {
      // Note that the twist factor here is negating what was done in #screenTranslation.
      sx: (corner[0] - this.twist[0]) * frontDepthFactor,
      sy: (corner[1] - this.twist[1]) * frontDepthFactor,
      ex: (corner[0] - this.twist[0]) * backDepthFactor,
      ey: (corner[1] - this.twist[1]) * backDepthFactor,
      close: (corner[2] === -1)
    };
  }

  // Calculate 'fog', (or the alpha channel value).
  if (this.distance < C.fogDepth) {
    this.alphaFactor = 1.0;
  }
  else {
    this.alphaFactor = Math.max(0,
        1 - (this.distance - C.startDepth) / (C.flyInStart - C.startDepth - 1));
  }
};

// Draw a polygon around the solid area of the grid.
Grid.prototype.drawArea = function() {
  var i, corner;

  c.moveTo(this.scoords[0].sx, this.scoords[0].sy);
  for (i = 1; i < this.scoords.length; i++) {
    corner = this.scoords[i];
    c.lineTo(corner.sx, corner.sy);
  }
  for (i -= 1; i >= 0; i -= 1) {
    corner = this.scoords[i];
    c.lineTo(corner.ex, corner.ey);
  }
  c.closePath();
};

// Draw the lane borders.
Grid.prototype.drawLanes = function() {
  var i, corner;

  // Draw the borders between lanes.
  for (i = 0; i < this.scoords.length; i++) {
    corner = this.scoords[i];
    c.moveTo(corner.sx, corner.sy);
    c.lineTo(corner.ex, corner.ey);
  }

  // Draw front edge all around.
  c.moveTo(this.scoords[0].sx, this.scoords[0].sy);
  for (i = 1; i < this.scoords.length; i++) {
    corner = this.scoords[i];
    if (corner.close) { c.closePath(); break; }
    c.lineTo(corner.sx, corner.sy);
  }

  // Draw back edge.
  c.moveTo(this.scoords[0].ex, this.scoords[0].ey);
  for (i = 1; i < this.scoords.length; i++) {
    corner = this.scoords[i];
    if (corner.close) { c.closePath(); break; }
    c.lineTo(corner.ex, corner.ey);
  }
};

// Paint all of the grid.
// The caller is responsible for applying the screen translation first.
Grid.prototype.paint = function() {
  var style = 'rgb('+this.color[0]+','+this.color[1]+','+this.color[2]+')';
  c.fillStyle = style;
  c.strokeStyle = style;
  c.lineWidth = 0.01;

  c.globalAlpha = 0.03 * this.alphaFactor;
  c.beginPath();
    this.drawArea();
  c.fill();

  c.globalAlpha = this.alphaFactor;
  c.beginPath();
    this.drawLanes();
  c.stroke();

  // Assumption: the original +globalAlpha+ was already +alphaFactor+
};


// Grid definitions follow. The lanes are all homogeneous in width, so all that has to be stored
// for a grid are the +angles+ between lanes. The first angle is a starting angle, where 0 means
// rightwards on the screen. Angles are then specified in counter-clockwise fashion. All angles
// are in degrees.

// +wraps+ is a boolean, whether the grid wraps around. The final angle should be next-to-last
// corner if true, and be carefully tuned not to cause a wider or narrower lane, of course.

// +twist+ is used to apply an offset to the back plane of the grid, and is specified as [x,y].
// This effectively rotates the level slightly around the [y,x] axes (or [yaw,pitch] if you will).
// The unit of this looks like it was meant to be degrees, but treat it as somewhat arbitrary.

Grids.Circle16 = new Grid({ wraps: true, twist: [0,45], angles: [
  165, -21, -21, -21, -27, -21, -21, -21, -27, -21, -21, -21, -27, -21, -21, -21
]});

Grids.Square16 = new Grid({ wraps: true, twist: [0,0], angles: [
  90, 0, 0, 0, 270, 0, 0, 0, -90, 0, 0, 0, -90, 0, 0, 0
]});

Grids.Plus16 = new Grid({ wraps: true, twist: [0,30], angles: [
  270, -90, 0, -90, 90, -90, 0, -90, 90, -90, 0, -90, 90, -90, 0, -90
]});

Grids.Peanut16 = new Grid({ wraps: true, twist: [0,20], angles: [
  168, -33, -45, -45, -33, -39, 27, 27, -39, -33, -45, -45, -33, -39, 27, 27
]});

Grids.RoundedPlus16 = new Grid({ wraps: true, twist: [0,0], angles: [
  0, -69, 24, 21, -66, -69, 24, 24, -69, 291, 24, 24, -69, -69, 24, 24
]});

Grids.Triangle15 = new Grid({ wraps: true, twist: [0,0], angles: [
  180, 0, 0, 0, 0, -120, 0, 0, 0, 0, -120, 0, 0, 0, 0
]});

Grids.X16 = new Grid({ wraps: true, twist: [0,0], angles: [
  63, -57, -90, -60, 108, -60, -90, -57, 126, -57, -90, -60, 108, 300, -90, -57
]});

Grids.V15 = new Grid({ wraps: false, twist: [0,-100], angles: [
  246, 0, 0, 0, 0, 0, 0, -66, -66, 0, 0, 0, 0, 0, 0
]});

Grids.Stairs15 = new Grid({ wraps: false, twist: [0,-100], angles: [
  270, 270, 90, 270, 90, 270, 90, 270, 270, 90, 270, 90, 270, 90, 270
]});

Grids.U16 = new Grid({ wraps: false, twist: [0,0], angles: [
  270, 0, 0, 0, -15, -21, -21, -21, -24, -21, -24, -24, -9, 0, 0, 0
]});

Grids.Flat16 = new Grid({ wraps: false, twist: [0,-128], angles: [
  180, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
]});

Grids.CircleCut16 = new Grid({ wraps: true, twist: [0,45], angles: [
  165, -21, -27, -27, -27, -51, -66, -24, 156, -24, -69, -48, -27, -27, -30, -18
]});

Grids.Starburst16 = new Grid({ wraps: true, twist: [0,30], angles: [
  255, -105, 60, -105, 60, -105, 60, -105, 60, -105, 60, -105, 60, -105, 60, -105
]});

Grids.W15 = new Grid({ wraps: false, twist: [0,-128], angles: [
  225, 30, 6, -33, -48, -48, -30, 78, 75, -27, -48, -48, -33, 3, 27
]});

Grids.CrookedV16 = new Grid({ wraps: false, twist: [0,-50], angles: [
  -102, 0, -6, -72, 72, 12, -21, -69, 51, -87, -21, -6, -6, 3, 6, 6
]});

Grids.Eight16 = new Grid({ wraps: true, twist: [2,2], angles: [
  237, -39, -39, -42, -57, -45, -36, -39, 3, 39, 39, 39, 60, 42, 39, 39
]});

Grids.Grid200 = new Grid({ wraps: true, twist: [0,0], angles: [
  207, 0, 315, 315, 0, 270, 0, 315, 315, 0, 36, 0, 45, 45, 0, 90, 0, 45, 45, 0
]});

Grids.Grid100 = new Grid({ wraps: false, twist: [0,45], angles: [
  180, -18, -18, -18, -18, -18, -18, -18, -18, -18,
  -18, -18, -18, -18, -18, -18, -18, -18, -18, -18
]});

Grids.Grid101 = new Grid({ wraps: true, twist: [0,0], angles: [
  90, 0, 0, 0, 270, 0, 0, 0, 0, 270, 0, 0, 0, 0, 270, 0, 0, 0, 0, 270
]});

Grids.Grid102 = new Grid({ wraps: true, twist: [0,20], angles: [
  168, -33, -45, -45, -33, -39, 27, 27, -39, -33, -45, -45, -33, -39, 27, 27
]});

Grids.Grid103 = new Grid({ wraps: false, twist: [0,-100], angles: [
  234, 0, 0, 0, 0, 0, 0, 246, 0, 0, 0, 0, 0, 0
]});

Grids.Grid104 = new Grid({ wraps: false, twist: [0,-100], angles: [
  270, 270, 90, 270, 90, 270, 90, 270, 270, 90, 270, 90, 270, 90, 270
]});

Grids.Grid105 = new Grid({ wraps: true, twist: [0,0], angles: [
  135, 0, 270, 270, 0, 90, 0, 270, 270, 0, 90, 0, 270, 270, 0, 90, 0, 270, 270, 0
]});

Grids.Grid106 = new Grid({ wraps: true, twist: [-10,-10], angles: [
  90, 0, 0, 270, 0, 270, 90, 90, 270, 0, 270, 0, 0, 270, 0, 270, 90, 90, 270, 0
]});

Grids.Grid107 = new Grid({ wraps: true, twist: [0,0], angles: [
  135, 0, 0, 270, 0, 0, 270, 18, 54, 18, 270, 0, 0, 270, 0, 0, 270, 18, 54, 18
]});

Grids.Grid108 = new Grid({ wraps: true, twist: [0,0], angles: [
  90, 270, 90, 270, 0, 270, 90, 270, 90, 270, 0, 270,
  90, 270, 90, 270, 0, 270, 90, 270, 90, 270, 0, 270
]});

Grids.Grid109 = new Grid({ wraps: true, twist: [0,45], angles: [
  180, -72, 36, -72, 36, -72, 36, -72, 36, -72, 36, -72, 36, -72, 36, -72, 36, -72, 36, -72
]});

Grids.Grid110 = new Grid({ wraps: true, twist: [0,0], angles: [
  78, 0, 270, 0, 0, 270, 0, 0, 270, 0, 0, 270, 45, 0, 0, 90, 0, 0, 90, 0, 0, 90, 0, 0
]});

Grids.Grid111 = new Grid({ wraps: true, twist: [0,0], angles: [
  144, 0, 66, 0, 204, 0, 66, 0, 204, 0, 66, 0, 204, 0, 66, 0, 114, 66, 204, 66, 204, 66, 204, 66
]});

Grids.Grid112 = new Grid({ wraps: true, twist: [0,0], angles: [
  45, 0, 270, 270, 0, 45, 45, 0, 270, 270, 0, 45, 45, 0, 270, 270, 0, 45, 45, 0, 270, 270, 0, 45
]});

Grids.Grid113 = new Grid({ wraps: true, twist: [0,0], angles: [
  180, 0, -120, 0, 0, 0, 0, -120, 0, 0, 0, 0, -120, 0, 0
]});

Grids.Grid114 = new Grid({ wraps: false, twist: [0,0], angles: [
  -180, 0, 0, -72, 0, 0, -72, 0, 0, -72, 0, 0, -72, 0, 0
]});

Grids.Grid115 = new Grid({ wraps: true, twist: [0,0], angles: [
  120, 0, 0, -60, 0, 0, -60, 0, 0, -60, 0, 0, -60, 0, 0, -60, 0, 0
]});

Grids.Grid116 = new Grid({ wraps: false, twist: [0,0], angles: [
  0, 90
]});

Grids.Grid119 = new Grid({ wraps: true, twist: [0,30], angles: [
  180, -108, 72, -108, 72, -108, 72, -108, 72, -108,
   72, -108, 72, -108, 72, -108, 72, -108, 72, -108
]});
