// Helper fun
function checkOverlap(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    // Dirty hack to fix overlapping with non-rectangle object. We just make rectangle little smaller
    var narrowedA = new Phaser.Rectangle(boundsA.x+8, boundsA.y+8, boundsA.width-8, boundsA.height-8);

    return Phaser.Rectangle.intersects(narrowedA, boundsB);

}

var TORCH_MODES = [
  {rot: 0.4, sight: 240},
  {rot: 1.0, sight: 160},
  {rot: 0.15, sight: 360},
  {rot: 0, sight: 0}
]

var WEAPON_DATA = {
	'bullet': {
		gravity: 0,
		speed: 600,
		damage: 80,
		reload: 200
	},
	'bomb': {
		gravity: 300,
		speed: 90, // Original is sixty
		damage: 400, // Bomb damage currently calculated elsewhere
		reload: 2450 // Original 2250
	},
	'spinner': {
		gravity: 0,
		speed: 500,
		damage: 150,
		reload: 600
	}


}

var gamerun = {/*
	buttonTimers: {
		fireButton: 0,
		weaponButton: 0,
		changeButton: 0
	},
	buttonTimers2: {
		fireButton: 0,
		weaponButton: 0,
		changeButton: 0		
	},
	ammoGroups: {
		'bullets': null,
		'bombs': null,
		'spinBullets': null
	},
  	levelState: {
  		newAnims: [],
  		newTileDestructions: [],
  		livesAmount: 0,
  		livesLeft: {
  			p1: 0,
  			p2: 0
  		},
	    ship: null,
	    ship2: null,
	    starts: {
	      ship:  {x: 400, y: 200},
	      ship2: {x: 100, y: 300}
	    },

	    currentWeapons: {
	    	ship: 'bullet',
	    	ship2: 'bullet'
	    },
	    currentScore: {
	    	'p1': 0,
	    	'p2': 0
	    }

  	},
	levelMap: null,
	levelLayer: null,
	collisions: {
		players: null,
		bullets: null
	},
	controls: {
		currLeftTrigger: 0
	},
	tileCollisionMap: {},
	sounds: {}
	*/

	
};

/* Everything here thats not bound to game-object is private!*/

gamerun.initRun = function() {


	this.buttonTimers = {
		fireButton: 0,
		weaponButton: 0,
		changeButton: 0
	};
	this.buttonTimers2 = {
		fireButton: 0,
		weaponButton: 0,
		changeButton: 0		
	};
	this.ammoGroups = {
		'bullets': null,
		'bombs': null,
		'spinBullets': null
	};
  	this.levelState = {
  		newAnims: [],
  		newTileDestructions: [],
  		livesAmount: 0,
  		livesLeft: {
  			p1: 0,
  			p2: 0
  		},
	    ship: null,
	    ship2: null,
	    starts: {
	      ship:  {x: 400, y: 200},
	      ship2: {x: 100, y: 300}
	    },
	    padReservations: {
	    	pad1: null,
	    	pad2: null
	    },

	    currentWeapons: {
	    	ship: 'bullet',
	    	ship2: 'bullet'
	    },
	    currentScore: {
	    	'p1': 0,
	    	'p2': 0
	    }

  	};
  	this.crateLocations;
  	this.currLocationIndex;
  	this.secretCrate = null;
	this.levelMap = null;
	this.levelLayer = null;
	this.collisions = {
		players: null,
		bullets: null
	};
	this.spinTimeouts = {
		p1: null,
		p2: null
	};
	this.controls = {
		currLeftTrigger: 0
	};
	this.tileCollisionMap = {};
	this.sounds = {};

	
};



