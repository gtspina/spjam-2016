"use strict";

var PandaGameState = {
    Intro: 0,
    Menu: 1,
    InGame: 2,
    GameOver: 3
};
var PandaGame = {
    currState: PandaGameState.InGame,
    sucess: false,
    flowers: 2,

    time: 20,

    assets: {
        img: {},
        audio: {}
    },

    numAreas: 4,
    //widthArea: 1067,
    widthArea: 512,
    gameAreas: [],
    //initialPosAreas: new Vector2(0, -500)
    initialPosAreas: new Vector2(0, 0),

    player: undefined,

    physicsRules: {
        gravity: 0.1,
        dampeningFactor: 0.99
    }
};

PandaGame.init = function() {
    var that = this;

    createGame();

    function createGame() {
        that.currState = PandaGameState.InGame;

        playBgSound();
        createPlayer();
        createAreas();
    }

    function createAreas() {

        var colors = ["red", "yellow"];
        var currColorIndex = 0;
        var tempPos = new Vector2(that.initialPosAreas.X, that.initialPosAreas.Y);

        for (var i = 0; i < that.numAreas; i++) {
            var gameArea = new GameArea({
                active: true,
                id: "area-" + i,
                pos: new Vector2(tempPos.X, tempPos.Y),
                width: that.widthArea,
                height: 800,
                color: colors[currColorIndex],
                image: that.assets.img["bg1"],
                prevId: "area-" + (i - 1),
                nextId: "area-" + (i + 1),
                floors: PandaGameUtil.generateFloors({
                    initialPos: tempPos,
                    id: "area-" + i
                })
            });

            if (i < 1) {
                gameArea.prevId = "area-" + (that.numAreas - 1);
            } else if (i + 1 == that.numAreas) {
                gameArea.nextId = "area-" + 0;
            }

            that.gameAreas.push(gameArea);

            currColorIndex = (currColorIndex + 1) % colors.length;
            tempPos.X += that.widthArea;
        }

    }

    function playBgSound() {
        //Assets["intro"].pause();

        that.assets.audio["level-theme"].loop = true;
        that.assets.audio["level-theme"].play();
    }

    function createPlayer() {
        that.player = new Player({
            active: true,
            image: undefined,
            id: "player",
            pos: new Vector2(250, 670),
            width: 86,
            height: 100,
            color: "black",
        });

        console.log(that.player);
    }
};

