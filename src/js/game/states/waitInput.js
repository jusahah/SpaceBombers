var waitInput = {

  buttonTimers: {
    up: 0,
    down: 0,
    enter: 0
  }

};

waitInput.preload = function () {


};

waitInput.create = function () {


	

};

waitInput.handlePadInput = function(pad) {

  
/*
  if (pad.isDown(Phaser.Gamepad.XBOX360_A)) {
    ship.body.thrust(250);
  }
  */

  //console.log(pad.axis(2));

  if (pad.isDown(Phaser.Gamepad.XBOX360_X) && this.game.time.now > this.buttonTimers.enter) {
    //console.log("A PRESSED");
    this.game.mediatorLink.menuInputIn('select');
    this.buttonTimers.enter = this.game.time.now + 300;
  }

  if (pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) && this.game.time.now > this.buttonTimers.up) {
    //console.log("LEFT DPAD" + Math.random());
   //console.log("PAD UP PRESSED");
   this.game.mediatorLink.menuInputIn('up');
   this.buttonTimers.up = this.game.time.now + 300;

  } else if (pad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) && this.game.time.now > this.buttonTimers.down) {
    //console.log("RIGHT DPAD");
       //console.log("PAD DOWN PRESSED");
       this.game.mediatorLink.menuInputIn('down');
       this.buttonTimers.down = this.game.time.now + 300;

  } 
}

waitInput.handleKeyboardInput = function() {

    var cursors = this.game.customInputs.cursors;


    if (cursors.up.isDown && this.game.time.now > this.buttonTimers.up)
    {
      console.log("UP");
      this.buttonTimers.up = this.game.time.now + 300;
      this.game.mediatorLink.menuInputIn('up');

    } 

    else if (cursors.down.isDown && this.game.time.now > this.buttonTimers.down)
    {

      this.buttonTimers.down = this.game.time.now + 300;
      this.game.mediatorLink.menuInputIn('down');

    } 

    else if (cursors.select.isDown && this.game.time.now > this.buttonTimers.enter) {
      this.buttonTimers.enter = this.game.time.now + 300;
      this.game.mediatorLink.menuInputIn('select');     
    }

}

waitInput.update = function() {

    if (this.game.input.gamepad.active && this.game.input.gamepad.pad1.connected) this.handlePadInput(this.game.input.gamepad.pad1, 1);
    else this.handleKeyboardInput();


}

module.exports = waitInput;
