var

GameMachine = {
  enter_start: function() {
    this.grid = Grids.Circle16;
    Starfield.color = this.grid.color = [0,0,255];
    Engine.transition('flyInStars');
  },

  enter_flyInStars: function() {
    setTimeout(function() { Starfield.twistFromGrid(GameMachine.grid); }, 1000);
    setTimeout(function() { Engine.transition('flyInGrid'); }, 3000);
  },
  flyInStars: function() {
    Starfield.feed();
    Starfield.ride();
  },

  enter_flyInGrid: function() {
    this.grid.distance = C.flyInStart;
  },
  flyInGrid: function() {
    Starfield.ride();
    this.grid.draw();
    if (this.grid.distance <= 0) {
      this.grid.distance = 0;
      Engine.transition('main');
    }
    this.grid.distance -= C.flyInAdvance;
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
