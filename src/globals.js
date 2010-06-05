// This file is special. Because these global variables are referenced immediatly on execution of
// some other scripts, this should be one of the first source files included.

// Constants is just a container for predefined and precalculated stuff.
var Constants = {};
// A shorthand.
var C = Constants;

// The canvas drawing context. (See engine.js.)
var c = null;
// Some frame parameters. (See engine.js.)
var frame = null;


// Radians per degree, used in conversion.
Constants.radPerDeg = Math.PI / 180;

// Constants for Z-coordinates.
// When in normal play, the grid starts at 20 and goes down another 120.
Constants.startDepth = 20;
Constants.depth = 120;
Constants.endDepth = Constants.startDepth + Constants.depth;
Constants.fogDepth = Constants.startDepth * 2;