gamerun.create = function () {

  //this.game.physics.destroy();	

  this.initRun();
  var sessionData = this.game.sessionData;	



  //var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
  //var logo2 = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
  //logo2.scale = 0.1;
  //logo.anchor.setTo(0.5, 0.5

  //this.game.world.setBounds(0, 0, 1920, 1200);

  //Audio first
  // I guess technically these should be added to some other scope but not to state scope as they are needed through the
  // app lifecycle and never change.
  this.sounds.bombshoot   = this.game.add.audio('bombshoot');
  this.sounds.bulletshoot = this.game.add.audio('bulletshoot');
  this.sounds.explosion   = this.game.add.audio('explosion');
  this.sounds.song        = this.game.add.audio('deadmau5ftw');

  this.game.lockRender = true; // No point rendering here

  this.game.physics.startSystem(Phaser.Physics.P2JS);
	
  this.game.stage.backgroundColor = '#2d2d2d';
  this.levelMap = this.game.add.tilemap(sessionData.level.map);
  this.levelMap.addTilesetImage(sessionData.level.tiles);
  this.levelMap.addTilesetImage('walls_1x2');
  this.levelMap.addTilesetImage('tiles2');
  this.levelLayer = this.levelMap.createLayer('Tile Layer 1');
  this.levelLayer.resizeWorld();

  this.levelState.starts.ship = sessionData.level.starts.ship;
  this.levelState.starts.ship2 = sessionData.level.starts.ship2;

  this.levelState.livesAmount = (sessionData.bestOf - 1) / 2;
  this.levelState.livesLeft.p1 = this.levelState.livesAmount;
  this.levelState.livesLeft.p2 = this.levelState.livesAmount;

  this.levelMap.setCollisionBetween(5,13, true, this.levelLayer, false);
  //this.levelMap.setTileIndexCallback(11, this.shipHitFuel, this, this.levelLayer);

  var tiles = this.game.physics.p2.convertTilemap(this.levelMap, this.levelLayer);

  ////console.log(this.game);
  this.game.physics.p2.defaultRestitution = 0.7;
  this.game.physics.p2.gravity.y = 50;

  this.levelState.ship = this.game.add.sprite(this.levelState.starts.ship.x, this.levelState.starts.ship.y, 'ship');
  this.levelState.ship2 = this.game.add.sprite(this.levelState.starts.ship2.x, this.levelState.starts.ship2.y, 'ship');

  this.levelState.ship.anchor.x = 1;
  this.levelState.ship.anchor.y = 1;

  this.game.physics.p2.enable([this.levelState.ship], true);
  this.levelState.ship.body.clearShapes();
  this.levelState.ship.body.loadPolygon('shipPolygons', 'thrust_ship2');
  this.levelState.ship.mass = 1.2;

  this.game.physics.p2.enable([this.levelState.ship2], true);
  this.levelState.ship2.body.clearShapes();
  this.levelState.ship2.body.loadPolygon('shipPolygons', 'thrust_ship2');
  this.levelState.ship2.mass = 1.2;  
  //this.levelState.ship.bounce = {x: 0.8, y: 10};
  //this.levelState.ship.drag = {x: 120, y: 80};

  this.levelState.ship.body.isShip = true;
  this.levelState.ship2.body.isShip = true;

  this.levelState.ship.belongsTo = 'p1';
  this.levelState.ship2.belongsTo = 'p2';

  this.levelState.newAnims = [];
  this.levelState.newTileDestructions = []; // Not used currently but reset it anyway

  this.crateLocations = sessionData.level.crateLocations;

  if (!this.crateLocations) {
  	this.secretCrate = {alive: false};
  } else {
  	this.currLocationIndex = 0;
  	this.secretCrate = this.game.add.sprite(this.crateLocations[this.currLocationIndex].xTile*16, this.crateLocations[this.currLocationIndex].yTile*16, 'crate');

  }
  
  
  //SpinBullets
  this.ammoGroups.spinBullets = this.game.add.group();
  this.ammoGroups.spinBullets.enableBody = true;
  this.ammoGroups.spinBullets.physicsBodyType = Phaser.Physics.P2JS;
  this.ammoGroups.spinBullets.createMultiple(20, 'spinBullet');
  this.ammoGroups.spinBullets.setAll('anchor.x', 0.5);
  this.ammoGroups.spinBullets.setAll('anchor.y', 0.5);
  this.ammoGroups.spinBullets.setAll('outOfBoundsKill', true);
  //this.ammoGroups.spinBullets.setAll('checkWorldBounds', true);

  // Bullets
  this.ammoGroups.bullets = this.game.add.group();
  this.ammoGroups.bullets.enableBody = true;
  this.ammoGroups.bullets.physicsBodyType = Phaser.Physics.P2JS;
  this.ammoGroups.bullets.createMultiple(50, 'bullet');
  this.ammoGroups.bullets.setAll('anchor.x', 0.5);
  this.ammoGroups.bullets.setAll('anchor.y', 0.5);
  this.ammoGroups.bullets.setAll('outOfBoundsKill', true);
  //this.ammoGroups.bullets.setAll('checkWorldBounds', true); 
  //this.ammoGroups.bullets.setAll('gravity', {x: 0, y: 0});

  this.ammoGroups.bombs = this.game.add.group();
  this.ammoGroups.bombs.enableBody = true;
  this.ammoGroups.bombs.physicsBodyType = Phaser.Physics.P2JS;
  this.ammoGroups.bombs.createMultiple(6, 'bomb');
  this.ammoGroups.bombs.setAll('anchor.x', 0.5);
  this.ammoGroups.bombs.setAll('anchor.y', 0.5);
  this.ammoGroups.bombs.setAll('outOfBoundsKill', true);
  //this.ammoGroups.bombs.setAll('checkWorldBounds', true);

  this.collisions.player1 = this.game.physics.p2.createCollisionGroup();
  this.collisions.player2 = this.game.physics.p2.createCollisionGroup();
  this.collisions.spinBullets = this.game.physics.p2.createCollisionGroup();
  this.collisions.bullets = this.game.physics.p2.createCollisionGroup();
  this.collisions.tiles   = this.game.physics.p2.createCollisionGroup();


  ////console.log(tiles);

  for (var i = 0; i < tiles.length; i++) {
      var tileBody = tiles[i];
      // We need to have fast access to individual tilebody from outside so lets create simple hashmap of them
      //this.tileCollisionMap[tileBody.x + "_" + tileBody.y] = tileBody;
      var tile =  this.levelMap.getTile(this.levelLayer.getTileX(Math.round(tileBody.x)),this.levelLayer.getTileY(Math.round(tileBody.y)));
      tileBody.tileIndex = tile.index;
      tileBody.setCollisionGroup(this.collisions.tiles);
      tileBody.collides([this.collisions.player1, this.collisions.player2, this.collisions.bullets, this.collisions.spinBullets]);
      if (tile.index !== 11) {
      	tileBody.onBeginContact.add(this.contactToTerrain.bind(this));
      } else {
      	tileBody.onBeginContact.add(this.contactToFuel.bind(this));
      }
      
  }


  this.levelState.ship.body.setCollisionGroup(this.collisions.player1);
  this.levelState.ship2.body.setCollisionGroup(this.collisions.player2);

  this.levelState.ship.body.collides([this.collisions.spinBullets], this.spinBulletHitShip, this);
  this.levelState.ship2.body.collides([this.collisions.spinBullets], this.spinBulletHitShip, this);
  this.levelState.ship.body.collides([this.collisions.bullets], this.bulletHitShip, this);
  this.levelState.ship.body.collides([this.collisions.tiles], this.shipHitWall, this);
  this.levelState.ship2.body.collides([this.collisions.bullets], this.bulletHitShip, this);
  this.levelState.ship2.body.collides([this.collisions.tiles], this.shipHitWall, this); 

  this.levelState.ship.body.collides([this.collisions.player2], this.shipHitShip, this);
  this.levelState.ship2.body.collides([this.collisions.player1], this.shipHitShip, this);

  this.levelState.ship.body.linkBack = this.levelState.ship;
  this.levelState.ship2.body.linkBack = this.levelState.ship2;

  this.levelState.ship.torchMode = 0;
  this.levelState.ship2.torchMode = 0;

  this.levelState.ship.fuel = 1600;
  this.levelState.ship2.fuel = 1600;

  this.ammoGroups.spinBullets.forEach(function(bullet) {
  	bullet.body.setCollisionGroup(this.collisions.spinBullets);
  	bullet.body.collides([this.collisions.tiles], this.bulletHitTile, this);
  	bullet.body.collides([this.collisions.player1, this.collisions.player2], this.spinBulletHitShip, this);
  	bullet.body.linkBack = bullet;
  }.bind(this));

  this.ammoGroups.bullets.forEach(function(bullet) {
  	bullet.body.setCollisionGroup(this.collisions.bullets);
  	bullet.body.collides([this.collisions.tiles], this.bulletHitTile, this);
  	bullet.body.collides([this.collisions.player1, this.collisions.player2], this.bulletHitShip, this);
  	bullet.body.linkBack = bullet;
  }.bind(this));

  this.ammoGroups.bombs.forEach(function(bomb) {
  	bomb.body.setCollisionGroup(this.collisions.bullets);
  	bomb.body.collides([this.collisions.tiles], this.bombHitTile, this);
  	bomb.body.collides([this.collisions.player1, this.collisions.player2], this.bombHitShip, this);
  	bomb.body.linkBack = bomb;
  }.bind(this));

  //this.levelState.ship.body.createGroupCallback(this.ammoGroups.bullets, this.bulletHitShip, this);
  this.game.physics.p2.setImpactEvents(true);
  

    // Test input keys
  //this.game.customInputs.cursors = this.game.input.keyboard.createCursorKeys();
  //this.game.customInputs.testFire = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  //this.game.customInputs.weaponButton = this.game.input.keyboard.addKey(Phaser.Keyboard.R);

  this.initShips();
  this.checkControls();

 // Inform mediator gamerun state creation is completed
 setTimeout(function() {
 	this.game.mediatorLink.logicReadyToGo();
 	// Deadmau5 starts here
 	//this.sounds.song.loopFull(0.7);
 }.bind(this),1000);

}

