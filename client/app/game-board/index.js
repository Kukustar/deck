import playGame from "../scenes/play-game";


export default class GameBoard {
    constructor(self, scene, gameBoardMatrix) {
        this.mainImage = 'round';
        this.preparePlayGameBoard = this.preparePlayGameBoard.bind(this);
        this.classFunctionForRenderRow = this.classFunctionForRenderRow.bind(this);
        this.renderGameBoard = this.renderGameBoard.bind(this);
        this.renderSettings = this.renderSettings.bind(this);

        this.preparePlayGameBoard(scene);
        this.renderGameBoard(self, scene, gameBoardMatrix);
        this.renderSettings(gameBoardMatrix.settingsRow, scene, self);
    }

    preparePlayGameBoard(scene) {
        scene.boardArray = [];
        scene.settingsArray = [];
        scene.addSpriteState = null;
    }

    classFunctionForRenderRow(rowStart, rowObject, self, scene) {
        scene.boardArray[rowStart] = [];
        rowObject.colIndexes.forEach(colIndex => {
            let position;
            if (rowObject.firstElement && colIndex === 1) {
                position = rowObject.firstElement(rowStart, colIndex);
            } else position = rowObject.otherElements(rowStart, colIndex);

            const image = self.add.image(position.x, position.y, this.mainImage).setInteractive();

            image.on('pointerdown', () => playGame.addNewSprite(rowStart, colIndex, playGame.addSpriteState));

            const tile = self.add.sprite(position.x, position.y, 'plants', 0).setInteractive();

            tile.visible = false;

            playGame.boardArray[rowStart][colIndex] = {
                tileValue: 0,
                tileSprite: tile
            };
        })
    }

    renderGameBoard(self, scene, gameBoardMatrix) {

        this.classFunctionForRenderRow(1, gameBoardMatrix.firstRow, self, scene);
        this.classFunctionForRenderRow(2, gameBoardMatrix.secondRow, self, scene);
        this.classFunctionForRenderRow(3, gameBoardMatrix.thirdRow, self, scene);
        this.classFunctionForRenderRow(4, gameBoardMatrix.fourthRow, self, scene);
        this.classFunctionForRenderRow(5, gameBoardMatrix.thirdRow, self, scene);
        this.classFunctionForRenderRow(6, gameBoardMatrix.secondRow, self, scene);
        this.classFunctionForRenderRow(7, gameBoardMatrix.firstRow, self, scene);

    }

    renderSettings(rowObject, scene, self) {
        rowObject.colIndexes.forEach(settingRow => {
            const position = rowObject.otherElements(0, settingRow - 1);
            self.add.image(position.x, position.y, 'round');
            const tile = self.add.sprite(position.x, position.y, 'plants', settingRow).setInteractive();
            tile.on('pointerdown', () => scene.addSpriteState = settingRow);
        })

    }
}