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
        scene.sunArray = [];
        scene.sunPosition = 0;
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


    renderSun(sunObject, self, scene, index){

        const position = new Phaser.Geom.Point(sunObject['posX'], sunObject['posY']);

        self.add.image(position.x, position.y, this.mainImage).setInteractive();

        const sunTile = self.add.sprite(position.x, position.y, 'sun', 0).setInteractive();

        sunTile.visible = false;

        scene.sunArray[index] = {
            tileValue: 0,
            tileSprite: sunTile
        }   
    }

    drawGameBoard(self, scene) {

        const sunPositionSettings = [
            {
                firstSun: {
                    posX: (2 + 1) + 200 * (2 + 0.5),
                    posY: (2 + 1) + 180 * (2 + 0.5),
                },
                secondSun: {
                    posX: (6 + 1) + 200 * (6 + 0.5),
                    posY: (2 + 1) + 180 * (2 + 0.5),
                },
                thirdSun: {
                    posX: (8 + 1) + 200 * (8 + 0.5),
                    posY: (6 + 1) + 180 * (6 + 0.5),
                },
                fourth: {
                    posX: (2 + 1) + 200 * (2 + 0.5),
                    posY: (10 + 1) + 180 * (10 + 0.5),
                },
                fiveSun: {
                    posX: (6 + 1) + 200 * (6 + 0.5),
                    posY: (10 + 1) + 180 * (10 + 0.5),

                },
                sixSun: {
                    posX: (0 + 1) + 200 * (0 + 0.5),
                    posY: (6 + 1) + 180 * (6 + 0.5),
                }

            }
        ];
        this.renderSun(sunPositionSettings[0]['firstSun'], self, scene, 0);
        this.renderSun(sunPositionSettings[0]['secondSun'], self, scene, 1);
        this.renderSun(sunPositionSettings[0]['thirdSun'], self, scene, 2);
        this.renderSun(sunPositionSettings[0]['fiveSun'], self, scene, 3);
        this.renderSun(sunPositionSettings[0]['fourth'], self, scene, 4);
        this.renderSun(sunPositionSettings[0]['sixSun'], self, scene, 5);


        this.renderRow(3, scene.gameBoardMatrix.firstRow, self, scene);
        this.renderRow(4, scene.gameBoardMatrix.secondRow, self, scene);
        this.renderRow(5, scene.gameBoardMatrix.thirdRow, self, scene);
        this.renderRow(6, scene.gameBoardMatrix.fourthRow, self, scene);
        this.renderRow(7, scene.gameBoardMatrix.thirdRow, self, scene);
        this.renderRow(8, scene.gameBoardMatrix.secondRow, self, scene);
        this.renderRow(9, scene.gameBoardMatrix.firstRow, self, scene);

        scene.sunArray[0].tileSprite.visible = true;


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