gamerun.checkControls = function() {




}

gamerun.initShips = function() {

	this.levelState.ship.hp = 1550;
	this.levelState.ship2.hp = 1550;

	this.levelState.ship.spinMode = false;
	this.levelState.ship2.spinMode = false;

	// No need to send weapon name in, function inits it right automatically
	this.changeWeapon(this.levelState.ship, true);
	this.changeWeapon(this.levelState.ship2, true);

	this.levelState.ship.extra = 0;
	this.levelState.ship2.extra = 0;

	this.levelState.ship.shield = 100;
	this.levelState.ship2.shield = 100;
}

gamerun.launchDistanceFromEnemy = function(ship, launchPad) {

	return Math.sqrt(Math.pow(ship.body.x - launchPad.x, 2) + Math.pow(ship.body.y - launchPad.y, 2));


}

gamerun.reserveLaunchCoordsForShip = function(ship) {

	////console.log("GETTING LAUNCH COORDS");
	////console.log(ship);

  /* Later we should do total refactor so that we can do something like:*/
  // return this.levelState.ships[this.game.belongsTo];

  // Ships collectively have two launch pads.
  // Every time player dies, he spawns into pad that is farther away from enemy.

  if (this.levelState.padReservations.pad1) return this.levelState.starts.ship2;
  if (this.levelState.padReservations.pad2) return this.levelState.starts.ship;

  var enemyShip = (ship.belongsTo === 'p1') ? this.levelState.ship2 : this.levelState.ship;
 
  var distTo1 = this.launchDistanceFromEnemy(enemyShip, this.levelState.starts.ship);
  var distTo2 = this.launchDistanceFromEnemy(enemyShip, this.levelState.starts.ship2);

  if (distTo1 < distTo2) {
  	this.levelState.padReservations.pad2 = ship;
  	return this.levelState.starts.ship2
  } else {
   	this.levelState.padReservations.pad1 = ship;
  	return this.levelState.starts.ship; 	
  }

  
/*
  if (ship.belongsTo === 'p1') return this.levelState.starts.ship;
  else if (ship.belongsTo === 'p2') return this.levelState.starts.ship2;
  */

}

gamerun.rebornShip = function() {


}

