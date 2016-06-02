var TORCH_MODES = [
  {rot: 0.4, sight: 240},
  {rot: 1.0, sight: 160},
  {rot: 0.12, sight: 380},
  {rot: 0, sight: 0}
];

var c = 0;

var Render = function() {

  this.levelState = {
    ship: null,
    ship2: null,
    starts: {
      ship:  {x: 400, y: 200},
      ship2: {x: 100, y: 300}
    }

  };

  // Latest state in injected here
  this.spinBullets = null;
  this.bullets = null;
  this.bombs = null;
  this.ships = null;

  this.crate = null;
  this.crateSprite = null;

  this.spinBulletCopiesGroup = null;
  this.bulletCopiesGroup = null;
  this.bombCopiesGroup = null;
  this.boomGroup = null;

  this.healthbar;
  this.healthCrop;

  this.fuelbar;
  this.fuelCrop;

  this.scoreText;

  this.weaponTextBg;
  this.weaponText;


  this.tweens = {
    ship: null,
    ship2: null
  };

  this.spritesheets = {
    bulletexplosion: null
  };

  this.newAnims = [];
  this.tileDestructions = [];

  this.bmd = null;
  this.masker = null;

  this.pendingTimeouts = [];


};



// Mediator calls this 60 times per second to setup game objects
// This renderer can then draw those objects to the screen
function setupState(spinBullets, bullets, bombs, ships, anims, crate) {

  this.spinBullets = spinBullets;
  this.bullets = bullets;
  this.bombs = bombs;
  this.ships = ships;
  this.newAnims = this.newAnims.concat(anims);

  this.crate = crate;
  //this.tileDestructions = this.tileDestructions.concat(tileDestructions);



  //////console.log(this.ships.ship.thrustOn);


}

function setScore(currentScore) {

   if(this.scoreText) {
    var newText;
    if (this.game.belongsTo === 'p1') {
      newText = currentScore.p1 + " - " + currentScore.p2;
    } else {
      newText = currentScore.p2 + " - " + currentScore.p1;
    }
    this.scoreText.setText(newText);
   }
}

function setWeapon(weapon) {

   if(this.weaponText) {
    // Spinner is too long word
    if (weapon === 'spinner') weapon = 'spin';
      this.weaponText.setText(weapon);
   }
}

Render.prototype.preload = function () {

  this.game.setupState = setupState.bind(this);
  this.game.setScore = setScore.bind(this);
  this.game.setWeapon = setWeapon.bind(this);

};

Render.prototype.initRender = function() {

  this.levelState = {
    ship: null,
    ship2: null,
    starts: {
      ship:  {x: 400, y: 200},
      ship2: {x: 100, y: 300}
    }

  };

  // Latest state in injected here
  this.spinBullets = null;
  this.bullets = null;
  this.bombs = null;
  this.ships = null;

  this.spinBulletCopiesGroup = null;
  this.bulletCopiesGroup = null;
  this.bombCopiesGroup = null;
  this.boomGroup = null;

  this.healthbar = null;
  this.healthCrop = null;
  this.lastHealth = 9999999;

  this.fuelbar = null;
  this.fuelCrop = null;
  this.lastFuel = 9999999;



  this.scoreText = null;

  this.weaponTextBg = null;
  this.weaponText = null;


  this.tweens = {
    ship: null,
    ship2: null
  };

  this.spritesheets = {
    bulletexplosion: null
  };

  this.newAnims = [];
  this.tileDestructions = [];

  this.bmd = null;
  this.masker = null;

}

