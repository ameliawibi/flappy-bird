import Phaser from "phaser";
import PlayScene from "./scene/PlayScene";
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

const WIDTH = 800;
const HEIGHT = 600;
const BIRD_POSITION = { x: WIDTH / 10, y: HEIGHT / 2 };
const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION,
  parent: "canvas",
};

const config = {
  //WebGL
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scene: [new PlayScene(SHARED_CONFIG)],
};

new Phaser.Game(config);
