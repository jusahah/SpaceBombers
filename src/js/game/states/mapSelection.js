var mapSelection = {

  levelList: null,
  currLevelIndex: 0,

  menuTabs: null


};

mapSelection.ensureOtherAreYellow = function() {

    for (var i = this.menuTabs.length - 1; i >= 0; i--) {
      if (i === this.currLevelIndex) continue;
      var f = 0xFF8422;
      this.menuTabs[i].tint = f;
    };
}


mapSelection.moveArrow = function(dir) {

  this.currLevelIndex += dir;

  if (this.currLevelIndex >= this.levelList.length) this.currLevelIndex = 0;
  else if (this.currLevelIndex < 0) this.currLevelIndex = this.levelList.length-1;

  var f = 0xffffff;
  this.menuTabs[this.currLevelIndex].tint = f;
  this.ensureOtherAreYellow();
}

mapSelection.choiceSelect = function() {
  console.log("CHOICE SELECTED");
  this.game.mediatorLink.mapSelected(this.currLevelIndex);
}

mapSelection.preload = function () {


};

mapSelection.create = function () {

  console.log("MAP SELECTION STATE");
  this.game.stage.backgroundColor = '#000';

  this.levelList = this.game.mediatorLink.getLevelList();
  this.currLevelIndex = 0;

  this.menuTabs = []; // Reset earlier menu visits
  for (var i = 0, j = this.levelList.length; i < j; i++) {
    this.menuTabs.push(this.game.add.bitmapText(this.game.width / 2 - 115, 85 + i * 20, "retroFont1", this.levelList[i].name, 14));
  };
  this.game.add.bitmapText(this.game.width / 2 - 115, 330, "retroFont1", "Menu Controls:", 10);
  this.game.add.bitmapText(this.game.width / 2 - 115, 350, "retroFont1", "Keyboard: [Up, Down, Enter]", 8);
  this.game.add.bitmapText(this.game.width / 2 - 115, 365, "retroFont1", "Gamepad: [Up, Down, X]", 8);
  this.game.add.bitmapText(this.game.width / 2 - 115, 380, "retroFont1", "(Press [A] on pad to activate it)", 8);
  this.moveArrow(0);

};

mapSelection.update = function() {

  // Nothing to do here

}

mapSelection.inputIn = function(action) {

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

module.exports = mapSelection;
