"use strict";

var GamePad = {
	id: "gamePad",
	aPressed: false,
	aClicked: false,
	leftPressed: false,
	rightPressed: false,
	currGamePad: undefined
};

GamePad.init = function() {
	var that = this;
	
	if(navigator.getGamepads()[0]) {
		console.log("Conectado");
		that.currGamePad = navigator.getGamepads()[0];		
	}
	
	window.addEventListener("gamepadconnected", function() {
		console.log("Conectado");
		that.ready = true;
		that.currGamePad = navigator.getGamepads()[0];
	});
	
	
};

GamePad.update = function() {
	var that = this;
	
	if(that.currGamePad) {
		that.currGamePad = navigator.getGamepads()[0];
		var axeLF = GamePad.currGamePad.axes[0];

		GamePad.leftPressed = false;
		GamePad.rightPressed = false;

		if(axeLF < -0.5) {
			GamePad.leftPressed = true;		
		} else if(axeLF > 0.5) {
			GamePad.rightPressed = true;		
		}
		
		if(GamePad.currGamePad.buttons[0].pressed) {
			if(!GamePad.aPressed) {
				GamePad.aClicked = true;
			}
			GamePad.aPressed = true;
		} else {
			GamePad.aPressed = false;
		}
	}
	
};

GamePad.reset = function() {
	var that = this;
	
	that.aClicked = false;
};