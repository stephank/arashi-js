Engine = {
  machine: null,
  state: null
};

Engine.start = function(initialMachine) {
  var canvas = $('#game')[0];

  // Globals
  frame = {
    w: canvas.getAttribute('width'),
    h: canvas.getAttribute('height'),
    mouseX: 0,
    mouseY: 0
  };
  c = canvas.getContext('2d');

  // Track mouse position
  $().mousemove(function(e) {
    frame.mouseX = e.pageX - canvas.offsetLeft;
    frame.mouseY = e.pageY - canvas.offsetTop;
  });

  // Allow a different starting machine in development
  if (!initialMachine) {
    initialMachine = TitleMachine;
  }

  // All systems, go!
  this.resume();
  this.startMachine(initialMachine);
};

// Start a game state machine
Engine.startMachine = function(machine) {
  this.machine = machine;
  this.transition('start');
};

// Transition to a different state in the current state machine.
// +delay+ is optional, and is a delay in milliseconds.
Engine.transition = function(state, delay) {
  if (delay) {
    this.state = null;
    this.pause(delay, function() {
      Engine.transition(state);
    });
  }
  else {
    this.state = this.machine[state];
    var enterMethod = this.machine['enter_' + state];
    if (enterMethod) { enterMethod.apply(this.machine); }
  }
};

// Pause the engine, duration is optional and in milliseconds.
Engine.pause = function(duration, callback) {
  if (this.frameTimer) {
    clearInterval(this.frameTimer);
    this.frameTimer = null;
  }
  if (duration) {
    if (this.pauseTimer) {
      clearTimeout(this.pauseTimer);
    }
    this.pauseTimer = setTimeout(function() {
      Engine.pauseTimer = null;
      Engine.resume();
      if (callback) { callback(); }
    }, duration);
  }
};

Engine.resume = function() {
  if (this.pauseTimer) {
    clearTimeout(this.pauseTimer);
    this.pauseTimer = null;
  }
  if (!this.frameTimer) {
    this.frameTimer = setInterval(function() {
      Engine.render();
    }, 50);
  }
};

// Blank the entire screen
Engine.blank = function() {
  c.fillStyle = 'black';
  c.fillRect(0, 0, frame.w, frame.h);
};

// Render a frame
Engine.render = function() {
  var s = new Date();

  // Clear
  this.blank();

  // Do the game magic
  if (this.machine && this.state) {
    this.state.apply(this.machine);
  }

  // Draw frame render time in ms
  if (window.arashi_devmode) {
    var d = new Date() - s;
    c.save();
      c.translate(0.5, 0.5); // Pixel align
      c.scale(3,3); c.translate(1,1);

      c.lineWidth = 0.3;
      c.strokeStyle = 'white';
      c.beginPath();
        Dig7Segment.drawNumber(d);
      c.stroke();
    c.restore();
  }
};