gamerun.shipHitFuel = function(ship, fuel) {

	//alert("FUEL HIT");
	//console.log("SHIP HIT THE FUEL");
	//console.log(ship);
	//console.log(fuel);
}

gamerun.nextTorchMode = function(ship) {

	if (this.game.time.now > this.buttonTimers.changeButton + 400) {
		var currMode = ship.torchMode;
		++currMode;

		if (currMode >= TORCH_MODES.length) currMode = 0;
		ship.torchMode = currMode;
		this.buttonTimers.changeButton = this.game.time.now;
	}


}

gamerun.revivePlayerToLaunchPad = function(ship) {

	//var launchCoords = this.getLaunchCoordsForShip(ship);
	//ship.latestRevivePad = launchCoords;
	////console.log("COORDS FOR LAUNCH PAD");
	////console.log(launchCoords);
	////console.log(ship.belongsTo);

	// Player ship's launch pad was already decided earlier

	ship.revive();
	ship.body.x = ship.latestRevivePad.x;
	ship.body.y = ship.latestRevivePad.y;
	ship.body.rotation = 0;
	ship.body.setZeroRotation();
	ship.body.setZeroVelocity();
	ship.body.setZeroForce();
	ship.hp = 1550;
	ship.fuel = 1600;
	ship.shield = 100;
	ship.lightsOut = false;

	// Clear out pad reservation
	if (this.levelState.padReservations.pad1 === ship) this.levelState.padReservations.pad1 = null;
	else if (this.levelState.padReservations.pad2 === ship) this.levelState.padReservations.pad2 = null;
}

gamerun.shipHitShip = function(ship1, ship2) {

	////console.log("SHIP HIT SIHP");
	//alert("SHIPS COLLIDED");
}

gamerun.contactToFuel = function(body) {

	if (body.isShip) {
		body.linkBack.fuel = 1600;
	}
}

gamerun.contactToTerrain = function(body, shape1, shape2, equation) {

	////console.log("IMPACT FORCE ON Y: " + body.velocity.y);
	////console.log(shape1);

	if (body.isShip && (Math.abs(body.velocity.y) > 75 || Math.abs(body.velocity.x) > 75)) {
		// Perhaps also check rotation if ship is landing!
		//alert("DEAD");
		var damage = Math.sqrt(Math.abs(body.velocity.x)) + Math.sqrt(Math.abs(body.velocity.y));
		body.linkBack.hp -= damage;

		this.checkIfShipDead(body.linkBack);
	}


}

gamerun.getTileByXY = function(x, y) {

	//console.log("TILE IN: " + x + ", " + y);
	//console.log(this.game.width + " | " + this.game.height);
	//console.log("SHOULD BE: TILEX: " + (Math.floor(x / 16)) + ", " + (Math.floor(y / 16)));

	var tile = this.levelMap.getTile(this.levelLayer.getTileX(x), this.levelLayer.getTileY(y));
	if (tile) {
		//console.log("TILEX: " + tile.x + " | TILEY: " + tile.y);
		//console.log("TILE INDEX: " + tile.index);
	}
	else //console.log("NO TILE");
	return tile;

}

gamerun.destructTile = function(tile) {

	var tileBody = this.tileCollisionMap[tile.x + "_" + tile.y];
	if (tileBody) {
		//console.log("BODY FOUND");
		//console.log(tileBody);
		tileBody.clearCollision(true, true);
		//console.log(tileBody);
	}
	this.levelState.newTileDestructions.push({x: tile.x, y: tile.y});

}

gamerun.bombHitTile = function(bomb, tile) {
	////console.log("TILE HIT BY BOMB");
	////console.log(tile.x + ", " + tile.y);
	//var tile = this.getTileByXY(Math.round(tile.x), Math.round(tile.y));
	// if (tile) this.destructTile(tile);
	if (bomb.linkBack.terrainBomb) {
		bomb.linkBack.kill();
		this.levelState.newAnims.push({tag: 'bomb', x: bomb.x, y: bomb.y});	
	}

}

gamerun.bombHitShip = function(bomb, ship) {
	////console.log("HIT BY BOMB");
	////console.log(bomb.linkBack.shooter + "vs. " + ship.linkBack.belongsTo);
	if (bomb.linkBack.shooter === ship.linkBack.belongsTo || ship.linkBack.shieldOn) return
	//ship.linkBack.kill();
	this.levelState.newAnims.push({tag: 'bomb', x: bomb.x, y: bomb.y});	
	this.processBombEffectArea(bomb.linkBack, ship.linkBack);
	bomb.reset(0,0);
	bomb.linkBack.kill();
	//this.damageShip(ship.linkBack, bomb.linkBack);

		
}

gamerun.processBombEffectArea = function(bomb, hitShip) {

	var distTo1 = Math.sqrt(Math.pow(Math.abs(bomb.x - this.levelState.ship.position.x),2) + Math.pow(Math.abs(bomb.y - this.levelState.ship.position.y),2));
	var distTo2 = Math.sqrt(Math.pow(Math.abs(bomb.x - this.levelState.ship2.position.x),2) + Math.pow(Math.abs(bomb.y - this.levelState.ship2.position.y),2));
	//console.log("DISTANCES: " + distTo1 + " | " + distTo2);
	// Effect reaches radius of 80.
	
	

	

	if (distTo1 < 60 && !this.levelState.ship.shieldOn) {
		var effect1 = Math.pow(60 - distTo1, 2);

		if (effect1 > 1200) effect1 = 1200;
		//console.log("DAMAGE1: " + effect1);
		this.damageShip(this.levelState.ship, null, effect1);
	}

	if (distTo2 < 60 && !this.levelState.ship2.shieldOn) {
		var effect2 = Math.pow(60 - distTo2, 2);
		if (effect2 > 1200) effect2 = 1200;
		//console.log("DAMAGE2: " + effect2);
		this.damageShip(this.levelState.ship2, null, effect2);
	}

}

