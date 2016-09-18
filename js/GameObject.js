"use scrict";

function GameObject(config) {
    this.id = config.id;
    this.active = config.active;
    this.pos = new Vector2(config.pos.X, config.pos.Y);
    this.width = config.width;
    this.height = config.height;
    this.color = config.color;
    this.image = config.image;
};