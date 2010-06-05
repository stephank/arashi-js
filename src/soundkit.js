// SoundKit looks for <audio> elements on the page. These elements should have only their 'src'
// and 'autobuffer' attributes set. Autobuffering is precisely why we predefine all samples.

// For each sample, a helper method is created in +Snd+, named after the file's basename.
// So for example, 'snd/blast.wav' can be played using 'Snd.blast()'.

var Snd = {};

Snd.init = function() {
  // Iterate all <audio> elements
  $('audio').each(function() {
    var src = this.getAttribute('src');
    // Filter by elements in the 'snd' directory
    if (src.substring(0, 4) !== "snd/") { return; }
    // Cut out the basename (strip directory and extension)
    var name = src.substring(4, src.length - 4);
    // Create the helper function
    Snd[name] = function() { return Snd.play(src); };
  });
};

Snd.play = function(src) {
  var element = new Audio(src);
  element.play();
  return element;
};
