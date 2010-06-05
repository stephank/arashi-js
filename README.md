# ArashiJS

ArashiJS is a (work-in-progress) Tempest-clone written in JavaScript and HTML5.

ArashiJS is adapted from Project ARASHI for the Apple Macintosh.
Project Arashi is available at: http://users.tkk.fi/jmunkki/cards/arashi.html

## Playing

The game is incomplete at the time of writing.

To launch, simply open `arashi.html` in a browser.

## License

No license disclaimer was attached to Project ARASHI. I'm considering the GNU GPL v2 a safe bet
while I contact the authors. A copy of the license is attached in the COPYING file.

## Directory structure

* `src` contains all the JavaScript source code.
* `snd` contains the WAV PCM conversions of the original sounds.
* `img` contains the SVG and PNG conversions of the original images.
* `util` contains some utilities used in conversion and by the `Makefile`.
* `dist` contains distributables created by `make`.

## Hacking

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

A `Makefile` is included, which fulfills some optional development tasks:

* `make lint` runs JSLint on all source files. Before each source file is processed, the file
`util/lint.head.js` is concatenated. This file contains the default JSLint options used throughout
the source code. You can override the environment variables RHINO and JSLINT if the defaults don't
work for your set-up.

* `make dist` creates the compressed JavaScript and CSS distributables under `dist/`. The file
`util/dist.head.js` is concatenated to the input of the compressor. You can override the
environment variables JAVA and YUICOMP if the defaults don't work for your set-up.

* `make clean` is your run-off-the-mill cleaning target for the above two.
