"use strict";

function DOMPrinter(config) {
	this.fatherElement = document.getElementById(config.fatherElementId);
	
	var domStage = document.createElement("div");
	domStage.style.position = "absolute";
	domStage.style.width = config.width + "px";
	domStage.style.height = config.height + "px";
	domStage.id = config.printerId;
	domStage.style.border = "1px solid white";
	domStage.style.overflow = "hidden";
	
	this.domElement = domStage;
	this.fatherElement.appendChild(domStage);
	this.cachedObjects = {};
}

DOMPrinter.prototype.drawRect = function(config) {
	var that = this;
	
	var cachedObject = that.cachedObjects[config.id];
	
	if(cachedObject) {
		cachedObject.style.width = config.width + "px";
		cachedObject.style.height = config.height + "px";
		cachedObject.style.background = config.color;
		cachedObject.style.top = config.pos.Y + "px";
		cachedObject.style.left = config.pos.X + "px";
		cachedObject.style.position = "absolute";
		
		if(config.active) {
			cachedObject.style.display = "block";	
		} else {
			cachedObject.style.display = "none";
			console.log("sdada",config.id, cachedObject.style.display);
		}
	
	
		//console.log("obj cacheado", config.id);		
	} else {
		var domElement = document.createElement("div");
		
		domElement.style.width = config.width + "px";
		domElement.style.height = config.height + "px";
		domElement.style.background = config.color;
		domElement.style.top = config.pos.X + "px";
		domElement.style.left = config.pos.Y + "px";
		domElement.style.position = "absolute";
		
		that.cachedObjects[config.id] = domElement;
		that.domElement.appendChild(domElement);
		
		if(config.active) {
			domElement.style.display = "block";	
		} else {
			domElement.style.display = "none";			
		}
		
		//console.log("obj n cacheado", config.id);
	}
};

DOMPrinter.prototype.drawText = function(config) {
		var that = this;
	
	var cachedObject = that.cachedObjects[config.id];
	
	if(cachedObject) {
		cachedObject.innerHTML = config.content;
		cachedObject.style.color = config.color;
		cachedObject.style.top = config.pos.Y + "px";
		cachedObject.style.left = config.pos.X + "px";
		cachedObject.style.position = "absolute";
	
	} else {
		var domElement = document.createElement("div");
		
		domElement.innerHTML = config.content;
		domElement.style.color = config.color;
		domElement.style.top = config.pos.X + "px";
		domElement.style.left = config.pos.Y + "px";
		domElement.style.position = "absolute";
		
		that.cachedObjects[config.id] = domElement;
		that.domElement.appendChild(domElement);
		
		//console.log("obj n cacheado", config.id);
	}
};

DOMPrinter.prototype.clear = function() {
	
};