Render.prototype.create = function () {
  //alert("CREATE RENDER");
  this.initRender();
  var sessionData = this.game.mediatorLink.getCurrentSessionData();

  this.game.renderer.renderSession.roundPixels = true;


  //this.spritesheets.bulletexplosion = this.game.add.sprite(300, 200, 'bulletexplosion');
  //this.spritesheets.bulletexplosion = this.game.add.sprite(300, 200, 'bulletexplosion');
  this.levelState.starts = sessionData.level.starts;

  this.game.stage.backgroundColor = sessionData.level.defaultBg;
  this.levelMap = this.game.add.tilemap(sessionData.level.map);
  this.levelMap.addTilesetImage(sessionData.level.tiles);
  //this.levelMap.addTilesetImage('gridtiles');
  this.levelMap.addTilesetImage('walls_1x2');
  this.levelMap.addTilesetImage('tiles2');
  this.levelLayer = this.levelMap.createLayer('Tile Layer 1');
  this.levelLayer.resizeWorld();
  //this.levelLayer2 = this.levelMap.createLayer('Tile Layer 2');
  //this.levelLayer2.resizeWorld();
  //this.levelState.ship = this.game.add.sprite(200, 200, 'ship');
  //this.levelState.ship2 = this.game.add.sprite(300, 200, 'ship');

  this.crateSprite = this.game.add.sprite(0,0,'crate');

    //SpinBullets
  this.spinBulletCopiesGroup = this.game.add.group();
  this.spinBulletCopiesGroup.createMultiple(20, 'spinBullet');
  this.spinBulletCopiesGroup.setAll('anchor.x', 0.5);
  this.spinBulletCopiesGroup.setAll('anchor.y', 0.5);
  this.spinBulletCopiesGroup.callAll('animations.add', 'animations', 'dud', null, 10);

  this.bulletCopiesGroup = this.game.add.group();
  this.bulletCopiesGroup.createMultiple(50, 'bullet');
  this.bulletCopiesGroup.setAll('anchor.x', 0.5);
  this.bulletCopiesGroup.setAll('anchor.y', 0.5);
  this.bulletCopiesGroup.callAll('animations.add', 'animations', 'dud', null, 10);

  this.bombCopiesGroup = this.game.add.group();
  this.bombCopiesGroup.createMultiple(6, 'bomb');
  this.bombCopiesGroup.setAll('anchor.x', 0.5);
  this.bombCopiesGroup.setAll('anchor.y', 0.5);
  this.bombCopiesGroup.callAll('animations.add', 'animations', 'explode', null, 10);

  this.boomGroup = this.game.add.group();
  this.boomGroup.createMultiple(6, 'boom');
  this.boomGroup.setAll('anchor.x', 0.5);
  this.boomGroup.setAll('anchor.y', 0.5);
  this.boomGroup.callAll('animations.add', 'animations', 'boom', [8,14,24,41,50,59], 10);

  this.levelState.ship = this.game.add.sprite(this.levelState.starts.ship.x, this.levelState.starts.ship.y, 'ship_animated');
  this.levelState.ship2 = this.game.add.sprite(this.levelState.starts.ship2.x, this.levelState.starts.ship2.y, 'ship_animated2');

  var shipAnim = this.levelState.ship.animations.add('die', [3,4,5,6,7,8,9], 10);
  shipAnim.onComplete.add(function(ship) {
    ship.frame = 3;
  });
  var shipAnim2 = this.levelState.ship2.animations.add('die', [3,4,5,6,7,8,9], 10);
  shipAnim2.onComplete.add(function(ship) {
    ship.frame = 3;
  });

  this.levelState.ship.anchor.x = 0.5;
  this.levelState.ship.anchor.y = 0.5;
  this.levelState.ship2.anchor.x = 0.5;
  this.levelState.ship2.anchor.y = 0.5;

  this.levelState.ship.torchMode = 0;
  this.levelState.ship2.torchMode = 0;

  // Offset for weapon text although we recycle this calculated value in placement of shield bars too.
  var offSet = this.game.belongsTo === 'p1' ? 10 : this.game.width-75;

  // Shield bar creation and crop
  var shieldBarName = this.game.belongsTo === 'p1' ? 'shieldbar' : 'shieldbar2';
  this.shieldbar = this.game.add.sprite(offSet,50,shieldBarName);
  this.shieldbar.fixedToCamera = true;
  this.shieldbar.cropEnabled = true;
  // To crop, we must use separate rectangle to do the cropping with.
  this.shieldCrop = new Phaser.Rectangle(0,0,this.shieldbar.width,this.shieldbar.height);

  // Health bar creation and crop
  var healthBarName = this.game.belongsTo === 'p1' ? 'healthbar' : 'healthbar2';
  this.healthbar = this.game.add.sprite(10,10,healthBarName);
  this.healthbar.fixedToCamera = true;
  this.healthbar.cropEnabled = true;
  // To crop, we must use separate rectangle to do the cropping with.
  this.healthCrop = new Phaser.Rectangle(0,0,this.healthbar.width,this.healthbar.height);


  // Fuel bar creation and crop
  var fuelBarName = this.game.belongsTo === 'p1' ? 'fuelbar' : 'fuelbar2';
  this.fuelbar = this.game.add.sprite(this.game.width-10,10,fuelBarName);
  this.fuelbar.fixedToCamera = true;
  this.fuelbar.scale.x = -1;
  this.fuelbar.cropEnabled = true;
  this.fuelCrop = new Phaser.Rectangle(0,0,this.fuelbar.width,this.fuelbar.height);

  // Score keeper
  this.scoreTextBg = this.game.add.sprite(this.game.width / 2 - 32, 10, 'scoreTextBg');
  this.scoreText = this.game.add.bitmapText(this.game.width / 2 - 28, 15, "retroFont1", "0 - 0", 10);
  //this.scoreText = this.game.add.text(this.game.width/2-30, 10, "? - ?");
  this.scoreText.fixedToCamera = true;
  this.scoreTextBg.fixedToCamera = true;


  //Weapon text keeper

  this.weaponTextBg = this.game.add.sprite(offSet, 30, 'scoreTextBg'); // Recycling score text bg
  this.weaponText = this.game.add.bitmapText(offSet + 4, 35, "retroFont1", "Bullet", 8); 
  this.weaponText.fixedToCamera = true;
  this.weaponTextBg.fixedToCamera = true;

  this.startFollowingOwnPlayer();
  this.game.camera.roundPx = true
  //this.game.camera.deadzone = new Phaser.Rectangle(0, 0, 600, 400);

  this.game.updateFromOut = Render.prototype.update2.bind(this);
  this.game.mediatorLink.renderIsReady(this.game.belongsTo);

  this.bmd = this.game.add.bitmapData(this.game.width+12,this.game.height+12);
  this.masker = this.game.add.sprite(0, 0, this.bmd);
  //this.masker.blendMode = 2;
  //this.masker.fixedToCamera = true;

  this.game.lockRender = false;
  //this.game.lockRender = true;



};
Render.prototype.getLaunchCoordsForShip = function() {

  /* Later we should do total refactor so that we can do something like:*/
  // return this.levelState.ships[this.game.belongsTo];

  if (this.game.belongsTo === 'p1') return this.ships.ship.latestRevivePad; //this.levelState.starts.ship;
  else if (this.game.belongsTo === 'p2') return this.ships.ship2.latestRevivePad;

}
Render.prototype.startFollowingOwnPlayer = function() {

  if (this.game.belongsTo === 'p1') this.camera.follow(this.levelState.ship);
  else if (this.game.belongsTo === 'p2') this.camera.follow(this.levelState.ship2);


}

