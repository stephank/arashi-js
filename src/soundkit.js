// SoundKit looks for <audio> elements on the page. These elements should have only their 'src'
// and 'autobuffer' attributes set. Autobuffering is precisely why we predefine all samples.

// For each sample, a helper method is created in +Snd+, named after the file's basename.
// So for example, 'snd/blast.wav' can be played using 'Snd.blast()'.

// This construct is so we can have a local inner function
var Snd = (function() {
  var retval = {};

  // Let's see what kind of audio support we have.
  var dummyAudio = $('<audio></audio>')[0],
      extension = 'none';
  if (dummyAudio.canPlayType) {
    if (!window.arashi_devmode &&
        dummyAudio.canPlayType('audio/ogg; codecs="vorbis"') !== 'no') {
      extension = 'ogg';
    }
    else {
      extension = 'wav';
    }
  }

  // Inner function for preloading sounds.
  var cache = {};
  var load = function(name) {
    if (extension === 'none') {
      // Create a dummy and be done with it.
      retval[name] = function() {};
    }
    else {
      var src = 'snd/' + name + '.' + extension;
      // Preload the audio file
      cache[name] = new Audio(src);
      cache[name].load();
      // Create the helper function
      retval[name] = function() {
        // FIXME: this causes a new request for every sound effect in Chrome.
        // Works peachy in Firefox, though. How to prevent?
        var element = new Audio(src);
        element.play();
        return element;
      };
    }
  };

  load('blast');
  load('blow');
  load('bonk');
  load('dziuung');
  load('fadeinphazer');
  load('fadeoutphazer');
  load('fallyell');
  load('fallzap');
  load('flythru');
  load('phazer');
  load('splitter');
  load('springy');
  load('swish');
  load('swoosh');
  load('tadaum');
  load('whiz');
  load('zrooming');
  load('zzfreelife');
  load('zzsuperzap');

  return retval;
}());
