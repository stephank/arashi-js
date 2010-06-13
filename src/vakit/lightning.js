var Lightning = {};

// Precalculate our ray of lightning
Lightning.init = function() {
  // The original C code created arrays containing coordinates, and arrays containing
  // indices into this to represent line segments. Forking was implemented by having the
  // array of line segments contain the forks interleaved. This was pretty neat and
  // efficient.
  // But instead, I simply use nested arrays of coordinates here, favouring code clarity
  // over efficiency.

  // Forking probability at any segment is 1/x.
  // Start at 1/30, never drop below 1/15.
  var forkingProbability = 30,
      segmentsCount = 0;

  // This inner function takes a starting position, and goes from there.
  var build = function(start) {
    var segments = [start], i = 1;
    while (true) {
      // Fork?
      if (i > 3 && (Rand.gen() % forkingProbability) === 0) {
        i -= 1;
        var newStart = segments[i];
        segments[i] = [build(newStart), build(newStart)];
        break;
      }
      else {
        if (forkingProbability > 15) { forkingProbability -= 2; }
      }

      if (Rand.gen() % 2) {
        segments[i] = [
          segments[i-1][0] +  2 + (Rand.gen() % 30),
          segments[i-1][1] + 20 + (Rand.gen() % 10)
        ];
      }
      else {
        segments[i] = [
          segments[i-1][0] -  2 - (Rand.gen() % 30),
          segments[i-1][1] + 20 + (Rand.gen() % 10)
        ];
      }
      segmentsCount++;

      // Done?
      if (segments[i][1] > frame.h) { break; }

      i++;
    }
    return segments;
  };
  // Start at the top, halfway across
  this.segments = build([frame.w / 2, 0]);
  this.segmentsCount = segmentsCount;

  // Reset run-time parameters
  this.drawStart = 0;
  this.drawEnd = 10;
  this.drawSpeed = frame.h / 8 + 1;
  this.lightningHit = false;
  this.flashIntensity = 0;
};

// Quickly draw a portion or the entire ray of lightning
Lightning.draw = function(start, end) {
  if (start === undefined) { start = 0; }
  if (end === undefined) { end = frame.h; }

  var stack = [this.segments];
  while (stack.length !== 0) {
    var segments = stack.shift(), first = true;
    for (var i = 0; i < segments.length; i++) {
      var segment = segments[i];

      if (segment[1] > end) { break; }

      // Is it a fork? (Does it contain nested arrays?)
      if (segment[0].length !== undefined) {
        // Displace all fork points simultaneously
        var x = segment[0][0][0] + (Rand.gen() % 4),
            y = segment[0][0][1] + (Rand.gen() % 4);
        for (var j = 0; j < segment.length; j++) {
          segment[j][0][0] = x;
          segment[j][0][1] = y;
        }
        // Connect to the first element
        if (!first) { c.lineTo(x, y); }
        // Add the new arrays to the stack of paths to draw
        stack = stack.concat(segment);
        break;
      }

      if (segment[1] < start) { continue; }

      // Draw
      if (first) { c.moveTo(segment[0], segment[1]); }
      else { c.lineTo(segment[0], segment[1]); }
      first = false;

      // Displace
      // i === 0 is at the start or a fork, don't displace those here
      if (i !== 0) {
        segment[0] += Rand.gen() % 4;
        segment[1] += Rand.gen() % 4;
      }
    }
  }
};

// Returns true when the animation is finished.
Lightning.update = function() {
  if (this.flashIntensity <= 1 && this.drawStart >= frame.h) { return true; }
  this.flashIntensity = Math.round(this.flashIntensity * 2 / 3);

  if (!this.lightningHit) {
    if (this.drawEnd < frame.h) {
      this.drawEnd += this.drawSpeed;
    }
    else {
      this.flashIntensity = 255;
      this.lightningHit = true;
    }
  }
  else if (this.drawStart < frame.h) {
    this.drawStart += this.drawSpeed;
  }

  return false;
};

Lightning.paint = function() {
  var full = this.flashIntensity,
      half = Math.round(full / 2);
  c.fillStyle = 'rgb(' + half + ',' + half + ',' + full + ')';
  c.fillRect(0, 0, frame.w, frame.h);

  c.lineWidth = 3;
  c.strokeStyle = 'white';
  c.beginPath();
    this.draw(this.drawStart, this.drawEnd);
  c.stroke();
};

// Convenience function, because we always pair #update + #paint any way.
Lightning.animate = function() {
  if (this.update()) { return true; }
  this.paint();
  return false;
};
