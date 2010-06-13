# Hacking the ArashiJS code

Well, hello there! It's so nice to have you visit here. Please, do continue reading.

## Directory structure

* `src` contains all the JavaScript source code.
* `snd` contains the WAV PCM conversions of the original sounds.
* `img` contains the SVG and PNG conversions of the original images. (unused)
* `util` contains some utilities used in conversion and by the `Makefile`.
* `dist` contains distributables created by `make`.

## Code structure

The game loop is found in `src/engine.js`. The engine basically keeps track of the game state, and
calls the related handler method each frame. These methods in turn live in the source files
underneath `src/gamestates/`.

All other files are basically utilities for getting things done:

* The `src/vakit/` directory contains drawing utilities (which stem from the `VAKit` library in the
original Project ARASHI).

* The `src/soundkit.js` library is a minimal abstraction for playing sound effects.

* The `src/random.js` library contains a pseudo-random number generator. The most significant
feature of this is that it is seedable. (This is necessary for playback of recordings.)

* The `src/grid.js` library contains the code for reading and drawing the level's grid, and
includes definitions for levels converted from the original.

## Build infrastructure

A `Makefile` is included, which fulfills some optional development tasks:

* `make lint` runs JSLint on all source files. Before each source file is processed, the file
`util/lint.head.js` is concatenated. This file contains the default JSLint options used throughout
the source code. You can override the environment variables RHINO and JSLINT if the defaults don't
work for your set-up.

* `make dist` creates the compressed JavaScript and CSS distributables under `dist/`. The file
`util/dist.head.js` is concatenated to the input of the compressor. You can override the
environment variables JAVA, YUICOMP, HTMLCOMP and OGGENC if the defaults don't work for your
set-up.

* `make clean` is your run-off-the-mill cleaning target for the above two.

## Testing

There is no fancy automated testing, but it is quite easy to test individual game components during
development.

A file `testing.template.html` is included, which is basically a commented start-up page. To use
it, make a copy of it called `testing.html`. The copy won't be tracked by version control, so you
may put together quick and dirty tests as you please.

The `testing.template.html` template also demonstrates how `Engine.start` can be supplied a
different 'entry-point' object. This technique can be used to test a single drawing or animation,
or perhaps simply to skip the intro and jump right into a specific level.

## Canvas pecularities

The HTML5 canvas has a fair amount of state variables. This is the place to document the
pecularities of how ArashiJS deals with these variables.

* All `draw*` methods only ever draw paths. Other methods (usually called `paint`) will do an
actual `stroke` or `fill` operation.

* Always reset `globalAlpha` to 1.0 when you're done using it.

* Always use stack methods (`save` and `restore`) and painting methods (`beginPath` and `stroke` or
`fill`) in a block or hierarchy fashion. There should be no partial overlaps in their scope.

* Indent the above like a block, too.

* Set the stroke or fill parameters *before* starting a path.
