const firstSunObject = {
    coordinates: [
        {
            posX: (1 + 1) + 190 * (1),
            posY: (5 + 1) + 180 * (5 + 0.5),
        },
        {
            posX: (1 + 1) + 200 * (1 + 0.5),
            posY: (4 + 1) + 180 * (4 + 0.5),
        },
        {
            posX: (1 + 1) + 200 * (1 + 0.5),
            posY: (4 + 1) + 180 * (4 + 0.5),
        },
        {
            posX: (2 + 1) + 200 * (2),
            posY: (3 + 1) + 180 * (3 + 0.5),
        },
        {
            posX: (2 + 1) + 200 * (2 + 0.5),
            posY: (2 + 1) + 180 * (2 + 0.5),
        },
        {
            posX: (3 + 1) + 200 * (3 + 0.5),
            posY: (2 + 1) + 180 * (2 + 0.5),
        },
        {
            posX: (4 + 1) + 200 * (4 + 0.5),
            posY: (2 + 1) + 180 * (2 + 0.5),
        },
        {
            posX: (5 + 1) + 200 * (5 + 0.5),
            posY: (2 + 1) + 180 * (2 + 0.5),
        },
    ],  
};
const secondSunObject = {
    coordinates: [
        {
            posX: (3 + 1) + 200 * (3 + 0.5),
            posY: (2 + 1) + 180 * (2 + 0.5),
        },
        {
            posX: (4 + 1) + 200 * (4 + 0.5),
            posY: (2 + 1) + 180 * (2 + 0.5),
        },
        {
            posX: (5 + 1) + 200 * (5 + 0.5),
            posY: (2 + 1) + 180 * (2 + 0.5),
        },
        {
            posX: (6 + 1) + 200 * (6 + 0.5),
            posY: (2 + 1) + 180 * (2 + 0.5),
        },
        {
            posX: (6 + 1) + 200 * (6 + 1),
            posY: (3 + 1) + 180 * (3 + 0.5),
        },
        {
            posX: (7 + 1) + 200 * (7 + 0.5),
            posY: (4 + 1) + 180 * (4 + 0.5),
        },
        {
            posX: (7 + 1) + 200 * (7 + 1),
            posY: (5 + 1) + 180 * (5 + 0.5),
        }
    ],  
};

export default class SunCurve {
    constructor(self, scene){
        this.sunCurvePosition = '';
        this.sunCurves = ['firstSun', 'secondSun'];
        this.drawSuns = this.drawSuns.bind(this);
        this.turnOnFirstSun = this.turnOnFirstSun.bind(this);
        this.getSunPosition = this.getSunPosition.bind(this);


        scene.sunArray = {
                'firstSun': [],
                'secondSun': [],
            };

        this.drawSuns(firstSunObject, secondSunObject, self, scene);
        this.turnOnFirstSun(scene);
        
    }

    drawSuns(firstSunObject, secondSunObject, self, scene){
        firstSunObject.coordinates.forEach((sunCoordiantes, index) => this.drawSunCurve(sunCoordiantes, self, scene, 'firstSun', index));
        secondSunObject.coordinates.forEach((sunCoordiantes, index) => this.drawSunCurve(sunCoordiantes, self, scene, 'secondSun', index));
    }

    turnOffSunCurve(sunKey, scene){
        scene.sunArray[sunKey].forEach(item => item.tileSprite.visible = false);
    }

    turnOnSunCurve(sunKey, scene){ 
        scene.sunArray[sunKey].forEach(item => item.tileSprite.visible = true);
    }

    getSunPosition(){
        return this.sunCurves.findIndex(item => item === this.sunCurvePosition);
    }

    switchSun(scene){
        const curentSunPosition = this.sunCurves[this.getSunPosition()];
        const nextSunPosition = this.sunCurves[this.getSunPosition() + 1];

        this.turnOffSunCurve(curentSunPosition, scene);
        this.turnOnSunCurve(nextSunPosition, scene);
        this.sunCurvePosition = nextSunPosition;
    }

    turnOnFirstSun(scene){
        this.sunCurvePosition = 'firstSun';
        this.turnOnSunCurve('firstSun', scene);
    }


    drawSunCurve(sunObject, self, scene, key, index){

        const position = new Phaser.Geom.Point(sunObject['posX'], sunObject['posY']);

        const sunTile = self.add.sprite(position.x, position.y, 'sun', 0).setInteractive();

        sunTile.visible = false;

        scene.sunArray[key].push(
            {
                tileValue: 0,
                tileSprite: sunTile
            }
        )   
    }

    
}