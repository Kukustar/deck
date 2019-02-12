import Phaser from 'phaser';
import emptytile from '../../assets/emptytile.png';
import plant from '../../assets/plant.png'
import tiles from '../../assets/tiles.png';
import tree from '../../assets/tree.png';
import bigTree from '../../assets/big-tree.png';
import plants from '../../assets/css_sprites.png';
import halfEmptyTile from '../../assets/half-emptytile.png';
import round from '../../assets/round.png';
import sun from '../../assets/sun.png';

import gameOptions from '../game-settings/game-options';

export default class bootGame extends Phaser.Scene {
  constructor() {
    super('bootGame');
  }

  preload() {
    let progressBar = this.add.graphics();
    let progressBox = this.add.graphics();

    progressBox.fillStyle(0x22222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    this.load.image('emptytyle', emptytile);
    this.load.image('half-emptytile', halfEmptyTile);
    this.load.image('round', round);

    this.load.spritesheet('tiles', tiles, {
      frameWidth: gameOptions.titleSize,
      frameHeight: gameOptions.titleSize,
    });
    this.load.spritesheet('plants', plants, {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet('plant', plant, {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.spritesheet('tree', tree, {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet('big-tree', bigTree, {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet('sun', sun, {
      frameWidth: 128,
      frameHeight: 128
    });

    this.load.on('progress', (value) => {
      console.info(value);
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });
    this.load.on('fileprogress', (file) => console.info(file.src));
    this.load.on('colmplete', () => console.info('complete'));

  }

  create() {
    this.scene.start('PlayGame');
  }
}
