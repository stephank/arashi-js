var

TitleMachine = {
  enter_start: function() {
    Engine.transition('firstLightningStrike');
  },

  enter_firstLightningStrike: function() {
    Lightning.init();
    Engine.blank();
    Engine.pause(800);
  },
  firstLightningStrike: function() {
    if (Lightning.animate()) {
      Engine.transition('logo', 800);
    }
  },

  enter_logo: function() {
    ArashiLogo.init();
    Snd.blast();
    var width = frame.w * 3 / 4,
        scale = width / ArashiLogo.size[0],
        height = ArashiLogo.size[1] * scale;
    this.scale = scale;
    this.translation = [(frame.w - width) / 2, (frame.h - height) / 2];
  },
  logo: function() {
    c.save();
      c.translate(this.translation[0], this.translation[1]);
      c.scale(this.scale, this.scale);
      var done = ArashiLogo.animate();
    c.restore();
    if (done) {
      Engine.transition('secondLightningStrike', 3000);
    }
  },

  enter_secondLightningStrike: function() {
    Lightning.init();
    Engine.blank();
    Engine.pause(800);
  },
  secondLightningStrike: function() {
    if (Lightning.animate()) {
      Engine.transition('demo', 800);
    }
  },

  enter_demo: function() {
    Snd.blast();

    GameMachine.playbackMode = true;
    GameMachine.recording = null; // FIXME
    Engine.startMachine(GameMachine);
  }
};
