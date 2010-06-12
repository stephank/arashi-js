var

GameMachine = {
  enter_start: function() {
    grid = Grids.Circle16;
    Starfield.color = grid.color = [0,0,255];
    Engine.transition('flyInStars');
  },

  enter_flyInStars: function() {
    setTimeout(function() { Starfield.twistFromGrid(); }, 1000);
    setTimeout(function() { Engine.transition('flyInGrid'); }, 3000);
  },
  flyInStars: function() {
    Starfield.feed();
    Starfield.ride();
  },

  enter_flyInGrid: function() {
    grid.distance = C.flyInStart;
  },
  flyInGrid: function() {
    Starfield.ride();
    grid.draw();
    if (grid.distance <= 0) {
      grid.distance = 0;
      Engine.transition('main');
    }
    grid.distance -= C.flyInAdvance;
  },

  enter_main: function() {
    // FIXME
    Engine.pause();
  },
  main: function() {
  },

  enter_flyThru: function() {
    // FIXME
  },
  flyThru: function() {
  }
};
