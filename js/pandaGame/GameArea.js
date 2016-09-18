"use strict";

function GameArea(config) {
    this.prevId = config.prevId;
    this.nextId = config.nextId;
    this.floors = config.floors;
    GameObject.call(this, config);
}