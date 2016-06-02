var sleep = {};

sleep.preload = function () {

};

sleep.create = function () {

  this.game.stage.backgroundColor = '#000';
  this.game.add.bitmapText(25, 80, "retroFont1", "Twitter: jussi_ha", 14);
  this.game.add.bitmapText(25, 110, "retroFont1", "For feedback, improvements, etc.", 8);
 
  this.game.add.bitmapText(25, 220, "retroFont1", "Notes:", 12);
  this.game.add.bitmapText(25, 250, "retroFont1", "- works on Chrome. FF too slow. IE no idea.", 8);
  this.game.add.bitmapText(25, 270, "retroFont1", "- views too small? Zoom in (Ctrl + mousewheel)", 8);
  this.game.add.bitmapText(25, 290, "retroFont1", "- no single-player mode, only split-screen", 8);
  this.game.add.bitmapText(25, 310, "retroFont1", "- refresh browser after connecting gamepads", 8);
  this.game.add.bitmapText(25, 330, "retroFont1", "- tested with Logitech F310 pads", 8);
  this.game.add.bitmapText(25, 350, "retroFont1", "- if pads not working, make sure your browser", 8);
  this.game.add.bitmapText(25, 370, "retroFont1", "  supports Gamepad API (google 'gamepad tester')", 8);
  //this.moveArrow(0);

};

module.exports = sleep;
