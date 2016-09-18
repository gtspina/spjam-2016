"use strict";

var GameUtil = {};

GameUtil.math = {};

GameUtil.hasRectCollision = function(obj1, obj2) {
    var maxX = obj1.pos.X + obj1.width > obj2.pos.X;
    var maxY = obj1.pos.Y + obj1.height > obj2.pos.Y;
    var minX = obj1.pos.X < obj2.pos.X + obj2.width;
    var minY = obj1.pos.Y < obj2.pos.Y + obj2.height;

    return maxX && minX && maxY && minY;
};

GameUtil.drawGameObjects = function(config) {

    for (var i = 0; i < config.gameObjs.length; i++) {
        var currGameObj = config.gameObjs[i];

        if (currGameObj.image) {
            config.printer.drawImage({
                id: currGameObj.id,
                image: currGameObj.image,
                pos: currGameObj.pos,
                origin: new Vector2(0, 0)
            });
        } else {
            config.printer.drawRect({
                id: currGameObj.id,
                active: currGameObj.active,
                color: currGameObj.color,
                width: currGameObj.width,
                height: currGameObj.height,
                pos: currGameObj.pos
            });
        }

        //console.log(currGameObj);

        //if(currGameObj.active) {

        //}
    }

};

GameUtil.math.getRandomArbitrary = function(min, max) {
    return Math.random() * (max - min) + min;
};
