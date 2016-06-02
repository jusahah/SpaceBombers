//var P2 = require('p2');


var ScoreKeeper = function() {

	console.log("TEST");

	this.tournamentScore = {
		p1: 0,
		p2: 0
	};

	this.p1Wins = function() {
		++this.tournamentScore.p1;
	}

	this.p2Wins = function() {
		++this.tournamentScore.p2;
	}

	this.roundEnds = function(winner) {
		if (winner === 'p1') this.p1Wins();
		else if (winner === 'p2') this.p2Wins();
	}
}


var Mediator = function(gLogic, gP1, gP2) {

	this.c = 0;

	this.deps = {};
	this.deps.gLogic = gLogic;
	this.deps.gP1 = gP1;
	this.deps.gP2 = gP2;

	this.currentLevel = null;
	this.currentDuration = 0;

	this.rendersReady = {
		p1: false,
		p2: false
	};

	this.setDep = function(name, dep) {

		this.deps[name] = dep;
	}

	this.logicPreloaded = function() {

		// When logic has preloaded, renderers can start their own preloading.

		setTimeout(function() {
			console.log("LAUNCHING P1");
			this.deps.gP1.state.start('preloader');
			console.log("LAUNCHING P2");
			setTimeout(function() {
				this.deps.gP2.state.start('preloader');
			}.bind(this), 1000);
			

		}.bind(this), 0);
	}


	this.launchApp = function() {
		console.log("LAUNCHING APP...");
		// Logic is allowed to launch first into initial state
		this.deps.gLogic.state.start('boot');

	}

	this.logicReadyToGo = function() {

		this.deps.gP1.state.start('render');
		this.deps.gP2.state.start('render');
	}
	// This method allows logic to broadcast stuff to renderers
	// Note that during gameplay this method is called 60 times per second so it needs to be fast.
	this.stateChanged = function(spinBullets, bullets, bombs, ships, newAnims, crate) {

		if (this.rendersReady.p1) this.deps.gP1.setupState(spinBullets, bullets, bombs, ships, newAnims, crate);
		if (this.rendersReady.p2) this.deps.gP2.setupState(spinBullets, bullets, bombs, ships, newAnims, crate);

	}

	this.changeInScore = function(currentScore) {
		if (this.rendersReady.p1) this.deps.gP1.setScore(currentScore);
		if (this.rendersReady.p2) this.deps.gP2.setScore(currentScore);
	}

	this.changeInWeapon = function(currentWeapons) {
		if (this.rendersReady.p1) this.deps.gP1.setWeapon(currentWeapons.p1);
		if (this.rendersReady.p2) this.deps.gP2.setWeapon(currentWeapons.p2);
	}

	this.playerDied = function(player) {

		// Passing in time telling renderer how long it has time to animate camera movement back
		// player's launch base
		/*
		if (player === 'p1') this.deps.gP1.yourPlayerDied(3000);
		else if (player === 'p2') this.deps.gP2.yourPlayerDied(3000);
		*/


	}

	this.callRenderUpdates = function() {
		// Obsolete for now
		return;
		// What the fu...
		// To little speed up the frame rate, we alternate between renderers!
		// This may have some adverse effects, possibly. Have not experienced any... yet.
		/*
		++this.c;
		if (this.rendersReady.p1 && this.rendersReady.p2) {
			if (this.c % 2 === 0) this.deps.gP1.updateFromOut();
			else this.deps.gP2.updateFromOut();
		} 		if (this.rendersReady.p1 && this.rendersReady.p2) {
			this.deps.gP1.updateFromOut();
			this.deps.gP2.updateFromOut();
		}
		*/

	}

	this.renderIsReady = function(player) {
		this.rendersReady[player] = true;
	}

	this.endThisRound = function(winner) {

		//this.deps.scores.roundEnds(winner);

		// Important!
		// Make sure renderers are not receiving anything from gLogic
		// while playmode is off. Otherwise things will blow up bad.
		this.rendersReady.p1 = false;
		this.rendersReady.p2 = false;
		this.deps.gP1.lockRender = false;
		this.deps.gP2.lockRender = false;
		this.deps.gLogic.state.start('waitInput');
		this.deps.gP1.lastRoundWinner = winner;
		this.deps.gP1.state.start('roundEnded');
		this.deps.gP2.state.start('sleep');
		this.c = 0;

	}

	this.openMapSelection = function() {

		this.deps.gLogic.state.start('waitInput');
		this.deps.gP1.state.start('mapSelection');
		this.deps.gP2.state.start('sleep');
	}

	this.openRoundDuration = function() {
		this.deps.gLogic.state.start('waitInput');
		this.deps.gP1.state.start('roundSelection');
		this.deps.gP2.state.start('sleepWithControls');
	}

	this.menuInputIn = function(action) {
		console.log(this.deps.gP1.state);
		// Works - get access to state's functions from out
		this.deps.gP1.state.states[this.deps.gP1.state.current].inputIn(action);

	}

	this.getLevelList = function() {

		return this.deps.levels.getLevelList();
	}

	this.roundSelected = function(numOfRounds) {

		this.currentDuration = numOfRounds;
		this.startRound();
	}

	this.mapSelected = function(mapIndex) {

		this.currentLevel = this.deps.levels.getLevel(mapIndex);
		this.openRoundDuration();
	}

	this.durationSelected = function(duration) {

		this.currentDuration = duration;
		this.startRound();
	}

	this.startRound = function() {
		this.deps.gLogic.sessionData = {level: this.currentLevel, bestOf: this.currentDuration};
		this.deps.gLogic.state.start('gamerun', true, false);

		// Logic calls mediator's "logicReadyToGo" -function which launches renderers
		//this.deps.gP1.state.start('render');
		//this.deps.gP2.state.start('render');
	}

	this.toRoundSelection = function() {
		console.log("Round done - back in menu");
		this.openMapSelection();
	}

	this.getCurrentSessionData = function() {

		return this.deps.gLogic.sessionData;
	}



}