Render.prototype.resetCameraWithTween = function() {

  this.camera.unfollow(); // Make sure we unfollow the exploded ship so camera can move freely
  var launchCoords = this.getLaunchCoordsForShip();
  //console.log(this.game.belongsTo === 'p1' ? 'P1' : 'P2');
  //console.log("Player's launch coords!: ");
  //console.log(launchCoords);
  // Perhaps a blurring effect too while moving...?
  var tween = this.game.add.tween(this.camera).to({y: launchCoords.y - (this.game.camera.height / 2), x: launchCoords.x - (this.game.camera.width / 2)}, 950, Phaser.Easing.Quadratic.InOut, true);

  tween.onComplete.add(function() {
    //alert("Tween done");
    //alert("TWEEN DONE");
    //console.log("RESET CAMERA TWEEN COMPLETE");
    this.startFollowingOwnPlayer();
  }.bind(this));
  //console.log("RESET CAMERA TWEE");
  tween.start();


}

Render.prototype.reviveAnimation = function(ship) {

  // Nothing

  //alert("REVIVE ANIM");

  // Not in use currently!
  return;

  if (this.tweens.ship && this.tweens.ship.isRunning) return;
  //alert("Tween time");
  //console.log("REVIVE CAMERA TWEEN");
  this.tweens.ship = this.game.add.tween(ship).to({alpha: 0}, 600, Phaser.Easing.Linear.InOut, true).loop(true);
  //this.tweens.ship.repeat(15);
  //this.tweens.ship.start();
  setTimeout(function() {
    //console.log("REVIVE CAMERA TWEEN COMPLETE");
    if (!this.tweens || !this.tweens.ship) return;
    this.tweens.ship.stop();
    this.tweens.ship = null;
    ship.alpha = 1;
  }.bind(this),4000);


}
Render.prototype.shieldBarUpdate = function() {

  var myShip = this.ships.ship.belongsTo === this.game.belongsTo ? this.ships.ship : this.ships.ship2;
  //console.log("SHIELD: " + myShip.shield);
  if (myShip.shield === this.lastShield) return;
  //console.log("HU UPD");
  //////console.log("CURRENT HEALTH: " + myShip.hp);
  this.shieldCrop.width = (myShip.shield / 100) * 65;
  //console.log("HEALTH CROP");
  //console.log(this.healthCrop);
  //console.log(this.healthbar);
  //////console.log(this.healthCrop.width);

  this.shieldbar.crop(this.shieldCrop);
  this.lastshield = myShip.shield;

}

