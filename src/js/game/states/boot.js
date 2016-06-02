var Stats = require('Stats')
  , properties = require('../properties')
  , boot = {};



boot.create = function () {

  if (properties.showStats) {
    addStats();
  }

  this.game.sound.mute = properties.mute;

  this.game.input.gamepad.start();

  this.game.customInputs.cursors = this.game.input.keyboard.createCursorKeys();
  this.game.customInputs.cursors.select = this.game.input.keyboard.addKey(13);
  this.game.customInputs.cursors.shoot = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
  this.game.customInputs.cursors.change = this.game.input.keyboard.addKey(Phaser.Keyboard.O);
  this.game.customInputs.cursors.torch = this.game.input.keyboard.addKey(Phaser.Keyboard.L);
  this.game.customInputs.cursors.shield = this.game.input.keyboard.addKey(Phaser.Keyboard.I);

  this.game.customInputs.wasd = {
    up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
    down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
    left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
    right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
    shoot: this.game.input.keyboard.addKey(Phaser.Keyboard.C),
    change: this.game.input.keyboard.addKey(Phaser.Keyboard.V),
    torch: this.game.input.keyboard.addKey(Phaser.Keyboard.Z),
    shield: this.game.input.keyboard.addKey(Phaser.Keyboard.B),
  };

  this.game.state.start('preloader');

};

function addStats() {
  var stats = new Stats();

  stats.setMode(0);

  stats.domElement.style.position = 'absolute';
  stats.domElement.style.right = '0px';
  stats.domElement.style.top = '0px';

  document.body.appendChild(stats.domElement);

  setInterval(function () {
    stats.begin();
    stats.end();
  }, 1000 / 60);
}

module.exports = boot;
