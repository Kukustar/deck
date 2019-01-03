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

function getHalfPosition(row, col){
    const posX = (col + 1) + 265 * (col + 0.5);
    const posY = (row + 1) + 180 * (row + 0.5);

    return new Phaser.Geom.Point(posX, posY);
}

function firstRowPositions(row, col){
    const posX = (col + 1) + 200 * (col + 0.5) + 100;
    const posY = (row + 1) + 180 * (row + 0.5);

    return new Phaser.Geom.Point(posX, posY);
}

function getTitlePosition(row, col) {
    const posX = gameOptions.titleSpacing * (col + 1) + gameOptions.titleSize * (col + 0.5);
    const posY = gameOptions.titleSpacing * (row + 1) + 180 * (row + 0.5);

    return new Phaser.Geom.Point(posX, posY);
}

function getThirdPosition2(row, col){
    const posX = 1 * (col + 1) + 200 * (col + 0.5) - 110;
    const posY = 1 * (row + 1) + 180 * (row + 0.5);

    return new Phaser.Geom.Point(posX, posY);
}

function getThirdPosition(row, col){
    const posX = 1 * (col + 1) + 125 * (col + 0.5);
    const posY = 1 * (row + 1) + 180 * (row + 0.5);

    return new Phaser.Geom.Point(posX, posY);
}

const gameBoardMatrix = {
    firstRow: {
        colIndexes: [1,2,3,4],
        otherElements: firstRowPositions,
        firstElement: getHalfPosition,
    },

    secondRow: {
        colIndexes: [1,2,3,4,5],
        otherElements: getTitlePosition,
        firstElement: null,
    },

    thirdRow: {
        colIndexes: [1,2,3,4,5,6],
        otherElements: getThirdPosition2,
        firstElement: getThirdPosition

    },
    fourthRow: {
        colIndexes: [0,1,2,3,4,5,6],
        otherElements: getTitlePosition,
        firstElement: null,
    },
    rows: {
        1: 'firstRow',
        2: 'secondRow',
        3: 'thirdRow',
        4: 'fourthRow',
        5: 'thirdRow',
        6: 'secondRow',
        7: 'firstRow'
    }
};

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

        this.classFunctionForRenderRow(1, gameBoardMatrix.firstRow, self);
        this.classFunctionForRenderRow(2, gameBoardMatrix.secondRow, self);
        this.classFunctionForRenderRow(3, gameBoardMatrix.thirdRow, self);
        this.classFunctionForRenderRow(4,gameBoardMatrix.fourthRow, self);
        this.classFunctionForRenderRow(5, gameBoardMatrix.thirdRow, self);
        this.classFunctionForRenderRow(6, gameBoardMatrix.secondRow, self);
        this.classFunctionForRenderRow(7, gameBoardMatrix.firstRow, self);

    }

    classFunctionForRenderRow(rowStart, rowObject, self){
        console.info('classFunctionForRenderRow', rowStart, rowObject);
        playGame.boardArray[rowStart] = [];
        rowObject.colIndexes.forEach(colIndex =>{
            let position;
            console.info(colIndex)
            if (rowObject.firstElement && colIndex === 1) {
                position = rowObject.firstElement(rowStart, colIndex);
            } else position = rowObject.otherElements(rowStart, colIndex);

            const image = self.add.image(position.x, position.y, mainImage).setInteractive();

            image.on('pointerdown', () => playGame.addNewSprite(rowStart, colIndex, playGame.addSpriteState));

            const tile = self.add.sprite(position.x, position.y, 'plants', 0).setInteractive();

            tile.visible = false;

            playGame.boardArray[rowStart][colIndex] = {
                tileValue: 0,
                tileSprite: tile
            }
            console.info('gameBoardState', playGame.boardArray)
        })
    }

    renderSettings(self) {
        [1, 2, 3].forEach(frameNumber => {
            const position = getTitlePosition(0, frameNumber - 1);
            self.add.image(position.x, position.y, mainImage);
            const tile = self.add.sprite(position.x, position.y, 'plants', frameNumber).setInteractive();
            tile.on('pointerdown', () => playGame.prepareToAddNewSprite(frameNumber));
        });

    }

    static prepareToAddNewSprite(frame){
        playGame.addSpriteState = frame;
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
                        gameBoardMatrix.firstRow.colIndexes.forEach(index =>{
                            const tmpKey = 'a' + counter;
                            board[tmpKey] = playGame.boardArray[i][index].tileValue;
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
