"use strict";

var PandaGameUtil = {};

var DirectionArea = {
    Backward: 0,
    Forward: 1,
    None: -1
};

PandaGameUtil.move = function(config) {

    for (var i = 0; i < config.gameObjs.length; i++) {
        var currGameObj = config.gameObjs[i];

        currGameObj.pos.X += config.vel;
    }

};

PandaGameUtil.relocate = function(config) {
    var that = this;

    switch (config.direction) {

        case DirectionArea.Forward:
            relocateFoward();
            break;

        case DirectionArea.Backward:
            relocateBackward();
            break;

    }

    function relocateFoward() {
        for (var i = 0; i < config.gameObjs.length; i++) {
            var currGameObj = config.gameObjs[i];

            if (currGameObj.pos.X > config.screenSize) {
                var prev = that.getById({
                    gameObjs: config.gameObjs,
                    id: currGameObj.nextId
                });

                if (prev) {
                    //console.log(currGameObj.id, prev.id);
                    currGameObj.pos.X = prev.pos.X - currGameObj.width;
                    currGameObj.floors = that.generateFloors({
                        initialPos: currGameObj.pos,
                        id: currGameObj.id,
                        assets: config.assets
                    });
                }
            }
        }
    };

    function relocateBackward() {

        for (var i = 0; i < config.gameObjs.length; i++) {
            var currGameObj = config.gameObjs[i];

            if (currGameObj.pos.X + currGameObj.width < 0) {
                console.log("saiu da tela");

                var next = that.getById({
                    gameObjs: config.gameObjs,
                    id: currGameObj.prevId
                });

                if (next) {
                    currGameObj.pos.X = next.pos.X + next.width;
                    currGameObj.floors = that.generateFloors({
                        initialPos: currGameObj.pos,
                        id: currGameObj.id,
                        assets: config.assets
                    });
                    //console.log(currGameObj.id, prev.id);
                    //currGameObj.pos.X = next.pos.X - currGameObj.width;

                }
            }
        }
    };
};

PandaGameUtil.generateFloors = function(config) {
    var floors = [];

    var mapFloor = pandaMaps[config.id];
    var idFloor = 0;

    console.log(config.assets.bambu);
    
    var tempPos = new Vector2(config.initialPos.X, config.initialPos.Y);
    for (var indexRow in mapFloor) {
        //var colors = ["black", "orange", "transparent"];
        //var colors = ["transparent", "black", "orange", "blue",  "purple", "pink"];
        var colors = ["transparent", "black", "orange", "blue", "transparent", "pink"];
        var floorRow = mapFloor[indexRow];

        for (var indexColumn in floorRow) {
            var floorType = floorRow[indexColumn];
            var floor = new Floor({
                id: config.id + "-floor" + idFloor,
                active: true,
                color: colors[floorType],
                pos: new Vector2(tempPos.X, tempPos.Y),
                width: 80,
                height: 80,
                type: floorType,
                colPos: indexColumn,
                rowPos: indexRow,
                gameAreaId: config.id
            });

            if (floorType == FloorType.Enemy) {
                floor.dir = new Vector2(5, 0);
                floor.changeDirCounter = 10;
            } else if (floorType == FloorType.Floor1 || floorType == FloorType.Floor2) {
                floor.image = config.assets.bambu;
            }


            tempPos.X += 50;
            idFloor += 1;
            floors.push(floor);
        }
        tempPos.Y += 80;
        tempPos.X = config.initialPos.X;
    }

    return floors;
};

PandaGameUtil.getPlayerArea = function(player, gameAreas) {
    var that = this;


    for (var i = 0; i < gameAreas.length; i++) {
        var gameArea = gameAreas[i];

        if (GameUtil.hasRectCollision(player, gameArea)) {
            return gameArea.id;
        }
    }
};

PandaGameUtil.getById = function(config) {

    for (var i = 0; i < config.gameObjs.length; i++) {
        var currGameObj = config.gameObjs[i];

        //console.log(currGameObj.id, config.id);

        if (currGameObj.id.indexOf(config.id) > -1) {
            return currGameObj;
        }
    }

};
