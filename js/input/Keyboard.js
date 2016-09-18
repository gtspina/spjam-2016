"use strict";

var Keys = {
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    space: 32,
    enter: 13,
};

var Keyboard = {
    id: "keyboard",
    leftPressed: false,
    rightPressed: false,
    spacePressed: false,
    spaceClicked: false
};

Keyboard.init = function() {
    var that = this;

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    function handleKeyDown(evt) {

        if (evt.keyCode == Keys.left) {
            that.leftPressed = true;
        }

        if (evt.keyCode == Keys.right) {
            that.rightPressed = true;
        }

        if (evt.keyCode == Keys.space) {
            if (!that.spacePressed) {
                that.spaceClicked = true;
            }

            that.spacePressed = true;
        }
    }

    function handleKeyUp(evt) {

        if (evt.keyCode == Keys.left) {
            that.leftPressed = false;
        }

        if (evt.keyCode == Keys.right) {
            that.rightPressed = false;
        }

        if (evt.keyCode == Keys.space) {
            that.spacePressed = false;
        }

    }
};

Keyboard.update = function() {};

Keyboard.reset = function() {
    var that = this;

    that.spaceClicked = false;
};
