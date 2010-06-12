var Starfield = {
  stars: [],
  color: [255,255,255],

  currentStars: 0,
  maxStars: 75,
  newStars: 2,
  spawnArea: null,
  starSpeed: 5,

  twist: [0,0],
  origTwist: [0,0],
  targetTwist: [0,0],
  tweeker: 0
};
// Set element maxStars+1 to null, to initialize stars array
Starfield.stars[Starfield.maxStars] = null;

Starfield.feed = function() {
  // Lazy init
  if (this.spawnArea === null) {
    this.spawnArea = {
      t: frame.h * -0.5,
      l: frame.w * -0.5,
      h: frame.h,
      w: frame.w
    };
  }

  // Create a couple of random new stars
  var num = Math.min(this.maxStars - this.currentStars, this.newStars);
  for (; num > 0; num -= 1) {
    this.stars[this.currentStars] = [
      this.spawnArea.l + (Rand.gen() % this.spawnArea.w) + this.twist[0],
      this.spawnArea.t + (Rand.gen() % this.spawnArea.h) + this.twist[1],
      C.endDepth
    ];
    this.currentStars++;
  }
};

Starfield.ride = function() {
  // Gradually tweek twist between origTwist and targetTwist
  if (this.twist[0] !== this.targetTwist[0] || this.twist[1] !== this.targetTwist[1]) {
    this.tweeker++;
    this.twist = [
      this.origTwist[0] + (this.targetTwist[0] - this.origTwist[0]) * this.tweeker / 32,
      this.origTwist[1] + (this.targetTwist[1] - this.origTwist[1]) * this.tweeker / 32
    ];
  }
  // When we finish tweeking, clean up
  else {
    this.origTwist = this.targetTwist;
    this.tweeker = 0;
  }

  var mid = [frame.w / 2 + this.twist[0], frame.h / 2 + this.twist[1]];
  c.fillStyle = 'rgb('+this.color[0]+','+this.color[1]+','+this.color[2]+')';
  for (var i = 0; i < this.currentStars; i++) {
    var star = this.stars[i];
    // Calculate the canvas coordinates for this star
    var x = (star[0] - this.twist[0]) * C.startDepth / star[2] + mid[0],
        y = (star[1] - this.twist[1]) * C.startDepth / star[2] + mid[1];
    // Check if the star went out of view
    if (x < 0 || x > frame.w || y < 0 || y > frame.h || star.z <= this.starSpeed) {
      // Pop the last star and insert it here
      this.currentStars -= 1;
      this.stars[i] = this.stars[this.currentStars];
      this.stars[this.currentStars] = null;
      // Make sure we reiterate over the position we just modified
      i -= 1;
    }
    // Otherwise, draw it
    else {
      // Interpolate opacity and size
      var factor;
      if (star.z < C.fogDepth) {
        factor = 1;
      }
      else {
        factor = Math.max(0, Math.min(1,
            1 - (star[2]-C.fogDepth) / (C.depth-C.fogDepth)));
      }
      c.globalAlpha = factor;
      // Draw
      c.fillRect(x, y, factor * 2, factor * 2);
      // Adjust z for movement
      star[2] -= this.starSpeed;
    }
  }
  c.globalAlpha = 1.0;
};

// Adjust the targetTwist based on the grid settings
Starfield.twistFromGrid = function() {
  // Calculate the scale the grid will use...
  var scale = Math.min(frame.w / grid.size[0], frame.h / grid.size[1]);
  // ...so we can get to the screen coordinates of the twist target
  this.targetTwist = [grid.twist[0] * scale, grid.twist[1] * scale];
};
