var SizzlingLine = {};

SizzlingLine.draw = function(sx, sy, ex, ey, factor, level) {
  var dx = ex - sx, dy = ey - sy,
      sizzler = (Rand.gen() % 32) - 16,
      midx = sx + (dx / 2) + ((dy * sizzler) / factor),
      midy = sy + (dy / 2) - ((dx * sizzler) / factor);
  c.moveTo(sx, sy);
  c.lineTo(midx, midy);
  c.lineTo(ex, ey);
};
