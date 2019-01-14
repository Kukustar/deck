import Phaser from "phaser";
import gameOptions from "../../game-settings/game-options";

function firstRowPosition(row, col){
    const posX = (col + 1) + 265 * (col + 0.5);
    const posY = (row + 1) + 180 * (row + 0.5);

    return new Phaser.Geom.Point(posX, posY);
}

function firstRowPositions(row, col){
    const posX = (col + 1) + 200 * (col + 0.5) + 100;
    const posY = (row + 1) + 180 * (row + 0.5);

    return new Phaser.Geom.Point(posX, posY);
}

function getStandartPosition(row, col) {
    const posX = gameOptions.titleSpacing * (col + 1) + gameOptions.titleSize * (col + 0.5);
    const posY = gameOptions.titleSpacing * (row + 1) + 180 * (row + 0.5);

    return new Phaser.Geom.Point(posX, posY);
}

function thirdPositions(row, col){
    const posX = (col + 1) + 200 * (col + 0.5) - 110;
    const posY = (row + 1) + 180 * (row + 0.5);

    return new Phaser.Geom.Point(posX, posY);
}

function thirdPosition(row, col){
    const posX = (col + 1) + 125 * (col + 0.5);
    const posY = (row + 1) + 180 * (row + 0.5);

    return new Phaser.Geom.Point(posX, posY);

}

const gameBoardMatrix = {
    firstRow: {
        colIndexes: [1,2,3,4],
        otherElements: firstRowPositions,
        firstElement: firstRowPosition,
    },

    secondRow: {
        colIndexes: [1,2,3,4,5],
        otherElements: getStandartPosition,
        firstElement: null,
    },

    thirdRow: {
        colIndexes: [1,2,3,4,5,6],
        otherElements: thirdPositions,
        firstElement: thirdPosition

    },
    fourthRow: {
        colIndexes: [0,1,2,3,4,5,6],
        otherElements: getStandartPosition,
        firstElement: null,
    },
    settingsRow: {
        colIndexes: [1,2,3],
        otherElements: getStandartPosition,
    },
    rows: [
        {1: 'firstRow'},
        {2: 'secondRow'},
        {3: 'thirdRow'},
        {4: 'fourthRow'},
        {5: 'thirdRow'},
        {6: 'secondRow'},
        {7: 'firstRow'}
    ]
};

export default gameBoardMatrix;