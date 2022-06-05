import BaseScene from "./BaseScene";

class ScoreScene extends BaseScene {
  constructor(config) {
    super("ScoreScene", { ...config, canGoBack: true });
  }

  create() {
    super.create();
    this.createScore();
  }

  createScore() {
    const bestScore = localStorage.getItem("bestScore");
    this.add
      .text(
        ...this.screenCenter,
        `Best score: ${bestScore || 0}`,
        this.fontOptions
      )
      .setOrigin(0.5);
  }
}

export default ScoreScene;