// START BUILDING APP AND ALL DEPENDENCIES

var Phaser = require('Phaser')
  , _ = require('lodash')
  , properties = require('./properties')
  , states =
    { boot: require('./states/boot.js')
    , preloader: require('./states/preloader.js')
    , game: require('./states/game.js')
    , renderConstructor: require('./states/render.js')
    , waitInput: require('./states/waitInput')
    , roundSelection: require('./states/roundSelection')
    , mapSelection: require('./states/mapSelection')
    , sleep: require('./states/sleep')
    , sleepWithControls: require('./states/sleepWithControls')
    , roundEnded: require('./states/roundEnded')


    }
  ;
var levelsCreator = require('./levels.js');

var gLogic = new Phaser.Game(properties.size.x, properties.size.y, Phaser.HEADLESS, 'game');
var gP1 = new Phaser.Game(properties.size.x, properties.size.y, Phaser.AUTO, 'gP1View');
var gP2 = new Phaser.Game(properties.size.x, properties.size.y, Phaser.AUTO, 'gP2View');

gP1.belongsTo = 'p1';
gP2.belongsTo = 'p2';

// To be overwritten when render state is created
gP1.setupState = function(){};
gP2.setupState = function(){};

// Mediator is responsible for all communication between different Phaser instances
var mediator = new Mediator(gLogic, gP1, gP2);

var scores = new ScoreKeeper();
mediator.setDep('scores', scores);

var levels = levelsCreator.createSubSystem(mediator);
mediator.setDep('levels', levels);



// Allow each Phaser to have link to mediator
gLogic.mediatorLink = mediator;
gP1.mediatorLink = mediator;
gP2.mediatorLink = mediator;

// Set info to logic instance that its logic so preloader state knows to dispatch correctly
gLogic.isLogic = true;



// All input related code and handling goes here
gLogic.customInputs = {};

// Load different states for logic instance
gLogic.state.add('boot', states.boot);
gLogic.state.add('preloader', states.preloader);
gLogic.state.add('gamerun', states.game);
gLogic.state.add('waitInput', states.waitInput);

// Load states for player 1 Phaser instance
gP1.state.add('preloader', states.preloader);
gP1.state.add('render', states.renderConstructor()); // Needs own render state
gP1.state.add('mapSelection', states.mapSelection);
gP1.state.add('roundSelection', states.roundSelection);
gP1.state.add('roundEnded', states.roundEnded);

// Load states for player 2 Phaser instance
gP2.state.add('preloader', states.preloader);
gP2.state.add('render', states.renderConstructor());
gP2.state.add('sleep', states.sleep);
gP2.state.add('sleepWithControls', states.sleepWithControls);

// Loading ready. Launch the app
mediator.launchApp();