PandaGame.update = function(deltaTime) {
    var that = this;

    switch (that.currState) {
        case PandaGameState.InGame:
            inGame();
            break;

        case PandaGameState.GameOver:
            //gameOver();

            break;
    }

    function inGame() {
        var direction = DirectionArea.None;
        var velocity = 0;

        if (Keyboard.rightPressed) {
            direction = DirectionArea.Backward;
            velocity = -5;
        } else if (Keyboard.leftPressed) {
            direction = DirectionArea.Forward;
            velocity = 5;
        }

        PandaGameUtil.move({
            gameObjs: that.gameAreas,
            vel: velocity
        });

        for (var indexArea in that.gameAreas) {
            var currArea = that.gameAreas[indexArea];

            PandaGameUtil.move({
                gameObjs: currArea.floors,
                vel: velocity
            });
        }

        PandaGameUtil.relocate({
            gameObjs: that.gameAreas,
            screenSize: 1024,
            direction: direction
        });

        isPlayerFalling();
        jumpPlayer();
        getItem();
        moveEnemys();
        drecreaseTime();
        collisionEnemys();
        sucessGame();
        //verifyCollisionFloors();

        function hasCollisionFloors() {
            var areaId = PandaGameUtil.getPlayerArea(that.player, that.gameAreas);
            var area = PandaGameUtil.getById({
                gameObjs: that.gameAreas,
                id: areaId
            });

            if (area) {
                for (var index in area.floors) {
                    var floor = area.floors[index];

                    if (floor.type != FloorType.None) {
                        if (GameUtil.hasRectCollision(that.player, floor)) {

                        } else {

                        }
                    }

                }
            }
        }

        function verifyCollisionFloors() {
            var areaId = PandaGameUtil.getPlayerArea(that.player, that.gameAreas);
            var area = PandaGameUtil.getById({
                gameObjs: that.gameAreas,
                id: areaId
            });

            if (area) {
                for (var index in area.floors) {
                    var floor = area.floors[index];

                    if (floor.type != FloorType.None) {
                        if (GameUtil.hasRectCollision(that.player, floor)) {
                            //if (player.pos.Y + player.width < floor.pos.X + 2) {
                            return {
                                hasCollided: true,
                                floor: floor
                            };
                            //}
                        }
                    }
                }
            }

            return {
                hasCollided: false
            };
        }

        function jumpPlayer() {
            that.player.vel.Y += that.physicsRules.gravity;


            that.player.vel.X *= that.physicsRules.dampeningFactor;
            that.player.vel.Y *= that.physicsRules.dampeningFactor;

            var collisionInfo = verifyCollisionFloors();

            if (isPlayerFalling() && collisionInfo.hasCollided) {

                if (that.player.pos.Y + that.player.width < collisionInfo.floor.pos.Y + 10) {
                    that.player.vel.Y = 0;
                }
            }

            that.player.pos.X += that.player.vel.X;
            that.player.pos.Y += that.player.vel.Y;

            if (that.player.pos.Y > 660) {
                that.player.pos.Y = 660;
            }

            if (Keyboard.spaceClicked) {
                that.player.vel.Y = -10;
                that.assets.audio["jump"].play();
            }
        }

        function getItem() {
            var collisionInfo = verifyCollisionFloors();

            if (collisionInfo && collisionInfo.floor) {
                var floor = collisionInfo.floor;


                if (floor.type > 4) {
                    floor.type = FloorType.None;
                    floor.color = "transparent";
                    pandaMaps[floor.gameAreaId][floor.rowPos][floor.colPos] = FloorType.None;

                    that.assets.audio["item"].load();
                    that.assets.audio["item"].play();
                    that.flowers -= 1;
                }
            }
        }

        function isPlayerFalling() {
            var falling = false;

            var tempPosPlayer = new Vector2(that.player.vel.X, that.player.vel.Y);

            tempPosPlayer.Y += that.physicsRules.gravity;
            tempPosPlayer.Y *= that.physicsRules.dampeningFactor;

            var playerDir = tempPosPlayer.Y / Math.abs(tempPosPlayer.Y);

            if (playerDir > -1) {
                falling = true;
            }

            return falling;
        }

        function moveEnemys() {
            for (var indexArea in that.gameAreas) {
                var currArea = that.gameAreas[indexArea];

                for (var indexFloor in currArea.floors) {
                    var currFloor = currArea.floors[indexFloor];


                    if (currFloor.type == FloorType.Enemy) {
                        currFloor.pos.X += currFloor.dir.X;

                        currFloor.chamgeDirCounter -= 1;
                    }

                    if (currFloor.chamgeDirCounter < 1) {
                        currFloor.chamgeDirCounter = 40;
                        currFloor.dir.X *= -1;
                    }
                }
            }
        }

        function collisionEnemys() {
            var currAreaId = PandaGameUtil.getPlayerArea(that.player, that.gameAreas);
            var currArea = PandaGameUtil.getById({
                gameObjs: that.gameAreas,
                id: currAreaId
            });

            if (currArea) {
                for (var indexFloor in currArea.floors) {
                    var currFloor = currArea.floors[indexFloor];

                    if (currFloor.type == FloorType.Enemy) {
                        if (GameUtil.hasRectCollision(that.player, currFloor)) {
                            that.currState = PandaGameState.GameOver;
                            gameOver();
                        }
                    }
                }
            }
        }

        function drecreaseTime() {
            that.time -= 1 * 1 / 60;

            if (that.time < 1) {
                that.currState = PandaGameState.GameOver;
                that.sucess = false;
                gameOver();
            }
        }

        function sucessGame() {
            var currAreaId = PandaGameUtil.getPlayerArea(that.player, that.gameAreas);
            var currArea = PandaGameUtil.getById({
                gameObjs: that.gameAreas,
                id: currAreaId
            });

            if (currArea) {
                for (var indexFloor in currArea.floors) {
                    var currFloor = currArea.floors[indexFloor];

                    if (currFloor.type == FloorType.GirlPanda) {
                        if (GameUtil.hasRectCollision(that.player, currFloor) && that.flowers < 1) {
                            that.sucess = true;
                            that.currState = PandaGameState.GameOver;
                            gameOver();
                        }
                    }
                }
            }
        }
    }

    function gameOver() {

        that.assets.audio["level-theme"].pause();

        if (that.sucess) {
            that.assets.audio["intro"].play();
        } else {
            that.assets.audio["game-over"].play();
        }
    }
};

PandaGame.draw = function(printer) {
    var that = this;

	printer.drawRect({
        active: true,
        pos: new Vector2(0, 0),
        width: 1024,
        height: 768,
        color: "black"
    });
	
    switch (that.currState) {
        case PandaGameState.InGame:
            inGame();
            break;
        case PandaGameState.GameOver:
            gameOver();
            break;
    }

    function inGame() {


        GameUtil.drawGameObjects({
            gameObjs: that.gameAreas,
            printer: printer
        });

        for (var indexArea in that.gameAreas) {
            var currArea = that.gameAreas[indexArea];

            GameUtil.drawGameObjects({
                gameObjs: currArea.floors,
                printer: printer
            });
        }

        printer.drawImage({
            pos: that.player.pos,
            origin: new Vector2(0, 0),
            image: that.assets.img["panda1"]
        });

        var area2 = PandaGameUtil.getById({
            gameObjs: that.gameAreas,
            id: "area-2"
        });

        console.log(area2.floors[48]);


        printer.drawImage({
            pos: area2.floors[50].pos,
            origin: new Vector2(0, 0),
            image: that.assets.img["pandaFemea"]
        });

        printer.drawText({
            content: "Tempo: " + Math.floor(that.time),
            font: "30px Segoe UI",
            pos: new Vector2(10, 120),
            color: "#000",
            textBaseLine: "top",
        });
    }


    function gameOver() {

        if (that.sucess) {
            printer.drawImage({
                pos: new Vector2(0, 0),
                origin: new Vector2(0, 0),
                image: that.assets.img["sucess"]
            });
        } else {
            printer.drawImage({
                pos: new Vector2(0, 0),
                origin: new Vector2(0, 0),
                image: that.assets.img["fail"]
            });
        }
    }
};
