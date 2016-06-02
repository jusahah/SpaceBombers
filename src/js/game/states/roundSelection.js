var roundSelection = {

  currRoundIndex: 0,
  choices: [1,3,5,9,15],
  menuTexts: [],
  menuTabs: [],
  warningText: 0


};

roundSelection.ensureOtherAreYellow = function() {

    for (var i = this.menuTabs.length - 1; i >= 0; i--) {
      if (i === this.currRoundIndex) continue;
      var f = 0xFF8422;
      this.menuTabs[i].tint = f;
    };
}


roundSelection.moveArrow = function(dir) {

  this.currRoundIndex += dir;

  if (this.currRoundIndex >= this.choices.length) this.currRoundIndex = 0;
  else if (this.currRoundIndex < 0) this.currRoundIndex = this.choices.length-1;

  var f = 0xffffff;
  this.menuTabs[this.currRoundIndex].tint = f;
  this.ensureOtherAreYellow();
}

roundSelection.choiceSelect = function() {
  console.log("CHOICE SELECTED");
  this.warningText.kill();
  this.game.add.bitmapText(this.game.width / 2 - 115, 165, "retroFont1", "Starting game...", 16);
  this.game.mediatorLink.roundSelected(this.choices[this.currRoundIndex]);
}

roundSelection.preload = function () {




};

roundSelection.create = function () {


  this.game.stage.backgroundColor = '#000';
  this.warningText = this.game.add.bitmapText(this.game.width / 2 - 115, 165, "retroFont1", "Game optimized for Google Chrome!", 8);
  console.log("ROUND SELECTION STATE");
  this.menuTexts = [];
  for (var i = 0, l = this.choices.length; i < l; i++) {
    this.menuTexts[i] = "Best out of: " + this.choices[i];
  };

  this.currLevelIndex = 0;
  this.menuTabs = []; // Reset earlier menu visits
  for (var i = 0, j = this.menuTexts.length; i < j; i++) {
    this.menuTabs.push(this.game.add.bitmapText(this.game.width / 2 - 115, 265 + i * 25, "retroFont1", this.menuTexts[i], 16));
  };

  this.moveArrow(0);

};

roundSelection.update = function() {

  // Nothing to do here

}

roundSelection.inputIn = function(action) {

  console.log("INPUT IN MAP SELECTION");

    if (action === 'down') {
      //console.log(menuTabs);
      //console.log("UP IN failScreen");
      this.moveArrow(1);
      
    }   
    if (action === 'up') {
      //console.log("DOWN IN failScreen");
      this.moveArrow(-1);
      
    }
    if (action === 'select') {
      this.choiceSelect();
    }  
}

module.exports = roundSelection;

