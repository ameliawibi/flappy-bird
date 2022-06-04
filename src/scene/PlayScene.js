import Phaser from "phaser";

const PIPES_TO_RENDER = 4;

class PlayScene extends Phaser.Scene {
  constructor(config) {
    super("PlayScene");
    this.config = config;
    this.bird = null;
    this.pipes = null;
    this.flapVelocity = 150;
    this.moveVelocity = -150;
    this.pipeVerticalDistanceRange = [100, 250];
    this.pipeHorizontalDistanceRange = [300, 500];
  }

  preload() {
    //debugger;
    this.load.image("sky", "assets/sky.png");
    this.load.image("pipe", "assets/pipe.png");
    this.load.spritesheet("bird", "assets/nyancat(w81h38).png", {
      frameWidth: 81,
      frameHeight: 38,
      endFrame: 2,
    });
  }

  create() {
    this.add.image(0, 0, "sky").setOrigin(0, 0);
    var config2 = {
      key: "flap",
      frames: this.anims.generateFrameNumbers("bird", {
        start: 0,
        end: 2,
        first: 0,
      }),
      frameRate: 10,
      repeat: -1,
    };

    this.anims.create(config2);
    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "bird")
      .setFlipX(false)
      .setOrigin(0)
      .play("flap");

    this.bird.setCollideWorldBounds(true);
    this.bird.body.gravity.y = 200; //200 pixels per second with acceleration

    this.pipes = this.physics.add.group();
    for (let i = 0; i < PIPES_TO_RENDER; i++) {
      const upperPipe = this.pipes.create(0, 0, "pipe").setOrigin(0, 1);
      const lowerPipe = this.pipes.create(0, 0, "pipe").setOrigin(0, 0);
      this.placePipe(upperPipe, lowerPipe);
    }

    this.pipes.setVelocityX(this.moveVelocity);

    this.input.on("pointerdown", this.flap, this);
    this.input.keyboard.on("keydown_SPACE", this.flap, this);
  }

  update() {
    if (
      this.bird.y <= 0 ||
      this.bird.y >= this.config.height - this.bird.height
    ) {
      this.restartPosition();
    }
    this.recyclePipes();
  }

  placePipe(uPipe, lPipe) {
    const rightMostX = this.getRightMostPipePosition();
    let pipeVerticalDistance = Phaser.Math.Between(
      ...this.pipeVerticalDistanceRange
    );
    let pipeVerticalPosition = Phaser.Math.Between(
      0 + 20,
      this.config.height - 20 - pipeVerticalDistance
    );
    let pipeHorizontalDistance = Phaser.Math.Between(
      ...this.pipeHorizontalDistanceRange
    );

    uPipe.x = rightMostX + pipeHorizontalDistance;
    uPipe.y = pipeVerticalPosition;
    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeVerticalDistance;
  }

  recyclePipes() {
    const tempPipes = [];
    this.pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right <= 0) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this.placePipe(...tempPipes);
        }
      }
    });
  }

  getRightMostPipePosition() {
    let rightMostX = 0;
    this.pipes.getChildren().forEach(function (pipe) {
      rightMostX = Math.max(pipe.x, rightMostX);
    });
    return rightMostX;
  }

  restartPosition() {
    this.bird.x = this.config.startPosition.x;
    this.bird.y = this.config.startPosition.y;
  }

  flap() {
    this.bird.body.velocity.y = -this.flapVelocity;
  }
}

export default PlayScene;
