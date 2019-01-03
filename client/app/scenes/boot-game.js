import Phaser from 'phaser';
import emptytile from '../../assets/emptytile.png';
import plant from '../../assets/plant.png'
import tiles from '../../assets/tiles.png';
import tree from '../../assets/tree.png';
import bigTree from '../../assets/big-tree.png';
import plants from '../../assets/css_sprites.png';
import halfEmptyTile from '../../assets/half-emptytile.png';


import gameOptions from '../game-settings/game-options';

export default class bootGame extends Phaser.Scene {
  constructor() {
    super('bootGame');
  }

  preload() {
    this.load.image('emptytyle', emptytile);
    this.load.image('half-emptytile', halfEmptyTile);

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

  }

  create() {
    this.scene.start('PlayGame');
  }
}