Render.prototype.healthBarUpdate = function() {

  var myShip = this.ships.ship.belongsTo === this.game.belongsTo ? this.ships.ship : this.ships.ship2;
  if (myShip.hp === this.lastHealth) return;
  //console.log("HU UPD");
  //////console.log("CURRENT HEALTH: " + myShip.hp);
  this.healthCrop.width = (myShip.hp / 1550) * 200;
  //console.log("HEALTH CROP");
  //console.log(this.healthCrop);
  //console.log(this.healthbar);
  //////console.log(this.healthCrop.width);

  this.healthbar.crop(this.healthCrop);
  this.lastHealth = myShip.hp;

}

Render.prototype.fuelBarUpdate = function() {

  var myShip = this.ships.ship.belongsTo === this.game.belongsTo ? this.ships.ship : this.ships.ship2;
  if (myShip.fuel === this.lastFuel) return;
  //////console.log("CURRENT HEALTH: " + myShip.hp);
  //console.log("FU UPD");
  this.fuelCrop.width = (myShip.fuel / 1600) * 200;
  //////console.log(this.healthCrop.width);
  
  this.fuelbar.crop(this.fuelCrop); 
  this.lastFuel = myShip.fuel;

}

Render.prototype.drawOffTile = function(coords) {

  this.levelMap.putTile(1, coords.x, coords.y);


}

