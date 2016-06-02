var preloader = {};

preloader.preload = function () {
	// Levels
  //this.game.load.tilemap('level2', 'tilemaps/maps/mgs_level2.json', null, Phaser.Tilemap.TILED_JSON);
  //this.game.load.tilemap('level3', 'tilemaps/maps/mgs_level3.json', null, Phaser.Tilemap.TILED_JSON);
  this.game.load.tilemap('map', 'tilemaps/maps/collision_test.json', null, Phaser.Tilemap.TILED_JSON);
  this.game.load.tilemap('map2', 'tilemaps/maps/map2.json', null, Phaser.Tilemap.TILED_JSON);
  this.game.load.tilemap('map3', 'tilemaps/maps/map3.json', null, Phaser.Tilemap.TILED_JSON);
  this.game.load.tilemap('map4', 'tilemaps/maps/map4.json', null, Phaser.Tilemap.TILED_JSON);
  this.game.load.tilemap('map5', 'tilemaps/maps/map5.json', null, Phaser.Tilemap.TILED_JSON);
  this.game.load.tilemap('map6', 'tilemaps/maps/map6.json', null, Phaser.Tilemap.TILED_JSON);
  this.game.load.tilemap('map7', 'tilemaps/maps/map7.json', null, Phaser.Tilemap.TILED_JSON);
  this.game.load.tilemap('map8', 'tilemaps/maps/map8.json', null, Phaser.Tilemap.TILED_JSON);
  this.game.load.tilemap('map9', 'tilemaps/maps/map9.json', null, Phaser.Tilemap.TILED_JSON);
  this.game.load.tilemap('map10', 'tilemaps/maps/map10.json', null, Phaser.Tilemap.TILED_JSON);
  this.game.load.tilemap('map11', 'tilemaps/maps/map11.json', null, Phaser.Tilemap.TILED_JSON);
  this.game.load.tilemap('map12', 'tilemaps/maps/map12.json', null, Phaser.Tilemap.TILED_JSON);
  //this.game.load.image('logo', 'images/phaser.png#grunt-cache-bust');
  this.game.load.image('ship', 'images/thrust_ship2.png#grunt-cache-bust');
  this.game.load.image('crate', 'images/crate.png#grunt-cache-bust');

  this.game.load.spritesheet('spinBullet', 'images/spinbullet.png', 9, 9);
  this.game.load.spritesheet('bullet', 'images/bullet.png', 9, 9);
  this.game.load.spritesheet('bomb', 'images/bomb.png', 9, 9);
  
  this.game.load.image('ground_1x1', 'tilemaps/tiles/ground_1x1.png');
  this.game.load.image('map2_tiles', 'tilemaps/tiles/map2_tiles.png');
  this.game.load.image('map3_tiles', 'tilemaps/tiles/map3_tiles.png');
  this.game.load.image('map4_tiles', 'tilemaps/tiles/map4_tiles.png');
  this.game.load.image('map5_tiles', 'tilemaps/tiles/map5_tiles.png');
  this.game.load.image('map6_tiles', 'tilemaps/tiles/map6_tiles.png');
  this.game.load.image('map7_tiles', 'tilemaps/tiles/map7_tiles.png');
  this.game.load.image('map8_tiles', 'tilemaps/tiles/map8_tiles.png'); 
  this.game.load.image('map10_tiles', 'tilemaps/tiles/map10_tiles.png'); 
  this.game.load.image('map11_tiles', 'tilemaps/tiles/map11_tiles.png'); 
  this.game.load.image('map18_tiles', 'tilemaps/tiles/map18_tiles.png');    
  //this.game.load.image('gridtiles', 'tilemaps/tiles/gridtiles.png');
  this.game.load.image('walls_1x2', 'tilemaps/tiles/walls_1x2.png');
  this.game.load.image('tiles2', 'tilemaps/tiles/tiles2.png');
  this.game.load.image('healthbar', 'images/healthbar.png');
  this.game.load.image('healthbar2', 'images/healthbar2.png');
  this.game.load.image('fuelbar', 'images/fuelbar.png');
  this.game.load.image('fuelbar2', 'images/fuelbar2.png'); 
  this.game.load.image('shieldbar', 'images/shieldbar.png');
  this.game.load.image('shieldbar2', 'images/shieldbar2.png');    
  this.game.load.image('scoreTextBg', 'images/scoreTextBg.png'); 
  this.game.load.spritesheet('boom', 'images/boom_sprite.png', 128, 128);
  //this.game.load.spritesheet('bulletexplosion', 'images/bulletexplosion.png', 16, 16, 5);
  this.game.load.spritesheet('ship_animated', 'images/ship_shielded.png', 29, 29);
  this.game.load.spritesheet('ship_animated2', 'images/ship2_shielded.png', 29, 29);
  this.game.load.bitmapFont('retroFont1', 'images/carrier_command.png', 'images/carrier_command.xml');

  // Load polygons for player ships
  if (this.game.isLogic) {
  	this.game.load.physics('shipPolygons', 'tilemaps/thrust.json');
  	this.game.load.audio('bombshoot', 'audio/bombshoot.wav');
  	this.game.load.audio('bulletshoot', 'audio/bullet.wav');
  	this.game.load.audio('explosion', 'audio/explosion.wav');
  	this.game.load.audio('deadmau5ftw', 'audio/deadmau5.mp3');

  }

};

preloader.create = function () {
	console.log(this.game.belongsTo);
	if (this.game.isLogic) {
		console.log("LOGIC PRELOAD");
    this.game.mediatorLink.logicPreloaded();
		this.game.state.start('waitInput');
	} else if (this.game.belongsTo === 'p1'){
		console.log("P1 PRELOAD");
		this.game.state.start('mapSelection');
	} else {
		console.log("P2 PRELOAD");
		this.game.state.start('sleep');
	}
	

};

module.exports = preloader;
