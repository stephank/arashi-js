// This file is special. Because these global variables are referenced immediatly on execution of
// some other scripts, this should be one of the first source files included.

// A container for constants; predefined and precalculated stuff.
var C = {};

// The canvas drawing context. (See engine.js.)
var c = null;
// Some frame parameters. (See engine.js.)
var frame = null;

// The active grid;
var grid = null;

// Radians per degree, used in conversion.
C.radPerDeg = Math.PI / 180;

// Constants for Z-coordinates.
// When in normal play, the grid starts at 20 and goes down another 120.
C.startDepth = 20;
C.depth = 120;
C.endDepth = C.startDepth + C.depth;
C.fogDepth = C.startDepth * 2;
