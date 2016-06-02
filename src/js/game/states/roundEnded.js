var roundEnded = {
  canProceed: false



};



roundEnded.preload = function () {




};

roundEnded.create = function () {

  var winText = "Winner: " + this.game.lastRoundWinner;

  //this.infoText = this.game.add.bitmapText(this.game.width / 2 - 115, 165, "retroFont1", "Game ended", 16);
  this.winnerText = this.game.add.bitmapText(this.game.width / 2 - 115, 205, "retroFont1", winText, 20);
  this.pressText = this.game.add.bitmapText(this.game.width / 2 - 165, 265, "retroFont1", "Press (X) or Enter to continue", 10);

  setTimeout(function() {
    this.canProceed = true;
  }.bind(this), 2000);

};

roundEnded.update = function() {

  // Nothing to do here

}

roundEnded.inputIn = function(action) {

  console.log("INPUT IN MAP SELECTION");

    if (this.canProceed && action === 'select') {
      console.log("CHOICE ACCEPTS");
      this.game.mediatorLink.toRoundSelection();
    }  
}

module.exports = roundEnded;

