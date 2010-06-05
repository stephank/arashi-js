// The original C code used bits to represent segments. Instead, we use numbers that corrospond
// with the indices used in the original code. The numbers represent the following line segments:
//     3
//    ---
// 4 |   | 2
//    ---    6
// 5 |   | 1
//    ---
//     0

// This construct is so we can have a local inner function
var Dig7Segment = (function () {
  // Build a fixed size boolean array from the indices given
  var n = function() {
    var r = [], i;
    for (i = 0; i < 8; i++) {
      r[i] = false;
    }
    for (i = 0; i < arguments.length; i++) {
      r[arguments[i]] = true;
    }
    return r;
  };

  return {
    digits: [
      n(0,1,2,3,4,5),   // 0
      n(1,2),           // 1
      n(0,2,3,5,6),     // 2
      n(0,1,2,3,6),     // 3
      n(1,2,4,6),       // 4
      n(0,1,3,4,6),     // 5
      n(0,1,3,4,5,6),   // 6
      n(1,2,3),         // 7
      n(0,1,2,3,4,5,6), // 8
      n(0,1,2,3,4,6)    // 9
    ]
  };
}());

// Draw subpaths for a single digit
Dig7Segment.drawDigit = function(digit) {
  var segments = this.digits[digit];
  if (segments === undefined) { return; }
  c.moveTo(2,2);
  if (segments[2]) { c.lineTo(2,0); } else { c.moveTo(2,0); }
  if (segments[3]) { c.lineTo(0,0); } else { c.moveTo(0,0); }
  if (segments[4]) { c.lineTo(0,2); } else { c.moveTo(0,2); }
  if (segments[5]) { c.lineTo(0,4); } else { c.moveTo(0,4); }
  if (segments[0]) { c.lineTo(2,4); } else { c.moveTo(2,4); }
  if (segments[1]) { c.lineTo(2,2); } else { c.moveTo(2,2); }
  if (segments[6]) { c.lineTo(0,2); }
};

// Draw subpaths for a number or line of digits
Dig7Segment.drawNumber = function(number) {
  var text = number.toString();
  c.save();
  for (var i = 0; i < text.length; i++) {
    this.drawDigit(parseInt(text[i], 10));
    c.translate(3,0);
  }
  c.restore();
};
