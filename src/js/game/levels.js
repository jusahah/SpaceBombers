var testLevel = {
  name: 'Valley Of Death',
  map: 'map',
  tiles: 'ground_1x1',
  defaultBg: '#2d2d2d',
  starts: {
    ship: {
      x: 200,
      y: 400
    },
  ship2: {
      x: 350,
      y: 250
    }

  },
  crateLocations: [{
      xTile: 2,
      yTile: 46 
    },
    {
      xTile: 47,
      yTile: 8
    }
 
  ]

};
var testLevel2 = {
  name: 'Snake Pit',
  map: 'map2',
  tiles: 'map2_tiles',
  defaultBg: '#151515',
  starts: {
    ship: {
      x: 200,
      y: 400
    },
  ship2: {
      x: 350,
      y: 250
    }

  },
  crateLocations: [{
      xTile: 47,
      yTile: 42 
    },
    {
      xTile: 39,
      yTile: 42 
    },
    {
      xTile: 4,
      yTile: 47
    }
 
  ]
  
};
var testLevel3 = {
  name: 'Ice World',
  map: 'map3',
  tiles: 'map3_tiles',
  defaultBg: '#cfdada',
  starts: {
    ship: {
      x: 100,
      y: 500
    },
  ship2: {
      x: 650,
      y: 150
    }

  }
};
var testLevel4 = {
  name: 'Jaws',
  map: 'map4',
  tiles: 'map7_tiles',
  defaultBg: '#111',
  starts: {
    ship: {
      x: 315,
      y: 85
    },
  ship2: {
      x: 940,
      y: 85
    }

  },
  crateLocations: [{
      xTile: 54,
      yTile: 40 
    },
    {
      xTile: 54,
      yTile: 40 
    },

 
  ]
};
var testLevel5 = {
  name: 'Poison',
  map: 'map5',
  tiles: 'map5_tiles',
  defaultBg: '#151515',
  starts: {
    ship: {
      x: 100,
      y: 500
    },
  ship2: {
      x: 650,
      y: 150
    }

  }
};
var testLevel6 = {
  name: 'Snake Cave',
  map: 'map6',
  tiles: 'map2_tiles',
  defaultBg: '#151515',
  starts: {
    ship: {
      x: 50,
      y: 100
    },
  ship2: {
      x: 660,
      y: 140
    }

  },
  crateLocations: [
    {
      xTile: 55,
      yTile: 63 
    },
    {
      xTile: 16,
      yTile: 44
    },

 
  ]
};
var testLevel7 = {
  name: 'Poison Reloaded',
  map: 'map7',
  tiles: 'map5_tiles',
  defaultBg: '#2d2d2d',
  starts: {
    ship: {
      x: 100,
      y: 100
    },
  ship2: {
      x: 360,
      y: 90
    }

  },
  crateLocations: [
    {
      xTile: 3,
      yTile: 76 
    },
    {
      xTile: 6,
      yTile: 75 
    },
 
  ]
};
var testLevel8 = {
  name: 'Elevator',
  map: 'map8',
  tiles: 'map18_tiles',
  defaultBg: '#111',
  starts: {
    ship: {
      x: 40,
      y: 50
    },
  ship2: {
      x: 360,
      y: 50
    }

  },
  crateLocations: [
    {
      xTile: 3,
      yTile: 45 
    },
    {
      xTile: 10,
      yTile: 5 
    },
 
  ]
};
var testLevel9 = {
  name: 'Vatican',
  map: 'map9',
  tiles: 'map8_tiles',
  defaultBg: '#050410',
  starts: {
    ship: {
      x: 430,
      y: 245
    },
  ship2: {
      x: 530,
      y: 245
    }

  },
  crateLocations: [
    {
      xTile: 30,
      yTile: 58 
    },
    {
      xTile: 29,
      yTile: 58 
    },
 
  ]
};

var testLevel10 = {
  name: 'Pigeonhole',
  map: 'map10',
  tiles: 'map18_tiles',
  defaultBg: '#050410',
  starts: {
    ship: {
      x: 80,
      y: 120
    },
  ship2: {
      x: 230,
      y: 120
    }

  },
  crateLocations: [
    {
      xTile: 2,
      yTile: 5 
    },
    {
      xTile: 2,
      yTile: 5 
    },
 
  ]
};
var testLevel11 = {
  name: 'Bowling Alley',
  map: 'map11',
  tiles: 'map11_tiles',
  defaultBg: '#2d2d2d',
  starts: {
    ship: {
      x: 160,
      y: 30
    },
  ship2: {
      x: 640,
      y: 30
    }

  },
  crateLocations: [
    {
      xTile: 45,
      yTile: 47 
    },
    {
      xTile: 5,
      yTile: 47 
    },
 
  ]
};

var testLevel12 = {
  name: 'Torn',
  map: 'map12',
  tiles: 'map2_tiles',
  defaultBg: '#151515',
  starts: {
    ship: {
      x: 42,
      y: 240
    },
  ship2: {
      x: 440,
      y: 190
    }

  },
  crateLocations: [
    {
      xTile: 21,
      yTile: 57 
    },
    {
      xTile: 21,
      yTile: 57 
    },
 
  ]
};

function Levels(mast) {

  this.levels = [];
  this.currLevelIndex = 0;

  this.getLevelList = function() {

    return this.levels;
  }

  this.resetLevels = function() {
    this.currLevelIndex = 0;
  }

  this.setupLevel = function(level) {

    /* level = {
      'id': 2,
      'tileMap': 'level2',
      'tileSet': 'tiles',
      'playerStarts': {
        'p1': {x: 1, y: 1},
        'p2': {x: 4, y: 1}
      },
      ...

    }*/

    this.levels.push(level);
    

  }

  this.currentLevelInfo = function() {
    return this.levels[this.currLevelIndex];
  }

  // this.nextLevel should not be called without first checking if there are levels left
  this.hasMoreLevels = function() {

    return this.currLevelIndex < this.levels.length-1;
  }

  this.nextLevel = function() {
    ++this.currLevelIndex;
  }

  this.getLevel = function(index) {

    return this.levels[index];
  }
}


module.exports = {
  createSubSystem: function(mediator) {
    var o = new Levels(mediator);
    //mediator.setDep('levels', o);
    o.setupLevel(testLevel); // Example level setup
    o.setupLevel(testLevel2);
    o.setupLevel(testLevel4);
    o.setupLevel(testLevel6);
    o.setupLevel(testLevel7);
    o.setupLevel(testLevel8);
    o.setupLevel(testLevel9);
    o.setupLevel(testLevel10);
    o.setupLevel(testLevel11);
    o.setupLevel(testLevel12);
    return o;
  }
};