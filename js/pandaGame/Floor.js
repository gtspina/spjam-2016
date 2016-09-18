"use strict";

var FloorType = {None: 0, Floor1: 1, Floor2: 2, Enemy: 3, GirlPanda: 4, Flower: 5};

function Floor(config) {
    GameObject.call(this, config);
    this.type = config.type;
    this.colPos = config.colPos;
    this.rowPos = config.rowPos;
    this.gameAreaId = config.gameAreaId;
};