Render.prototype.update = function() {


  this.spinBulletCopiesGroup.forEachAlive(function(bullet) {
    if (!bullet.exploding) bullet.kill();
  });

  this.bulletCopiesGroup.forEachAlive(function(bullet) {
    if (!bullet.exploding) bullet.kill();
  });

  this.bombCopiesGroup.forEachAlive(function(bomb) {
    if (!bomb.exploding) bomb.kill();
  });
/*
  if (this.tileDestructions.length > 0) {
    for (var i = this.tileDestructions.length - 1; i >= 0; i--) {
      this.drawOffTile(this.tileDestructions[i])
    };
  }
*/
  if (this.newAnims.length > 0) {
    ////console.log("-------------------------ANIM FOUND--------------------------------------")
    //alert("Animation found!");

    // OLD BOMB ANIM
/*
    for (var i = this.newAnims.length - 1; i >= 0; i--) {
      var anim = this.newAnims[i];
      ////console.log(anim);
      if (anim.tag === 'bomb') {
        var bomb = this.bombCopiesGroup.getFirstDead(false);
        if (!bomb) continue;
        bomb.revive();
        bomb.position.x = anim.x;
        bomb.position.y = anim.y;
        bomb.exploding = true;
        bomb.frame = 0;
        ////console.log("-START EXPLODE SEQ");
        var animPlaying = bomb.play('explode', 15, false, true);
        (function(thisBomb) {
          animPlaying.onComplete.add(function() {
            thisBomb.exploding = false;
          });
        })(bomb);

        //alert("NOW");

      }
    };
    */

    // NEW BOMB ANIM

    // Play new animations that were passed in from the Mediator
    for (var i = this.newAnims.length - 1; i >= 0; i--) {
        var anim = this.newAnims[i];
        ////console.log(anim);
        if (anim.tag === 'bomb') {
          var boom = this.boomGroup.getFirstDead(false);
          boom.position.x = anim.x;
          boom.position.y = anim.y-30;
          //boom.rotation = Math.random() * Math.PI;
          boom.frame = 0;
          boom.revive();
          var animPlaying = boom.play('boom', 20, false, true);
        } else if (anim.tag === 'bullet') {
          //alert("BULLET ANIM");
          var bullet = this.bulletCopiesGroup.getFirstDead(false);
          bullet.position.x = anim.x;
          bullet.position.y = anim.y;
          bullet.frame = 0;
          bullet.exploding = true;
          bullet.revive();
          var animPlaying = bullet.play('dud', 15, false, true);
          (function(theBullet) {
            animPlaying.onComplete.add(function() {
              theBullet.exploding = false;
            });            
          })(bullet);
        } else if (anim.tag === 'spinbullet') {
          //alert("BULLET ANIM");
          var bullet = this.spinBulletCopiesGroup.getFirstDead(false);
          bullet.position.x = anim.x;
          bullet.position.y = anim.y;
          bullet.frame = 0;
          bullet.exploding = true;
          bullet.revive();
          var animPlaying = bullet.play('dud', 15, false, true);
          (function(theBullet) {
            animPlaying.onComplete.add(function() {
              theBullet.exploding = false;
            });            
          })(bullet);
        }


    }
  }
  // reset animations queue so no animation is accidentally played twice
  this.newAnims = [];

  if (this.spinBullets) {

    this.spinBullets.forEachAlive(function(sprite) {
      if (sprite.visible) {
        ////console.log("BULLET VISIBLE");
        var bullet = this.spinBulletCopiesGroup.getFirstDead(false);
        bullet.frame = 0;
        bullet.revive();
        bullet.position.x = sprite.x;
        bullet.position.y = sprite.y;

        //////console.log(sprite.x + ", " + sprite.y);
      } 

    }.bind(this));
  }

  if (this.bullets) {

    this.bullets.forEachAlive(function(sprite) {
      if (sprite.visible) {
        ////console.log("BULLET VISIBLE");
        var bullet = this.bulletCopiesGroup.getFirstDead(false);
        bullet.frame = 0;
        bullet.revive();
        bullet.position.x = sprite.x;
        bullet.position.y = sprite.y;

        //////console.log(sprite.x + ", " + sprite.y);
      } 

    }.bind(this));
  }

  if (this.bombs) {

    this.bombs.forEachAlive(function(sprite) {
      ////console.log("BOMB ALIVE");
      ////console.log(sprite.x + ", " + sprite.y);
      if (sprite.visible) {
        var bomb = this.bombCopiesGroup.getFirstDead(false);
        ////console.log(bomb);
        bomb.revive();
        bomb.frame = 0;
        bomb.position.x = sprite.x;
        bomb.position.y = sprite.y;
        //////console.log(sprite.x + ", " + sprite.y);
      } 

    }.bind(this));
  }

  if (this.ships) {
    //////console.log("SHIP IN RENDER");
    //////console.log(this.ships.ship);
    if (this.ships.ship.alive) {
      if (this.ships.ship.thrustOn) {
        this.levelState.ship.frame = this.ships.ship.shieldOn ? 2 : 5;
      }

      else if (this.ships.ship.reverseOn) {
        this.levelState.ship.frame = this.ships.ship.shieldOn ? 1 : 4;
      }
      else {
        this.levelState.ship.frame = this.ships.ship.shieldOn ? 0 : 3;
      }
    }
    if (this.ships.ship2.alive) {
      if (this.ships.ship2.thrustOn) {
        this.levelState.ship2.frame = this.ships.ship2.shieldOn ? 2 : 5;
      }

      else if (this.ships.ship2.reverseOn) {
        this.levelState.ship2.frame = this.ships.ship2.shieldOn ? 1 : 4;
      }
      else {
        this.levelState.ship2.frame = this.ships.ship2.shieldOn ? 0 : 3;
      }
    }

    if (this.ships.ship.alive && !this.levelState.ship.alive) {
      this.levelState.ship.revive();
      this.reviveAnimation(this.levelState.ship);
    } else if (!this.ships.ship.alive && this.levelState.ship.alive) {

      this.levelState.ship.alive = false;
      this.levelState.ship.play('die', 15, false, true);
      
      // If the died ship owns this renderer, lets move camera back to launch pad
      if (this.game.belongsTo === 'p1') {
        setTimeout(function() {
          ////console.log("RESETTING CAMERA P1");
          //alert("RESET p1");
          this.resetCameraWithTween();
        }.bind(this), 1000) // Wait a moment so player sees the explosion etc.     
      }

      
      //this.camera.reset();
    }
    if (this.ships.ship2.alive && !this.levelState.ship2.alive) {
      this.levelState.ship2.revive();
    } else if (!this.ships.ship2.alive && this.levelState.ship2.alive) {
      this.levelState.ship2.alive = false;
      this.levelState.ship2.play('die', 15, false, true);
      // If the died ship owns this renderer, lets move camera back to launch pad
      if (this.game.belongsTo === 'p2') {
        setTimeout(function() {
          ////console.log("RESETTING CAMERA P2");
          this.resetCameraWithTween();
        }.bind(this), 1000) // Wait a moment so player sees the explosion etc.     
      }      
    }

    this.levelState.ship.position.x = this.ships.ship.x;
    this.levelState.ship.position.y = this.ships.ship.y;
    this.levelState.ship2.position.x = this.ships.ship2.x;
    this.levelState.ship2.position.y = this.ships.ship2.y;
    this.levelState.ship.rotation = this.ships.ship.rotation;
    this.levelState.ship2.rotation = this.ships.ship2.rotation;
    this.levelState.ship.torchMode = this.ships.ship.torchMode;
    this.levelState.ship2.torchMode = this.ships.ship2.torchMode;
    this.levelState.ship.lightsOut = this.ships.ship.lightsOut;
    this.levelState.ship2.lightsOut = this.ships.ship2.lightsOut;
    this.levelState.ship.fuel = this.ships.ship.fuel;
    this.levelState.ship2.fuel = this.ships.ship2.fuel; 
    this.levelState.ship.shield = this.ships.ship.shield;
    this.levelState.ship2.shield = this.ships.ship2.shield;

    if (this.crate) {
      if (!this.crate.alive && this.crateSprite.alive) this.crateSprite.kill();
      else if (this.crate.alive && !this.crateSprite.alive) this.crateSprite.revive();

      this.crateSprite.position.x = this.crate.position.x;
      this.crateSprite.position.y = this.crate.position.y;  
    }


    //////console.log("SETTING TORCH:" + this.ships.ship.torchMode);

    // Update HUD-displays
    this.healthBarUpdate();
    this.fuelBarUpdate();
    this.shieldBarUpdate();

    
    //this.game.updateLogic();

    // THIS IS HOW WE GET PHASER DO SEPARATE RENDER
    // Remember to use lockRender = true elsewhere
    this.game.renderer.render(this.game.stage);
  }
}

