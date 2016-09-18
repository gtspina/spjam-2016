"use strict";

window.requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };

var TextBaseLine = {
    Top: "top"
};

function Canvas2dPrinter(config) {
    var that = this;

    that.fatherElement = document.getElementById(config.fatherElementId);

    var gameWrapper = document.createElement("div");
    gameWrapper.id = config.gameWrapperId;

    that.fatherElement.appendChild(gameWrapper);
    that.gameWrapper = document.getElementById(config.gameWrapperId);

    var canvas = document.createElement("canvas");
    canvas.width = config.width;
    canvas.height = config.height;
    canvas.id = config.printerId;

    that.gameWrapper.appendChild(canvas);

    that.canvasDOMElement = document.getElementById(config.printerId);
    that.canvasContext = that.canvasDOMElement.getContext("2d");
    that.width = that.canvasDOMElement.width;
    that.height = that.canvasDOMElement.height;

    that.scale = new Vector2(1, 1);
    that.offset;

    window.addEventListener("resize", function () {
        that.resize();
    });
    this.resize();
}

Canvas2dPrinter.prototype.clear = function () {
    var that = this;

    that.canvasContext.clearRect(0, 0, that.width, that.height);
};

Canvas2dPrinter.prototype.drawRect = function (config) {
    var that = this;

    if (config.active) {
        that.canvasContext.save();
        that.canvasContext.scale(that.scale.X, that.scale.Y);
        that.canvasContext.fillStyle = config.color;
        that.canvasContext.fillRect(config.pos.X, config.pos.Y, config.width, config.height);
        that.canvasContext.restore();
    }
};

Canvas2dPrinter.prototype.drawImage = function (config) {
    var that = this;

    config.width = (config.width === undefined) ? config.image.width : config.width;
    config.height = (config.height === undefined) ? config.image.height : config.height;

    config.image.width = config.width;
    config.image.height = config.height;

    that.canvasContext.save();
    that.canvasContext.translate(config.pos.X, config.pos.Y);
    that.canvasContext.rotate(config.rotation);
    that.canvasContext.drawImage(config.image, 0, 0, config.width, config.height, -config.origin.X, -config.origin.Y, config.width, config.height);
    that.canvasContext.restore();
};

Canvas2dPrinter.prototype.drawText = function (config) {
    var that = this;

    config.rotation = (config.rotation === undefined) ? 0 : config.rotation;

    that.canvasContext.fillStyle = config.color;
    that.canvasContext.font = config.font;
    that.canvasContext.textBaseLine = config.textBaseLine;

    that.canvasContext.save();
    that.canvasContext.translate(config.pos.X, config.pos.Y);
    that.canvasContext.rotate(config.rotation);
    that.canvasContext.fillText(config.content, 0, 0);
    that.canvasContext.restore();
};

Canvas2dPrinter.prototype.resize = function () {
    var that = this;

    var widthToHeight = that.width / that.height;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newWidthToHeight = newWidth / newHeight;

    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
    } else {
        newHeight = newWidth / widthToHeight
    }

    that.gameWrapper.style.width = newWidth + 'px';
    that.gameWrapper.style.height = newHeight + 'px';

    that.gameWrapper.style.marginTop = (window.innerHeight - newHeight) / 2 + 'px';
    that.gameWrapper.style.marginLeft = (window.innerWidth - newWidth) / 2 + 'px';
    that.gameWrapper.style.marginBottom = (window.innerHeight - newHeight) / 2 + 'px';
    that.gameWrapper.style.marginRight = (window.innerWidth - newWidth) / 2 + 'px';

    that.canvasDOMElement.width = newWidth;
    that.canvasDOMElement.height = newHeight;

    var gameCanvas = that.canvasDOMElement;
    that.offset = new Vector2(0, 0);

    if (gameCanvas.offsetParent) {
        do {
            that.offset.X += gameCanvas.offsetLeft;
            that.offset.Y += gameCanvas.offsetTop;
        } while ((gameCanvas = gameCanvas.offsetParent));
    }

    that.scale = that.getScale();
};

Canvas2dPrinter.prototype.getScale = function () {
	return new Vector2(this.canvasDOMElement.width / this.width, this.canvasDOMElement.height / this.height);
};