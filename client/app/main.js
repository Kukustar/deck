import Phaser from 'phaser';
import './style.css';
import gameConfig from './game-settings/game-config';
let game;

window.onload = function() {
  game = new Phaser.Game(gameConfig);
  window.focus();

  resizeGame();
  window.addEventListener('resize', resizeGame);
};

// TODO create and add resizeGame to some game-help lib
const resizeGame = () => {
  const canvas = document.querySelector('canvas');
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const windowRatio = windowWidth / windowHeight;
  const gameRatio = game.config.width / game.config.height;

  if (windowRatio < gameRatio) {
    canvas.style.width = windowWidth + 'px';
    canvas.style.height = (windowWidth / gameRatio ) + 'px';
  } else {
    canvas.style.width = (windowHeight * gameRatio) + 'px';
    canvas.style.height = windowHeight + 'px';
  }
};
