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
    this.load.audio("nyancat", ["assets/nyancat.ogg", "assets/nyancat.mp3"]);
    this.load.audio("flap", ["assets/flap.ogg", "assets/flap.mp3"]);
    this.load.image("pipe", "assets/pinkpipe.png");
    this.load.spritesheet("bird", "assets/nyancat(w81h38).png", {
      frameWidth: 81,
      frameHeight: 38,
      endFrame: 2,
    });
  }

  create() {
    this.createBG();
    this.createBird();
    this.createPipes();
    this.createColliders();
    this.handleInputs();
  }

  update() {
    this.checkGameStatus();
    this.recyclePipes();
  }

  checkGameStatus() {
    if (
      this.bird.y <= 0 ||
      this.bird.getBounds().bottom >= this.config.height
    ) {
      this.gameOver();
    }
  }

  createBG() {
    this.add.image(0, 0, "sky").setOrigin(0, 0).setScale(0.7);
    this.music = this.sound.add("nyancat");
    //this.music.play();
  }

  createBird() {
    var anim_config = {
      key: "flap",
      frames: this.anims.generateFrameNumbers("bird", {
        start: 0,
        end: 2,
        first: 0,
      }),
      frameRate: 10,
      repeat: -1,
    };
    this.flapSound = this.sound.add("flap");

    this.anims.create(anim_config);
    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "bird")
      .setFlipX(false)
      .setOrigin(0)
      .setBodySize(50, 38)
      .setOffset(31, 0)
      .play("flap");

    this.bird.body.gravity.y = 200; //200 pixels per second with acceleration
    this.bird.setCollideWorldBounds(true);
  }

  createPipes() {
    this.pipes = this.physics.add.group();
    for (let i = 0; i < PIPES_TO_RENDER; i++) {
      const upperPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setFlipY(true)
        .setOrigin(0, 1);
      const lowerPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 0);
      this.placePipe(upperPipe, lowerPipe);
    }

    this.pipes.setVelocityX(this.moveVelocity);
  }

  createColliders() {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
  }
  handleInputs() {
    this.input.on("pointerdown", this.flap, this);
    this.input.keyboard.on("keydown_P", this.flap, this);
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

  gameOver() {
    this.physics.pause();
    this.bird.setTint(0xff0000);
    this.music.pause();
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
      },
      loop: false,
    });
  }

  flap() {
    this.bird.body.velocity.y = -this.flapVelocity;
    this.flapSound.play();
  }
}

export default PlayScene;
