"use strict";

function Game(config) {
	this.gameScene = config.gameScene;
	this.printer = config.printer;
	this.input = config.input;
	this.width = config.width;
	this.height = config.height;
}

Game.prototype.init = function() {
	var that = this;
	
	that.input.init();
	
	that.gameScene.init({
		input: that.input,
		width: that.width,
		height: that.height
	});
	
	that.mainLoop();
}

Game.prototype.mainLoop = function() {
	var that = this;
	
	that.input.update();
	
	that.update();
	that.printer.clear();
	that.draw();
	
	that.input.reset();
	
    /*
	setTimeout(function() {
		that.mainLoop();
	}, 1000/60);*/
	window.requestAnimationFrame(that.mainLoop.bind(that));
};

Game.prototype.update = function() {
	var that = this;
    
    var deltaTime = 1 / 60;
    
	that.gameScene.update(deltaTime);
};

Game.prototype.draw = function() {
	var that = this;
	
	that.gameScene.draw(that.printer);
};