"use strict";

function AssetsLoader(config) {
    this.assets = config.assets;
    this.game = config.game;
    this.nextScene = config.nextScene;
    this.assetsLoading = 0;
    this.percentage = 0;
    this.percentageByAssetLoaded = 100 / config.assets.length;

    this.bgImage = new Image();
}

AssetsLoader.prototype.init = function () {
    var that = this;

    console.log("Carregando...");

    that.assets.forEach(function (asset) {

        that.assetsLoading += 1;

        onloadedmetadata

        switch (asset.type) {
            case Image:
                that.nextScene.assets.img[asset.name] = new Image();
                that.nextScene.assets.img[asset.name].src = baseFolder.img + asset.localName;
                that.nextScene.assets.img[asset.name].onload = function () {
                    that.percentage += that.percentageByAssetLoaded;
                    console.log("Asset", asset.name, "pronto!", Math.floor(that.percentage) + "%");
                    that.assetsLoading -= 1;
                };
                break;


            case Audio:
                that.nextScene.assets.audio[asset.name] = new Audio();
                that.nextScene.assets.audio[asset.name].src = baseFolder.audio + asset.localName;
                that.nextScene.assets.audio[asset.name].onloadedmetadata = function () {
                    that.percentage += that.percentageByAssetLoaded;
                    console.log("Asset", asset.name, "pronto!", Math.floor(that.percentage) + "%");
                    that.assetsLoading -= 1;
                };
                break;
        }

    });

    function loadedAsset() {

    }
};

AssetsLoader.prototype.update = function () {
    var that = this;

    if (that.assetsLoading < 1) {
        that.nextScene.init();
        that.game.gameScene = that.nextScene;
    }
};

AssetsLoader.prototype.draw = function (canvas) {
    var that = this;

    canvas.drawText({
        content: "Carregando... " + Math.floor(that.percentage) + "%",
        font: "30px Segoe UI",
        pos: new Vector2(10, 120),
        color: "white",
        textBaseLine: "top",
    });
};
