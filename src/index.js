import 'phaser';

import { PopcornGame } from './scenes/popcorn-game';
import { StartScene } from './scenes/start';

export const gameState = {
  gameOver: false,
  score: 0,
}

export const gameConfig = {
  type: Phaser.AUTO,
  width: 450,
  height: 800,
  backgroundColor: "b9eaff",
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 800},
    },
  },
  scene: [StartScene, PopcornGame],
};

export const game = new Phaser.Game(gameConfig);
