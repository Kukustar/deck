import Phaser from 'phaser';
import emptytile from '../../assets/emptytile.png';
import tiles from '../../assets/tiles.png';
import gameOptions from '../game-settings/game-options';

export default class bootGame extends Phaser.Scene {
  constructor() {
    super('bootGame');
  }

  preload() {
    this.load.image('emptytyle', emptytile);
    this.load.spritesheet('tiles', tiles, {
      frameWidth: gameOptions.titleSize,
      frameHeight: gameOptions.titleSize,
    });
  }

  create() {
    this.scene.start('PlayGame');
  }
}
