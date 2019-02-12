import Phaser from 'phaser';
import {Socket} from 'phoenix';
import GameBoard from '../game-board';
import gameBoardMatrix from '../game-board/game-board-matrix'


function connectToWebSockets(scene) {
    scene.socket = new Socket('ws://localhost:4000/socket');
    scene.socket.connect();
    scene.channel = scene.socket.channel('deck:main', {});
    scene.channel.on('new_msg', (event) => scene.drawNewGameBoardState(event));
    scene.channel.join();
}


export default class playGame extends Phaser.Scene {
    constructor() {
        super('PlayGame');
    }

    create() {
        connectToWebSockets(playGame);
        const self = this;

        playGame.gameBoardMatrix = gameBoardMatrix;
        playGame.gameBoard = new GameBoard(self, playGame);
    }


    static parseKeBoardState(boardState) {
        const parsedBoardState = {};

        for (let [key, value] of Object.entries(boardState)) {
            parsedBoardState[key.slice(1, key.length)] = boardState[key];
        }

        return parsedBoardState;
    }

    static drawRow(key, value, counter, boardState, gameBoardRows) {
        gameBoardMatrix[value].colIndexes.forEach(colIndex => {
            if(boardState[counter] > 0){
                playGame.gameBoard.drawNewObject(key, colIndex, boardState[counter], playGame);
            }
            counter +=1;
        });
    }

    static drawNewGameBoardState(event) {
        const boardState = playGame.parseKeBoardState(JSON.parse(event.body));
        let counter = 1;
        playGame.gameBoardMatrix.rows.forEach(row => {
            for(let [key, value] of Object.entries(row)){
                gameBoardMatrix[value].colIndexes.forEach(col => {
                    if(boardState[counter] > 0) {
                        playGame.gameBoard.drawNewObject(key, col, boardState[counter], playGame);
                    }
                    counter +=1;
                });
            }
        });

    }

    static changeSunPosition(prevSunPosition){
        console.info('changeSunPosition', prevSunPosition +1);
        console.info(playGame.sunArray);
        playGame.sunArray[prevSunPosition].tileSprite.visible = false;
        playGame.sunArray[prevSunPosition + 1].tileSprite.visible = true;
        
        playGame.sunPosition = prevSunPosition + 1;
        
    }


    static addNewSprite(i, j, frame) {
        if(frame !== null){
            playGame.gameBoard.drawNewObject(i, j, frame, playGame);

            const board = this.readBoardState();

            const msg = {body: JSON.stringify(board)};

            playGame.channel.push('new_msg', msg);

        }
        playGame.addSpriteState = null;
        const prevSunPosition = playGame.sunPosition;

        playGame.changeSunPosition(prevSunPosition);

    }

    static readBoardState() {
        const board = {};
        let counter = 1;

        playGame.gameBoardMatrix.rows.forEach(row => {
            for(let [key, value] of Object.entries(row)){
                gameBoardMatrix[value].colIndexes.forEach(col => {
                    const tmpKey = 'a' + counter;

                    board[tmpKey] = playGame.boardArray[key][col].tileValue;
                    counter +=1;
                });
            }
        });

        return board;
    }
}
