"use strict";

var myGame;
var myAssets;

window.addEventListener("DOMContentLoaded", function() {
	var width = 1024;
    var height = 768;
    
	var assetsLoader = new AssetsLoader({
		assets: data,
		game: undefined,
		nextScene: PandaGame
	}); 
    
	myGame = new Game({
		gameScene: assetsLoader,
		printer: new Canvas2dPrinter({
			printerId: "myCanvas",
            gameWrapperId: "gameWrapper",
			fatherElementId: "myApp",
			width: width,
			height: height
		}),
		input: Keyboard,
		width: width,
		height: height
	});
	
	assetsLoader.game = myGame;
	
	myGame.init();
});