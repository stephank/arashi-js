// This is a custom pseudo-random number generator.
// The biggest issue with Math.random is that it cannot be seeded. And we need to seed our PRNG,
// for example when playing back recordings.
// This code was borrowed from Wikipedia. It's a xorshift generator.

var Rand = {};

// This construct is so we can have private variables
(function () {

var x, y, z, w,
    maxSeed = Math.pow(2, 32) - 2;

// Takes an array of PRNG state: four numbers in the range 1 , (2^32 - 1)
Rand.reseed = function(seeds) {
  if (seeds !== undefined) {
    x = seeds[0];
    y = seeds[1];
    z = seeds[2];
    w = seeds[3];
  }
  else {
    x = Math.floor(Math.random() * maxSeed) + 1;
    y = Math.floor(Math.random() * maxSeed) + 1;
    z = Math.floor(Math.random() * maxSeed) + 1;
    w = Math.floor(Math.random() * maxSeed) + 1;
  }
};
// Initialize once immediatly
Rand.reseed();

// Returns current PRNG state
Rand.getSeed = function() {
  return [x, y, z, w];
};

// Generate a number
Rand.gen = function() {
  /*jslint bitwise: false */
  var t = x ^ ((x << 11) & 0xffffffff);
  x = y; y = z; z = w;
  w = (w ^ (w >> 19)) ^ (t ^ (t >> 8)); 
  return w;
};

}());
