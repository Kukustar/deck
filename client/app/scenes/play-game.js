import Phaser from 'phaser';
import gameOptions from '../game-settings/game-options';
import {Socket} from 'phoenix';

const mainImage = 'round';

function connectToWebSockets(copyPlayGame) {
    copyPlayGame.socket = new Socket('ws://localhost:4000/socket');
    copyPlayGame.socket.connect();
    copyPlayGame.channel = copyPlayGame.socket.channel('deck:main', {});
    copyPlayGame.channel.on('new_msg', (event) => copyPlayGame.renderNewGameBoardState(event));
    copyPlayGame.channel.join();
}

function preparePlayGameBoard(copyPlayGame) {
    copyPlayGame.boardArray = [];
    copyPlayGame.settingsArray = [];
    copyPlayGame.addSpriteState = null;
}


export default class playGame extends Phaser.Scene {
    constructor() {
        super('PlayGame');
    }

    create() {
        connectToWebSockets(playGame);

        preparePlayGameBoard(playGame);

        const self = this;
        this.renderGameBoard(self);

        this.renderSettings(self);
    }

    renderGameBoard(self) {
        this.renderRow(1, 1, 5, playGame.firstRowPositions, self, playGame.getHalfPosition);
        this.renderRow(2, 1, 6, playGame.getTitlePosition, self);
        this.renderRow(3, 1, 7, playGame.getThirdPosition2, self, playGame.getThirdPosition);
        this.renderRow(4, 0, gameOptions.boardSize.cols, playGame.getTitlePosition, self);
        this.renderRow(5, 1, 7, playGame.getThirdPosition2, self, playGame.getThirdPosition);
        this.renderRow(6, 1, 6, playGame.getTitlePosition, self);
        this.renderRow(7, 1, 5, playGame.firstRowPositions, self, playGame.getHalfPosition);

    }

    renderRow(rowStart, colStart, colEnd, positionFunction, self, firstCalc = null) {
        playGame.boardArray[rowStart] = [];
        for (let j = colStart; j < colEnd; j++) {
            let position;

            if (firstCalc && j === 1) {
                position = firstCalc(rowStart, j);
            } else position = positionFunction(rowStart, j);

            const image = self.add.image(position.x, position.y, mainImage).setInteractive();

            image.on('pointerdown', () => playGame.addNewSprite(rowStart, j, playGame.addSpriteState));

            const tile = self.add.sprite(position.x, position.y, 'plants', 0).setInteractive();

            tile.visible = false;

            playGame.boardArray[rowStart][j] = {
                tileValue: 0,
                tileSprite: tile,
            }
        }
    }

    renderSettings(self) {
        [1, 2, 3].forEach(frameNumber => {
            const position = playGame.getTitlePosition(0, frameNumber - 1);
            self.add.image(position.x, position.y, mainImage);
            const tile = self.add.sprite(position.x, position.y, 'plants', frameNumber).setInteractive();
            tile.on('pointerdown', () => playGame.prepareToAddNewSprite(frameNumber));
        });

    }

    static prepareToAddNewSprite(frame){
        playGame.addSpriteState = frame;
    }

    static firstRowPositions(row, col){
        const posX = 1 * (col + 1) + 200 * (col + 0.5) + 100;
        const posY = 1 * (row + 1) + 180 * (row + 0.5);

        return new Phaser.Geom.Point(posX, posY);
    }

    static getThirdPosition2(row, col){
        const posX = 1 * (col + 1) + 200 * (col + 0.5) - 110;
        const posY = 1 * (row + 1) + 180 * (row + 0.5);

        return new Phaser.Geom.Point(posX, posY);
    }

    static getThirdPosition(row, col){
        const posX = 1 * (col + 1) + 125 * (col + 0.5);
        const posY = 1 * (row + 1) + 180 * (row + 0.5);

        return new Phaser.Geom.Point(posX, posY);
    }

    static getHalfPosition(row, col){
        const posX = 1 * (col + 1) + 265 * (col + 0.5);
        const posY = 1 * (row + 1) + 180 * (row + 0.5);

        return new Phaser.Geom.Point(posX, posY);
    }

    static getTitlePosition(row, col) {
        const posX = gameOptions.titleSpacing * (col + 1) + gameOptions.titleSize * (col + 0.5);
        const posY = gameOptions.titleSpacing * (row + 1) + 180 * (row + 0.5);

        return new Phaser.Geom.Point(posX, posY);
    }

    static parseKeBoardState(boardState) {
        const parsedBoardState = {};

        for (let [key, value] of Object.entries(boardState)) {
            parsedBoardState[key.slice(1, key.length)] = boardState[key];
        }

        return parsedBoardState;
    }

    static renderNewGameBoardState(event) {
        const boardState = playGame.parseKeBoardState(JSON.parse(event.body));
        let counter = 0;
        console.info(boardState);

        // for (let i = 1; i < gameOptions.boardSize.rows; i++) {
        //     for (let j = 0; j < gameOptions.boardSize.cols; j++) {
        //         if(boardState[counter] > 0){
        //             playGame.renderNewObject(i,j, boardState[counter]);
        //         }
        //         counter+=1;
        //     }
        //
        // }
    }

    static renderNewObject(i, j, frame) {
        playGame.boardArray[i][j].tileValue = frame;
        playGame.boardArray[i][j].tileSprite.visible = true;
        playGame.boardArray[i][j].tileSprite.setFrame(frame);
    }

    static addNewSprite(i, j, frame) {
        if(frame !== null){
            playGame.renderNewObject(i, j, frame);

            const board = {};
            let counter = 0;
            counter +=1;
            for(let i = 1; i < gameOptions.boardSize.rows; i ++){
                switch (i) {
                    case 1:
                        [1,2,3,4].forEach(colsNumber => {
                            const tmpKey = 'a' + counter;
                            board[tmpKey] = playGame.boardArray[i][colsNumber].tileValue;
                            counter += 1;
                        });
                        break;
                    case 2:
                        [1,2,3,4,5].forEach(colsNumber =>{
                            const tmpKey = 'a' + counter;
                            board[tmpKey] = playGame.boardArray[i][colsNumber].tileValue;
                            counter += 1;
                        });
                        break;
                    case 3:
                        [1,2,3,4,5,6].forEach(colsNumber =>{
                            const tmpKey = 'a' + counter;
                            board[tmpKey] = playGame.boardArray[i][colsNumber].tileValue;
                            counter += 1;
                        });
                        break;
                    case 4:
                        [0,1,2,3,4,5,6].forEach(colsNumber =>{
                            const tmpKey = 'a' + counter;
                            board[tmpKey] = playGame.boardArray[i][colsNumber].tileValue;
                            counter += 1;
                        });
                        break;
                    case 5:
                        [1,2,3,4,5,6].forEach(colsNumber =>{
                            const tmpKey = 'a' + counter;
                            board[tmpKey] = playGame.boardArray[i][colsNumber].tileValue;
                            counter += 1;
                        });
                        break;
                    case 6:
                        [1,2,3,4,5].forEach(colsNumber =>{
                            const tmpKey = 'a' + counter;
                            board[tmpKey] = playGame.boardArray[i][colsNumber].tileValue;
                            counter += 1;
                        });
                        break;
                    case 7:
                        [1,2,3,4].forEach(colsNumber =>{
                            const tmpKey = 'a' + counter;
                            board[tmpKey] = playGame.boardArray[i][colsNumber].tileValue;
                            counter += 1;
                        });
                        break;
                }
            }

            const msg = {body: JSON.stringify(board)};

            playGame.channel.push('new_msg', msg);

        }
        playGame.addSpriteState = null;

    }
}
