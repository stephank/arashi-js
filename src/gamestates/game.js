var

GameMachine = {
  enter_start: function() {
    grid = Grids.Circle16;
    Starfield.color = grid.color = [0,0,255];
    spikes.init();
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
    if (grid.distance <= C.flyInAdvance) {
      grid.setDistance(0);
      Engine.transition('main');
    }
    else {
      grid.setDistance(grid.distance - C.flyInAdvance);
    }

    Starfield.ride();
    c.save();
      grid.screenTranslation();
      grid.paint();
      spikes.paint();
    c.restore();
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