Render.prototype.update2 = function() {
  
  //this.update2();
  //this.renderOverlay();
}

Render.prototype.getCurrentRotationOfPlayer = function() {

  if (this.game.belongsTo === 'p1') {
    if (this.ships) return this.ships.ship.body.rotation;
  }
  else {
    if (this.ships) return this.ships.ship2.body.rotation;
  }

  return 0;
}

Render.prototype.renderOverlay = function() {

    if (!this.ships) return;

    var myShip = this.game.belongsTo === 'p1' ? this.levelState.ship : this.levelState.ship2;
    var ship = this.levelState.ship;
    var ship2 = this.levelState.ship2;

    var playerPos1 = this.playerXOnScreen(ship);
    var playerPos2 = this.playerXOnScreen(ship2);

    var currRot1   = this.ships.ship.body.rotation - Math.PI/2;
    var currRot2   = this.ships.ship2.body.rotation - Math.PI/2;

    this.game.world.bringToTop(this.healthbar);
    this.game.world.bringToTop(this.fuelbar);

    var bmd = this.bmd;

    bmd.ctx.clearRect(0, 0, this.game.width+8, this.game.height+8);
    bmd.ctx.fillStyle="rgba(0, 0, 0, 0.92)";
    bmd.ctx.fillRect(0, 0 ,this.game.width+8,this.game.height+8);
    bmd.ctx.save();
    //bmd.ctx.fillStyle="rgba(0, 160, 0, 0.75)";
    bmd.ctx.globalCompositeOperation='destination-out';
    //Game idea - change torch mode

    
    if (ship.alive) {
      // Player 1 torch
      var innerCap = TORCH_MODES[ship.torchMode].sight <= 60 ? 0 : 60;
      var grd=bmd.ctx.createRadialGradient(playerPos1.x+12, playerPos1.y+12, TORCH_MODES[ship.torchMode].sight - innerCap, playerPos1.x+12, playerPos1.y+12, TORCH_MODES[ship.torchMode].sight);
      grd.addColorStop(0, "rgba(0, 0, 255, 0.9)");
      grd.addColorStop(1, "rgba(255, 0, 255, 0.0)");
      
      bmd.ctx.beginPath();
      bmd.ctx.moveTo(playerPos1.x+12, playerPos1.y+12);
      //////console.log("TORCH MODE: " + ship.torchMode);
      bmd.ctx.arc(playerPos1.x+12, playerPos1.y+12,TORCH_MODES[ship.torchMode].sight,currRot1-(TORCH_MODES[ship.torchMode].rot), currRot1+(TORCH_MODES[ship.torchMode].rot));
      bmd.ctx.lineTo(playerPos1.x+12, playerPos1.y+12);
      bmd.ctx.closePath();
      bmd.ctx.fillStyle = grd;
      bmd.ctx.fill();
    }

    if (ship2.alive) {
      // Player 2 torch
      innerCap = TORCH_MODES[ship2.torchMode].sight <= 60 ? 0 : 60;
      grd=bmd.ctx.createRadialGradient(playerPos2.x+12, playerPos2.y+12, TORCH_MODES[ship2.torchMode].sight - innerCap, playerPos2.x+12, playerPos2.y+12, TORCH_MODES[ship2.torchMode].sight);
      grd.addColorStop(0, "rgba(0, 0, 255, 0.9)");
      grd.addColorStop(1, "rgba(255, 0, 255, 0.0)");
      bmd.ctx.beginPath();
      //bmd.ctx.beginPath();
      bmd.ctx.moveTo(playerPos2.x+12, playerPos2.y+12);
      //////console.log("TORCH MODE: " + ship.torchMode);
      bmd.ctx.arc(playerPos2.x+12, playerPos2.y+12,TORCH_MODES[ship2.torchMode].sight,currRot2-(TORCH_MODES[ship2.torchMode].rot), currRot2+(TORCH_MODES[ship2.torchMode].rot));
      bmd.ctx.lineTo(playerPos2.x+12, playerPos2.y+12);

      bmd.ctx.closePath();
      bmd.ctx.fillStyle = grd;
      bmd.ctx.fill();
    }

    var upperLeft = this.getUpperLeftOnScreen();

    this.masker.position.x = upperLeft.x -6;
    this.masker.position.y = upperLeft.y -6;
    
    
    bmd.ctx.fillStyle="rgba(0, 160, 0, 0.75)";
    bmd.ctx.globalCompositeOperation='destination-out';

    //bmd.ctx.fillRect(30, 32, this.healthCrop.width-4, this.healthbar.height-10);
    if (!myShip.lightsOut) {
      var me = this.playerOnScreen();
      bmd.ctx.fillStyle="rgba(0, 160, 0, 0.99)";
      bmd.ctx.beginPath();
      bmd.ctx.arc(me.x+6, me.y+6, 16, 0, 2*Math.PI, false);
      bmd.ctx.closePath();
      bmd.ctx.fill();
    }

    bmd.ctx.restore();

}


Render.prototype.playerXOnScreen = function(ship) {

    return {
      x: ship.position.x - this.game.camera.x,
      y: ship.position.y - this.game.camera.y,
    }
  }

Render.prototype.playerOnScreen = function() {

    var ship = this.game.belongsTo === 'p1' ? this.levelState.ship : this.levelState.ship2;

    return {
      x: ship.position.x - this.game.camera.x,
      y: ship.position.y - this.game.camera.y,
    }
  }

Render.prototype.getUpperLeftOnScreen = function() {

    return {
      x: this.game.camera.x,
      y: this.game.camera.y
    };
}

module.exports = function() {
  return new Render();
};