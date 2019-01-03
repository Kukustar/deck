import Phaser from 'phaser';
import gameOptions from '../game-settings/game-options';
import {Socket} from 'phoenix';

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
        this.renderFirstRow(self, 1);
        this.renderSecondRow(self, 2);
        this.renderThirdRow(self, 3);
        this.renderFiveRow(self);
        this.renderThirdRow(self, 5);
        this.renderSecondRow(self, 6);
        this.renderFirstRow(self, 7);

    }

    renderFiveRow(self){
        playGame.boardArray[4] = [];
        for (let i = 4; i < 5; i++) {

            for (let j = 0; j < gameOptions.boardSize.cols; j++) {
                const position = playGame.getTitlePosition(i, j);
                const image = self.add.image(position.x, position.y, 'emptytyle')
                    .setInteractive();

                image.on('pointerdown', () => playGame.addNewSprite(i, j, playGame.addSpriteState));

                const tile = self.add.sprite(position.x, position.y, 'plants', 0)
                    .setInteractive();

                tile.visible = false;

                playGame.boardArray[i][j] = {
                    tileValue: 0,
                    tileSprite: tile,
                };
            }
        }
    }

    renderThirdRow(self, rowNumber){
        playGame.boardArray[rowNumber] = [];
        const position = playGame.getThirdPosition(rowNumber, 1);
        const image = self.add.image(position.x, position.y, 'emptytyle')
            .setInteractive();

        image.on('pointerdown', () => playGame.addNewSprite(rowNumber, 1, playGame.addSpriteState));

        const tile = self.add.sprite(position.x, position.y, 'plants', 0)
            .setInteractive();

        tile.visible = false;

        playGame.boardArray[rowNumber][1] = {
            tileValue: 0,
            tileSprite: tile,
        };

        for (let i = rowNumber; i < rowNumber + 1; i++) {

            for (let j = 2; j < 7; j++) {
                const position = playGame.getThirdPosition2(i, j);
                const image = self.add.image(position.x, position.y, 'emptytyle')
                    .setInteractive();

                image.on('pointerdown', () => playGame.addNewSprite(i, j, playGame.addSpriteState));

                const tile = self.add.sprite(position.x, position.y, 'plants', 0)
                    .setInteractive();

                tile.visible = false;

                playGame.boardArray[i][j] = {
                    tileValue: 0,
                    tileSprite: tile,
                };
            }
        }

    }


    renderSecondRow(self, rowNumber){
        for (let i = rowNumber; i < rowNumber + 1; i++) {
            playGame.boardArray[i] = [];

            for (let j = 1; j < 6; j++) {
                const position = playGame.getTitlePosition(i, j);
                const image = self.add.image(position.x, position.y, 'emptytyle')
                    .setInteractive();

                image.on('pointerdown', () => playGame.addNewSprite(i, j, playGame.addSpriteState));

                const tile = self.add.sprite(position.x, position.y, 'plants', 0)
                    .setInteractive();

                tile.visible = false;

                playGame.boardArray[i][j] = {
                    tileValue: 0,
                    tileSprite: tile,
                };
            }
        }
    }

    renderFirstRow(self, rowNumber) {
        playGame.boardArray[rowNumber] = [];
        let position = playGame.getHalfPosition(rowNumber, 1);
        const image2 = self.add.image(position.x, position.y, 'emptytyle').setInteractive();
        image2.on('pointerdown', () => playGame.addNewSprite(1, 1, playGame.addSpriteState));

        const tile = self.add.sprite(position.x, position.y, 'plants', 0)
            .setInteractive();

        tile.visible = false;

        playGame.boardArray[rowNumber][1] = {
            tileValue: 0,
            tileSprite: tile,
        };

        [2, 3, 4].forEach(colNumber => {
            const position = playGame.firstRowPositions(rowNumber, colNumber);
            const image = self.add.image(position.x, position.y, 'emptytyle').setInteractive();

            image.on('pointerdown', () => playGame.addNewSprite(rowNumber, colNumber, playGame.addSpriteState));

            const tile = self.add.sprite(position.x, position.y, 'plants', 0)
                .setInteractive();

            tile.visible = false;
            playGame.boardArray[rowNumber][colNumber] = {
                tileValue: 0,
                tileSprite: tile,
            };
        })

    }

    renderSettings(self) {
        [1, 2, 3].forEach(frameNumber => {
            const position = playGame.getTitlePosition(0, frameNumber - 1);
            self.add.image(position.x, position.y, 'emptytyle');
            const tile = self.add.sprite(position.x, position.y, 'plants', frameNumber).setInteractive();
            tile.on('pointerdown', () => playGame.prepareToAddNewSprite(frameNumber));
        });

    }

    static prepareToAddNewSprite(frame){
        playGame.addSpriteState = frame;
    }

    static firstRowPositions(row, col){
        const posX = 20 * (col + 1) + 200 * (col + 0.5) + 100;
        const posY = 20 * (row + 1) + 200 * (row + 0.5);

        return new Phaser.Geom.Point(posX, posY);
    }

    static getThirdPosition2(row, col){
        const posX = 20 * (col + 1) + 200 * (col + 0.5) - 110;
        const posY = 20 * (row + 1) + 200 * (row + 0.5);

        return new Phaser.Geom.Point(posX, posY);
    }

    static getThirdPosition(row, col){
        const posX = 20 * (col + 1) + 125 * (col + 0.5);
        const posY = 20 * (row + 1) + 200 * (row + 0.5);

        return new Phaser.Geom.Point(posX, posY);
    }

    static getHalfPosition(row, col){
        const posX = 20 * (col + 1) + 265 * (col + 0.5);
        const posY = 20 * (row + 1) + 200 * (row + 0.5);

        return new Phaser.Geom.Point(posX, posY);
    }

    static getTitlePosition(row, col) {
        const posX = gameOptions.titleSpacing * (col + 1) + gameOptions.titleSize * (col + 0.5);
        const posY = gameOptions.titleSpacing * (row + 1) + gameOptions.titleSize * (row + 0.5);

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
        console.info(event);
        const boardState = playGame.parseKeBoardState(JSON.parse(event.body));
        let counter = 0;

        for (let i = 1; i < gameOptions.boardSize.rows; i++) {
            for (let j = 0; j < gameOptions.boardSize.cols; j++) {
                if(boardState[counter] > 0){
                    playGame.renderNewObject(i,j, boardState[counter]);
                    console.info(i,j, boardState[counter]);
                }
                counter+=1;
            }

        }
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

            for (let i = 1; i < gameOptions.boardSize.rows; i++) {
                for (let j = 0; j < gameOptions.boardSize.cols; j++) {

                    const tmpKey = 'a' + counter;
                    board[tmpKey] = playGame.boardArray[i][j].tileValue;
                    counter += 1;
                }
            }
            const msg = {body: JSON.stringify(board)};

            playGame.channel.push('new_msg', msg);

        }
        playGame.addSpriteState = null;

    }
}