gamerun.bulletHitTile = function(bullet, tile) {

	//alert("BULLET HIT TILE");

	//////console.log(bullet);
	/*
	var linkBack = bullet.linkBack;
	bullet.destroy(); // Kill physics part
	linkBack.kill(); // Kill sprite too
	*/
	this.levelState.newAnims.push({tag: 'bullet', x: bullet.x, y: bullet.y});	
	bullet.linkBack.kill();
	//////console.log("HIT TILE");
	//////console.log(this.ammoGroups.bullets);



}

gamerun.shipHitWall = function(ship, wallTile) {

	////console.log("HIT WALL");
	////console.log(this.game.world);

	// If speed too large, explode

}

gamerun.endRound = function() {

	var winner = 'none';

	if (this.levelState.livesLeft.p1 < 0) winner = 'p2';
	else if (this.levelState.livesLeft.p2 < 0) winner = 'p1';
	this.game.mediatorLink.endThisRound(winner);
}

gamerun.getAnotherPlayerName = function(playerName) {

	if (playerName === 'p1') return 'p2';
	else if (playerName === 'p2') return 'p1';
	//console.log("UNKNOWN PLAYER NAME: " + playerName);
	return false;
}

gamerun.checkIfShipDead = function(shipSprite) {



	if (shipSprite.hp > 0 || !shipSprite.alive) return;
	//console.log("DEAD!");
	//console.log(shipSprite.belongsTo);
	this.levelState.livesLeft[shipSprite.belongsTo]--;


	if (this.levelState.livesLeft[shipSprite.belongsTo] < 0) {
		return this.endRound();
	}

	this.game.mediatorLink.changeInScore({p1: this.levelState.livesAmount - this.levelState.livesLeft.p2, p2: this.levelState.livesAmount - this.levelState.livesLeft.p1});
	shipSprite.spinMode = false;
	shipSprite.extra = 0;

	if (shipSprite.shielInterval) {
		shipSprite.shieldOn = false;
		clearInterval(shipSprite.shielInterval);
		shipSprite.shielInterval = null;
	}
	shipSprite.kill();

	// Calculate next revive pad so render can start moving camera right away
	var launchCoords = this.reserveLaunchCoordsForShip(shipSprite);
	shipSprite.latestRevivePad = launchCoords;
	////console.log("CONTACT TO TERRAIN FOR PLAYER: " + shipSprite.belongsTo);
	this.game.mediatorLink.playerDied(shipSprite.belongsTo);
	this.sounds.explosion.play();
	setTimeout(function() {
		shipSprite.lightsOut = true;
	},500);
	setTimeout(function() {
		this.revivePlayerToLaunchPad(shipSprite);
	}.bind(this), 1500);
}

gamerun.damageShip = function(shipSprite, ammoSprite, customDamage) {

	////console.log(ammoSprite);

	if (customDamage) {
		shipSprite.hp -= customDamage;
	} else {
		shipSprite.hp -= WEAPON_DATA[ammoSprite.weapon].damage;
	}

	this.checkIfShipDead(shipSprite);
	////console.log("----------HP LEFT: " + shipSprite.hp + "------------------");


}

gamerun.spinBulletHitShip = function(bullet, ship) {

	//alert("j");

	if (bullet.linkBack.shooter === ship.linkBack.belongsTo) return

	this.goSpinMode(ship.linkBack, bullet.linkBack);
	bullet.linkBack.kill();	

}

gamerun.goSpinMode = function(shipSprite, bulletSprite) {

	shipSprite.spinMode = true;
	var belongs = shipSprite.belongsTo;
	if (this.spinTimeouts[belongs]) clearTimeout(this.spinTimeouts[belongs]);

	this.spinTimeouts[belongs] = setTimeout(function() {
		shipSprite.spinMode = false;
	}, 2500);
}

gamerun.bulletHitShip = function(bullet, ship) {



	////console.log("HIT BY BULLET");
	////console.log(bullet);
	if (bullet.linkBack.shooter === ship.linkBack.belongsTo || ship.linkBack.shieldOn) return
	bullet.linkBack.kill();	

	if (!ship.linkBack.shieldOn) this.damageShip(ship.linkBack, bullet.linkBack);
	//ship.linkBack.kill();
	
	/*
	setTimeout(function() {
		this.revivePlayerToLaunchPad(ship.linkBack);
	}.bind(this), 2000);
	*/
}

