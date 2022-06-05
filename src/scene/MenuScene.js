import Phaser from "phaser";

class MenuScene extends Phaser.Scene {
  constructor(config) {
    super("MenuScene");
    this.config = config;
  }
  createBG() {
    this.add.image(0, 0, "sky").setOrigin(0, 0).setScale(0.7);
  }

  create() {
    this.createBG();
    this.scene.start("PlayScene");
  }
}

export default MenuScene;
