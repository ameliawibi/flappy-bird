import Phaser from "phaser";
/*const axios = require("axios");

axios
  .get("https://restcountries.com/v3.1/name/peru")
  .then((res) => {
    //console.log(res);
    const canvas = document.getElementById("canvas");
    const text = document.createElement("p");
    text.innerText = "Flappy";
    canvas.appendChild(text);
  })
  .catch((error) => {
    // handle error
    //console.log(error);
  });
*/

const config = {
  //WebGL
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  //interaction of object
  parent: "canvas",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scene: {
    preload: preload, // or just preload
    create,
    update,
  },
};

let game = new Phaser.Game(config);
let bird = null;
let pipes = null;
const pipeVerticalDistanceRange = [100, 250];
const pipeHorizontalDistanceRange = [300, 500];

const PIPES_TO_RENDER = 4;

const VELOCITY = 200;
let flapVelocity = 100;
let moveVelocity = -150;
const initialBirdPosition = { x: config.width / 20, y: config.height / 2 };

//loading assets, such as images, music, animations
function preload() {
  //debugger;
  this.load.image("sky", "assets/sky.png");
  //this.load.image("bird", "assets/bird.png");
  this.load.image("pipe", "assets/pipe.png");
  this.load.spritesheet("bird", "assets/nyancat(w81h38).png", {
    frameWidth: 81,
    frameHeight: 38,
    endFrame: 2,
  });
}

function create() {
  //debugger;
  //this.add.image(config.width / 2, config.height / 2, "sky");
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
  //this.add.sprite(config.width / 2, config.height / 2, "bird").setOrigin(0);
  bird = this.physics.add
    .sprite(initialBirdPosition.x, initialBirdPosition.y, "bird")
    .setFlipX(false)
    .setOrigin(0)
    .play("flap");

  bird.setCollideWorldBounds(true);
  bird.body.gravity.y = 200; //200 pixels per second with acceleration
  //bird.body.velocity.x = moveVelocity; //no acceleration
  //console.log(bird.body);
  pipes = this.physics.add.group();

  for (let i = 0; i < PIPES_TO_RENDER; i++) {
    const upperPipe = pipes.create(0, 0, "pipe").setOrigin(0, 1);
    const lowerPipe = pipes.create(0, 0, "pipe").setOrigin(0, 0);
    placePipe(upperPipe, lowerPipe);
  }

  pipes.setVelocityX(moveVelocity);

  this.input.on("pointerdown", flap);
  this.input.keyboard.on("keydown_SPACE", flap);
}

//60fps
//60 * 16ms = 1000ms
function update(time, delta) {
  //console.log(time, delta);
  //console.log(bird.body.velocity.y);
  /*  if (bird.x >= config.width - bird.width) {
    bird.body.velocity.x = -moveVelocity;
  } else if (bird.x <= 0) {
    bird.body.velocity.x = moveVelocity;
  }
*/

  if (bird.y <= 0 || bird.y >= config.height - bird.height) {
    restartPosition();
  }
  recyclePipes();
}

function placePipe(uPipe, lPipe) {
  const rightMostX = getRightMostPipePosition();
  let pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);
  let pipeVerticalPosition = Phaser.Math.Between(
    0 + 20,
    config.height - 20 - pipeVerticalDistance
  );
  let pipeHorizontalDistance = Phaser.Math.Between(
    ...pipeHorizontalDistanceRange
  );
  /*upperPipe = this.physics.add
    .sprite(pipeHorizontalDistance, pipeVerticalPosition, "pipe")
    .setOrigin(0, 1);
  lowerPipe = this.physics.add
    .sprite(upperPipe.x, upperPipe.y + pipeVerticalDistance, "pipe")
    .setOrigin(0, 0);
  */
  uPipe.x = rightMostX + pipeHorizontalDistance;
  uPipe.y = pipeVerticalPosition;
  lPipe.x = uPipe.x;
  lPipe.y = uPipe.y + pipeVerticalDistance;

  //uPipe.body.velocity.x = -150;
  //lPipe.body.velocity.x = -150;
}

function recyclePipes() {
  const tempPipes = [];
  pipes.getChildren().forEach(function (pipe) {
    if (pipe.getBounds().right <= 0) {
      tempPipes.push(pipe);
      if (tempPipes.length === 2) {
        placePipe(...tempPipes);
      }
    }
  });
}

function getRightMostPipePosition() {
  let rightMostX = 0;
  pipes.getChildren().forEach(function (pipe) {
    rightMostX = Math.max(pipe.x, rightMostX);
  });
  return rightMostX;
}

function restartPosition() {
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
}

function flap() {
  bird.body.velocity.y = -flapVelocity;
}