gamerun.handleKeyboardInput = function() {

	var cursors = this.game.customInputs.cursors;
	var ship = this.levelState.ship;

	if (ship.spinMode) {
    	ship.body.thrust(250);	
    	// Player has no control
    	return;	
	}

    if (cursors.left.isDown)
    {
		ship.body.rotateLeft(100);
    }
    else if (cursors.right.isDown)
    {
		ship.body.rotateRight(100);
    }
    else
    {
		ship.body.setZeroRotation();
    }

    if (cursors.up.isDown && ship.fuel > 0)
    {
    	ship.body.thrust(200);
    	ship.thrustOn = true;
    } else {
    	ship.thrustOn = false;
    }

    if (cursors.down.isDown)
    {

        ship.body.reverse(100);
        ship.reverseOn = true;
    } else {
    	ship.reverseOn = false;
    }

    if (cursors.shoot.isDown) {
    	////console.log(WEAPON_DATA[this.levelState.currentWeapons.ship]);
    	if (this.game.time.now > this.buttonTimers.fireButton + WEAPON_DATA[ship.currentWeapon].reload) {
    		this.fireBullet(ship);
    		this.buttonTimers.fireButton = this.game.time.now;
    	}

    }

    if (cursors.change.isDown) {
    	if (this.game.time.now > this.buttonTimers.changeButton + 400) {
    		this.changeWeapon(ship);
    		this.buttonTimers.changeButton = this.game.time.now;
    	}
    }
    if (cursors.torch.isDown) {
    	this.nextTorchMode(ship);
    }  

    if (cursors.shield.isDown) {
    	this.activateShield(ship);
    }  
}

gamerun.handlePadInput = function(pad, playerNum) {

	var ship = playerNum === 1 ? this.levelState.ship : this.levelState.ship2;
	var dx = 0;
	var dy = 0;
	var thrust = 0;
	var reverse = 0;

	if (ship.spinMode) {
    	ship.body.thrust(250);	
    	// Player has no control
    	return;	
	}
	
/*
	if (pad.isDown(Phaser.Gamepad.XBOX360_A)) {
		ship.body.thrust(250);
	}
	*/

	////console.log(pad.axis(2));

	if (pad.isDown(5))
    {
    	////console.log("THRUSTING||||||||||<<<<<");
       thrust = 200;
    }

	else if (pad.isDown(4))
    {
    	////console.log("THRUSTING||||||||||<<<<<");
       	reverse = 100;
    } 

    if (thrust !== 0 && ship.fuel > 0) {
    	ship.body.thrust(thrust);
    	ship.thrustOn = true;
    }
    else {
    	ship.thrustOn = false;
    	if (reverse !== 0) {
    		ship.body.reverse(reverse);
    		ship.reverseOn = true;
    	} else {
    		ship.reverseOn = false;
    	}
    }   
/*
	if (pad.axis(2) > -0.9) {
		thrust = pad.axis(2) * 100 + 200;
	}
*/
	if (pad.justPressed(Phaser.Gamepad.XBOX360_B, 100)) {
	    this.activateShield(ship);   
	}

	if (pad.justPressed(Phaser.Gamepad.XBOX360_A, 100)) {
		if (playerNum === 1) {
			if (this.game.time.now > this.buttonTimers.fireButton + WEAPON_DATA[ship.currentWeapon].reload) {
				this.fireBullet(ship);
				this.buttonTimers.fireButton = this.game.time.now;
			}			
		} else {
			if (this.game.time.now > this.buttonTimers2.fireButton + WEAPON_DATA[ship.currentWeapon].reload) {
				this.fireBullet(ship);
				this.buttonTimers2.fireButton = this.game.time.now;
			}				
		}

	}

	if (pad.justPressed(Phaser.Gamepad.XBOX360_Y, 100)) {
		if (playerNum === 1) {
			if (this.game.time.now > this.buttonTimers.changeButton + 400) {
				this.changeWeapon(ship);
				this.buttonTimers.changeButton = this.game.time.now;
			}
		} else {
			if (this.game.time.now > this.buttonTimers2.changeButton + 400) {
				this.changeWeapon(ship);
				this.buttonTimers2.changeButton = this.game.time.now;
			}			
		}
	}

	if (pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT)) {
		//alert("LEFT DPAD");
		////console.log("LEFT DPAD" + Math.random());
		return ship.body.rotateLeft(100);

	} else if (pad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT)) {
		////console.log("RIGHT DPAD");
		return ship.body.rotateRight(100);
	} else {
		ship.body.setZeroRotation();
	}
/*
	if (pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP)) {

		dy = -1;

	} else if (pad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN)) {
		dy = 1;
	}

*/
    if (pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1)
    {
       ////console.log("RIGHT " + playerNum);
       dx = pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
    }
    else if (pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1)
    {
       ////console.log("LEFT " + playerNum);
       dx = pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
    }

    if (pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1)
    {
       ////console.log("UP " + playerNum);
       dy = pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);
    }
    else if (pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1)
    {
       ////console.log("DOWN " + playerNum);
       //////console.log(pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y));
       dy = pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);
    }


    if (!dy && !dx) {
    	//ship.body.setZeroRotation();
    	//ship.body.angularVelocity = 0;
    	
    } else {

	    var rad = Math.atan2(dy, dx);
	    var shipRad = ship.body.rotation;
	    var mod = Math.PI * 2;
	    ////console.log(rad);

	    var deltaRad = ship.body.rotation - rad - Math.PI/2;
	    deltaRad = deltaRad % mod;

	    if (deltaRad != deltaRad % (mod/2) ) { 
		    deltaRad = (deltaRad < 0) ? deltaRad + mod : deltaRad - mod;
		  }
	/*
	    if (shipRad >= 0 && rad >= shipRad) {
	    	ship.body.rotateRight(100*(rad-shipRad));
	    }
	    else if (shipRad <= 0 && rad <= shipRad) {
	    	ship.body.rotateLeft(100*(shipRad-rad));
	    }
	    else if (shipRad >= 0 && rad <= shipRad) {
	    	ship.body.rotateLeft(100*(shipRad-rad));
	    }
	    else if (shipRad <= 0 && rad >= shipRad) {
	    	ship.body.rotateRight(100*(rad-shipRad));
	    }*/

	    ship.body.rotateLeft(100*deltaRad);

    }


    






}

