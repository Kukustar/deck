import Phaser from 'phaser';
import gameOptions from '../game-settings/game-options';
import {Socket} from 'phoenix';

export default class playGame extends Phaser.Scene {
  constructor() {
    super('PlayGame');
  }
  create() {
    playGame.socket = new Socket('ws://localhost:4000/socket');
    playGame.socket.connect();
    playGame.channel = playGame.socket.channel('deck:main', {});
    playGame.channel.on('new_msg', (event) => playGame.renderNewGameBoardState(event));
    playGame.channel.join();

    playGame.boardArray = [];
    for (let i = 0; i < gameOptions.boardSize.rows; i++) {
      playGame.boardArray[i] = [];
      for (let j = 0; j < gameOptions.boardSize.cols; j++) {
        const position = playGame.getTitlePosition(i, j);
        const image = this.add.image(position.x, position.y, 'emptytyle')

            .setInteractive();
        image.on('pointerdown', () => playGame.addNewSprite(i, j));

        const tile = this.add.sprite(position.x, position.y, 'tiles', 2)
            .setInteractive();

        tile.visible = false;

        playGame.boardArray[i][j] = {
          tileValue: 0,
          tileSprite: tile,
        };
      }
    }
  }

  static getTitlePosition(row, col) {
    const posX = gameOptions.titleSpacing * (col + 1) + gameOptions.titleSize *
            (col + 0.5);
    const posY = gameOptions.titleSpacing * (row + 1) + gameOptions.titleSize *
            (row + 0.5);

    return new Phaser.Geom.Point(posX, posY);
  }
  static renderNewGameBoardState(event){
    console.info(event.body);
    const boardState = JSON.parse(event.body);
    console.info(typeof(boardState));

    const orderedBoardState = {};
    Object.keys(boardState).sort().forEach(key => orderedBoardState[key] = boardState[key]);

    for (let [key, value] of Object.entries(orderedBoardState)){
      console.info(key, value);
    }
  }

  static renderNewObject(i, j) {
    playGame.boardArray[i][j].tileValue = 2;
    playGame.boardArray[i][j].tileSprite.visible = true;
    playGame.boardArray[i][j].tileSprite.setFrame(2);
  }

  static addNewSprite(i, j) {
    playGame.renderNewObject(i,j);

    const board = {};
    let counter = 0;

    for (let i = 0; i < gameOptions.boardSize.rows; i++) {
      for (let j = 0; j < gameOptions.boardSize.cols; j++) {
        counter += 1;
        const tmpKey = 'a' + counter;
        console.info(tmpKey);
        board[tmpKey] = playGame.boardArray[i][j].tileValue;
      }
    }

    const msg = {body: JSON.stringify(board)};

    playGame.channel.push('new_msg', msg);
  }
}
