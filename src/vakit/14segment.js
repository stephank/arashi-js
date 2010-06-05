// The original C code used bits to represent segments. Instead, we use numbers that corrospond
// with the indices used in the original code. The numbers represent the following line segments:
//  ---    3
// |\|/|   4  6  7  8  2
//  ---    5  9
// |/|\|  13 12 11 10  1
//  ---    0

// This construct is so we can have a local inner function
var Dig14Segment = (function () {
  // Build a fixed size boolean array from the indices given
  var n = function() {
    var r = [], i;
    for (i = 0; i < 14; i++) {
      r[i] = false;
    }
    for (i = 0; i < arguments.length; i++) {
      r[arguments[i]] = true;
    }
    return r;
  };

  return {
    characters: {
      '$': n(0,1,3,4,5,9,7,11),
      '(': n(8,10),
      ')': n(6,12),
      '+': n(5,7,9,11),
      ',': n(12),
      '-': n(5,9),
      '.': n(11),
      '/': n(12,8),
      '0': n(0,1,2,3,4,8,12,13),
      '1': n(7,11),
      '2': n(0,2,3,9,12),
      '3': n(0,1,2,3,9),
      '4': n(1,2,4,5,9),
      '5': n(3,6,9,1,0),
      '6': n(0,1,3,4,5,9,13),
      '7': n(12,8,3),
      '8': n(0,1,2,3,4,5,9,13),
      '9': n(0,1,2,3,4,5,9),
      '<': n(0,12),
      '=': n(0,5,9),
      '>': n(0,10),
      '?': n(2,3,4,9,11),
      '@': n(0,2,3,4,13,9,7),
      'A': n(1,2,3,4,5,9,13),
      'B': n(0,1,2,3,7,9,11),
      'C': n(0,3,4,13),
      'D': n(0,1,2,3,7,11),
      'E': n(0,3,4,5,9,13),
      'F': n(3,4,5,9,13),
      'G': n(0,1,3,4,9,13),
      'H': n(1,2,4,5,9,13),
      'I': n(0,3,7,11),
      'J': n(0,1,2,13),
      'K': n(4,13,5,8,10),
      'L': n(0,4,13),
      'M': n(1,2,4,13,6,8),
      'N': n(1,2,4,13,6,10),
      'O': n(0,1,2,3,4,13),
      'P': n(2,3,4,13,5,9),
      'Q': n(0,1,2,3,4,13,10),
      'R': n(2,3,4,13,5,9,10),
      'S': n(0,1,3,4,5,9),
      'T': n(3,11,7),
      'U': n(0,1,2,4,13),
      'V': n(4,13,12,8),
      'W': n(1,2,4,13,12,10),
      'X': n(12,8,6,10),
      'Y': n(6,8,11),
      'Z': n(0,3,8,12),
      '[': n(0,3,4,13),
     '\\': n(6,10),
      ']': n(0,1,2,3),
      '^': n(12,10),
      '_': n(0),
      'œ': n(3,6,8,12,10)
    }
  };
}());

// Draw subpaths for a single character
Dig14Segment.drawCharacter = function(character) {
  var segments = this.characters[character];
  if (segments === undefined) { return; }
  // There's probably a better way to draw this.
  if (segments[ 0]) { c.moveTo(0,4); c.lineTo(2,4); }
  if (segments[ 3]) { c.moveTo(0,0); c.lineTo(2,0); }
  c.moveTo(1,4);
  if (segments[11]) { c.lineTo(1,2); } else { c.moveTo(1,2); }
  if (segments[ 8]) { c.lineTo(2,0); } else { c.moveTo(2,0); }
  if (segments[ 2]) { c.lineTo(2,2); } else { c.moveTo(2,2); }
  if (segments[ 9]) { c.lineTo(1,2); } else { c.moveTo(1,2); }
  if (segments[10]) { c.lineTo(2,4); } else { c.moveTo(2,4); }
  if (segments[ 1]) { c.lineTo(2,2); }
  c.moveTo(1,0);
  if (segments[ 7]) { c.lineTo(1,2); } else { c.moveTo(1,2); }
  if (segments[12]) { c.lineTo(0,4); } else { c.moveTo(0,4); }
  if (segments[13]) { c.lineTo(0,2); } else { c.moveTo(0,2); }
  if (segments[ 5]) { c.lineTo(1,2); } else { c.moveTo(1,2); }
  if (segments[ 6]) { c.lineTo(0,0); } else { c.moveTo(0,0); }
  if (segments[ 4]) { c.lineTo(0,2); }
};

// Draw subpaths for a line of text
Dig14Segment.drawText = function(text) {
  c.save();
  for (var i = 0; i < text.length; i++) {
    this.drawCharacter(text[i]);
    c.translate(3,0);
  }
  c.restore();
};