gamerun.handleKeyboard2Input = function() {

	var wasd = this.game.customInputs.wasd;
	var ship = this.levelState.ship2;

	if (ship.spinMode) {
    	ship.body.thrust(250);	
    	// Player has no control
    	return;	
	}

    if (wasd.left.isDown)
    {
		ship.body.rotateLeft(100);
    }
    else if (wasd.right.isDown)
    {
		ship.body.rotateRight(100);
    }
    else
    {
		ship.body.setZeroRotation();
    }

    if (wasd.up.isDown && ship.fuel > 0)
    {
    	
    	ship.body.thrust(200);
    	ship.thrustOn = true;
    } else {
    	ship.thrustOn = false;
    }

    if (wasd.down.isDown)
    {
        ship.body.reverse(100);
        ship.reverseOn = true;
    } else {
    	ship.reverseOn = false;
    }

    if (wasd.shoot.isDown) {
    	if (this.game.time.now > this.buttonTimers2.fireButton + WEAPON_DATA[ship.currentWeapon].reload) {
    		this.fireBullet(ship);
    		this.buttonTimers2.fireButton = this.game.time.now;
    	}

    }

    if (wasd.change.isDown) {
    	if (this.game.time.now > this.buttonTimers2.changeButton + 400) {
    		this.changeWeapon(ship);
    		this.buttonTimers2.changeButton = this.game.time.now;
    	}
    }

    if (wasd.torch.isDown) {
    	this.nextTorchMode(ship);
    }

    if (wasd.shield.isDown) {
    	this.activateShield(ship);
    }
}



gamerun.activateShield = function(ship) {

	if (ship.shieldOn || ship.shield <= 0) {
		return;
	}
	ship.shieldOn = true;
	ship.shielInterval = setInterval(function() {
		ship.shield -= 5;
		if (ship.shield <= 0) {
			ship.shield = 0;
			ship.shieldOn = false;
			clearInterval(ship.shielInterval);
			ship.shielInterval = null;
		}
	}, 300);
}

gamerun.relocateCrate = function() {

	setTimeout(function() {
		var randomIndex = Math.floor(this.crateLocations.length * Math.random());
		var pos = this.crateLocations[randomIndex];
		this.secretCrate.position.x = pos.xTile * 16;
		this.secretCrate.position.y = pos.yTile * 16;
		this.secretCrate.revive();
	}.bind(this), 10000 + Math.random()*20000);


}

gamerun.randomExtra = function(ship) {
	// Later development: insert random extra to ship

	if (ship.extra) {
		ship.shield = 100;
	} else if (ship.shield > 99) {
		ship.extra = 'shotGun';
	} else {
		// Neither one
		if (Math.random() < 0.5) {
			ship.shield = 100;
		} else {
			ship.extra = 'shotGun';
		}
	}
	
}

gamerun.checkCrateCollision = function() {

	if (!this.secretCrate.alive) return;

	if (checkOverlap(this.levelState.ship, this.secretCrate)) {
		this.randomExtra(this.levelState.ship);
	} else if (checkOverlap(this.levelState.ship2, this.secretCrate)) {
		this.randomExtra(this.levelState.ship2);
	} else {
		// No overlapping
		return;
	}

	this.secretCrate.kill();
	this.relocateCrate();

}

gamerun.update = function() {

	//this.game.physics.arcade.overlap(this.ammoGroups.bullets, this.levelLayer, this.collisionOfBulletAndWall, null, this);
	//this.game.physics.arcade.overlap(this.ammoGroups.bullets, this.levelState.ship, this.collisionOfBulletAndShip, null, this);

	// Later move these into state scope so don't have to get every loop run from long scope chain.

	this.checkCrateCollision();

	if (this.game.input.gamepad.active && this.game.input.gamepad.pad1.connected) this.handlePadInput(this.game.input.gamepad.pad1, 1);
	else this.handleKeyboardInput();

	if (this.game.input.gamepad.active && this.game.input.gamepad.pad2.connected) this.handlePadInput(this.game.input.gamepad.pad2, 2);
	else this.handleKeyboard2Input();

	if (this.levelState.ship.thrustOn) this.levelState.ship.fuel -= 1; 
	if (this.levelState.ship2.thrustOn) this.levelState.ship2.fuel -= 1; 

	if (this.levelState.ship.spinMode) this.levelState.ship.body.angularVelocity = 16;
	if (this.levelState.ship2.spinMode) this.levelState.ship2.body.angularVelocity = 16;

	// Call renderers and pass in levelState
	//console.log("SENDING CRATE");
	//console.log(this.secretCrate.position);
	this.game.mediatorLink.stateChanged(this.ammoGroups.spinBullets, this.ammoGroups.bullets, this.ammoGroups.bombs, this.levelState, this.levelState.newAnims, this.secretCrate);
	this.game.mediatorLink.callRenderUpdates();
	// Reset for next pass
	this.levelState.newAnims = [];
	//this.levelState.newTileDestructions = [];
}

