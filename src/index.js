
import Phaser from "phaser";
import MainScene from "./Scenes/main-scene";

const GLOBAL_CONFIG = {
  width: 800,
  height: 600,
};

const config = {
  type: Phaser.AUTO,
  ...GLOBAL_CONFIG,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    }
  },
  scene: [new MainScene(GLOBAL_CONFIG)]
};

new Phaser.Game(config);

