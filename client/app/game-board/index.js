export default class GameBoard {
    constructor(self, scene) {
        this.mainImage = 'round';
        this.prepareBoard = this.prepareBoard.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.drawGameBoard = this.drawGameBoard.bind(this);
        this.drawSettings = this.drawSettings.bind(this);
        this.drawNewObject = this.drawNewObject.bind(this);

        this.prepareBoard(scene);
        this.drawGameBoard(self, scene);
        this.drawSettings(scene.gameBoardMatrix.settingsRow, scene, self);
    }

    prepareBoard(scene) {
        scene.boardArray = [];
        scene.settingsArray = [];
        scene.addSpriteState = null;
    }

    renderRow(rowStart, rowObject, self, scene) {
        scene.boardArray[rowStart] = [];
        rowObject.colIndexes.forEach(colIndex => {
            let position;
            if (rowObject.firstElement && colIndex === 1) {
                position = rowObject.firstElement(rowStart, colIndex);
            } else position = rowObject.otherElements(rowStart, colIndex);

            const image = self.add.image(position.x, position.y, this.mainImage).setInteractive();

            image.on('pointerdown', () => scene.addNewSprite(rowStart, colIndex, scene.addSpriteState));

            const tile = self.add.sprite(position.x, position.y, 'plants', 0).setInteractive();

            tile.visible = false;

            scene.boardArray[rowStart][colIndex] = {
                tileValue: 0,
                tileSprite: tile
            };
        })
    }

    drawGameBoard(self, scene) {

        this.renderRow(1, scene.gameBoardMatrix.firstRow, self, scene);
        this.renderRow(2, scene.gameBoardMatrix.secondRow, self, scene);
        this.renderRow(3, scene.gameBoardMatrix.thirdRow, self, scene);
        this.renderRow(4, scene.gameBoardMatrix.fourthRow, self, scene);
        this.renderRow(5, scene.gameBoardMatrix.thirdRow, self, scene);
        this.renderRow(6, scene.gameBoardMatrix.secondRow, self, scene);
        this.renderRow(7, scene.gameBoardMatrix.firstRow, self, scene);

    }

    drawSettings(rowObject, scene, self) {
        rowObject.colIndexes.forEach(settingRow => {
            const position = rowObject.otherElements(0, settingRow - 1);
            self.add.image(position.x, position.y, 'round');
            const tile = self.add.sprite(position.x, position.y, 'plants', settingRow).setInteractive();
            tile.on('pointerdown', () => scene.addSpriteState = settingRow);
        })

    }

    drawNewObject(i, j, frame, scene) {
        scene.boardArray[i][j].tileValue = frame;
        scene.boardArray[i][j].tileSprite.visible = true;
        scene.boardArray[i][j].tileSprite.setFrame(frame);
    }
}