gamerun.changeWeapon = function(ship, forceChange) {

	if (forceChange) {
		if (ship.currentWeapon === 'bullet') ship.currentWeapon = 'bomb';
		else if (ship.currentWeapon === 'bomb') ship.currentWeapon = 'spinner';
		else ship.currentWeapon = 'bullet';
		
	}
	else {
		//var weapons = ['bullet', 'bomb'];

		////console.log("CHANGING WEAPON");

		if (ship.currentWeapon === 'bullet') ship.currentWeapon = 'bomb';
		else if (ship.currentWeapon === 'bomb') ship.currentWeapon = 'spinner';
		else ship.currentWeapon = 'bullet';

		if (this.levelState.currentWeapons.ship === 'bullet') {
			this.levelState.currentWeapons.ship = 'bomb';

		}
		else {
			this.levelState.currentWeapons.ship = 'bullet';
		}

		////console.log(this.levelState.currentWeapons.ship);
		this.buttonTimers.weaponButton = this.game.time.now;
	}

	this.game.mediatorLink.changeInWeapon({p1: this.levelState.ship.currentWeapon, p2: this.levelState.ship2.currentWeapon});


}

gamerun.getObjectFromWeaponGroup = function(weapon) {

	var ammo;

	if (weapon === 'bullet') {
		ammo = this.ammoGroups.bullets.getFirstExists(false);
		if (!ammo) return null;
		ammo.weapon = 'bullet';
	} 

	else if (weapon === 'spinner') {
		ammo = this.ammoGroups.spinBullets.getFirstExists(false);
		if (!ammo) return null;
		ammo.weapon = 'spinner';		
	}

	else {
		ammo = this.ammoGroups.bombs.getFirstExists(false);
		if (!ammo) return null;
		////console.log("BOMB CREATED");
		////console.log(ammo);
		ammo.weapon = 'bomb';
	}

	if (ammo.explodeTimeOut) {
		clearTimeout(ammo.explodeTimeOut);
		ammo.explodeTimeOut = null;
	}

	return ammo;
	
}


gamerun.fireBullet = function(firingShip) {

	// Shooting by default is possible only every 400 ms
	// Refactor so that shooting rate can be varied with powerups etc.

		// Player can not shoot if currently dead
		if (firingShip.hp < 0) return;

		var shooter = firingShip.belongsTo;
		var ammo;

		if (firingShip.currentWeapon === 'bullet' && firingShip.extra === 'shotGun') {
			for (var i = 1; i >= 0; i--) {
				ammo = this.getObjectFromWeaponGroup(firingShip.currentWeapon);
				// If there is a timeout still going on, remove it

				if (!ammo) return;
				ammo.shooter = shooter;

			//var firingShip = shooter === 'p1' ? this.levelState.ship : this.levelState.ship2;
			
				
				var ammoX = firingShip.body.x;
				var ammoY = firingShip.body.y;
				ammo.reset(ammoX, ammoY);
				////console.log("BYE BYE AMMO");
				////console.log(ammo);
				ammo.body.rotation = firingShip.body.rotation - Math.PI/2 + Math.PI/12 * (0.5-i);
				//bullet.body.thrust(10000);
				ammo.body.gravity.y = WEAPON_DATA[ammo.weapon].gravity;
				ammo.body.velocity.y = WEAPON_DATA[ammo.weapon].speed * Math.sin(ammo.body.rotation);
				ammo.body.velocity.x = WEAPON_DATA[ammo.weapon].speed * Math.cos(ammo.body.rotation);
			};
			this.sounds.bulletshoot.play();
			return;
		}

		
		ammo = this.getObjectFromWeaponGroup(firingShip.currentWeapon);
			// If there is a timeout still going on, remove it

		if (!ammo) return;
		ammo.shooter = shooter;

		//var firingShip = shooter === 'p1' ? this.levelState.ship : this.levelState.ship2;
		
			
		var ammoX = firingShip.body.x;
		var ammoY = firingShip.body.y;
		ammo.reset(ammoX, ammoY);
		////console.log("BYE BYE AMMO");
		////console.log(ammo);
		ammo.body.rotation = firingShip.body.rotation - Math.PI/2;
		//bullet.body.thrust(10000);
		ammo.body.gravity.y = WEAPON_DATA[ammo.weapon].gravity;
		ammo.body.velocity.y = WEAPON_DATA[ammo.weapon].speed * Math.sin(ammo.body.rotation);
		ammo.body.velocity.x = WEAPON_DATA[ammo.weapon].speed * Math.cos(ammo.body.rotation);
		
		//this.game.physics.arcade.velocityFromRotation(bullet.body.rotation, 300, bullet.body.velocity);

		if (ammo.weapon === 'bomb') {
			this.sounds.bombshoot.play();
			ammo.explodeTimeOut = setTimeout(function() {
				if (ammo.alive) {
					this.processBombEffectArea(ammo);
					ammo.kill();
					this.levelState.newAnims.push({tag: 'bomb', x: ammo.x, y: ammo.y});		
				}
	
			}.bind(this), 2900);
		} else {
			this.sounds.bulletshoot.play();
		}
		

	


}

gamerun.collisionOfBulletAndShip = function(bullet, ship) {

	////console.log("SHIP DESTROYED");

	bullet.kill();
	ship.kill();
}

gamerun.collisionOfBulletAndWall = function(bullet) {

    //  When a bullet hits wall we just kill it.
    bullet.kill();
}

module.exports = gamerun;
