import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.audio("nyancat", ["assets/nyancat.ogg", "assets/nyancat.mp3"]);
    this.load.image("pause", "assets/pause-button.png");
    this.load.audio("flap", ["assets/flap.ogg", "assets/flap.mp3"]);
    this.load.image("pipe", "assets/pinkpipe.png");
    this.load.spritesheet("bird", "assets/nyancat(w81h38).png", {
      frameWidth: 81,
      frameHeight: 38,
      endFrame: 2,
    });
  }

  create() {
    this.scene.start("MenuScene");
  }
}

export default PreloadScene;
