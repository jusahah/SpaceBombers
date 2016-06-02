var sleepWithControls = {};

sleepWithControls.preload = function () {

};

sleepWithControls.create = function () {

  this.game.stage.backgroundColor = '#000';
  this.game.add.bitmapText(45, 10, "retroFont1", "CONTROLS:", 18);
  this.game.add.bitmapText(45, 80, "retroFont1", "Player 1", 12);
  this.game.add.bitmapText(45, 120, "retroFont1", "Move: arrow keys", 8);
  this.game.add.bitmapText(45, 140, "retroFont1", "Shoot: P", 8);
  this.game.add.bitmapText(45, 160, "retroFont1", "Weapon: O", 8);
  this.game.add.bitmapText(45, 180, "retroFont1", "Shield: I", 8);

  this.game.add.bitmapText(245, 80, "retroFont1", "Player 2", 12);
  this.game.add.bitmapText(245, 120, "retroFont1", "Move: WASD", 8);
  this.game.add.bitmapText(245, 140, "retroFont1", "Shoot: C", 8);
  this.game.add.bitmapText(245, 160, "retroFont1", "Weapon: V", 8);
  this.game.add.bitmapText(245, 180, "retroFont1", "Shield: B", 8);

  this.game.add.bitmapText(45, 230, "retroFont1", "Gamepads (Logitech, XBox):", 14);
  this.game.add.bitmapText(45, 280, "retroFont1", "Both players", 12);
  this.game.add.bitmapText(45, 320, "retroFont1", "Move: DPAD", 8);
  this.game.add.bitmapText(45, 340, "retroFont1", "Shoot: [A]", 8);
  this.game.add.bitmapText(45, 360, "retroFont1", "Weapon: [Y]", 8);
  this.game.add.bitmapText(45, 380, "retroFont1", "Shield: [B]", 8);

  //this.moveArrow(0);

};

module.exports = sleepWithControls;