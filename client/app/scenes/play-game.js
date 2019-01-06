import Phaser from 'phaser';
// import gameOptions from '../game-settings/game-options';
import {Socket} from 'phoenix';
import GameBoard from '../game-board';
import gameBoardMatrix from '../game-board/game-board-matrix'


function connectToWebSockets(scene) {
    scene.socket = new Socket('ws://localhost:4000/socket');
    scene.socket.connect();
    scene.channel = scene.socket.channel('deck:main', {});
    scene.channel.on('new_msg', (event) => scene.renderNewGameBoardState(event));
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


    static addNewSprite(i, j, frame) {
        if(frame !== null){
            playGame.gameBoard.renderNewObject(i, j, frame, playGame);

            const board = this.readBoardState();

            const msg = {body: JSON.stringify(board)};

            playGame.channel.push('new_msg', msg);

        }
        playGame.addSpriteState = null;

    }

    static readBoardState() {
        const board = {};
        let counter = 0;

        //not read first row (it settings)
        counter += 1;

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
