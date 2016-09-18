"use strict";

function Player(config) {
    GameObject.call(this, config);
    this.vel = new Vector2(0, 0);
}