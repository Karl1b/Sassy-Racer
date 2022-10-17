import Car from "./car.js";
import { Parkinglot, Pigeon, NpCar, Tree } from "./gameObject.js";

// This function builds the level. When start is called. A new level is a big picture and then filled by active game objects.
export function buildlevel(game, level, parkinglots, npCars, pigeons, trees) {

    game.level = level.img;
    game.levelSize = level.size;
    game.car = new Car(game, level.car.x, level.car.y, level.car.r);
    game.position = level.position;

    npCars.forEach(element => {
        game.gameObjects.push(new NpCar(game, element[0], element[1], element[2]));
    });

    game.openParkinglots = 0;
    parkinglots.forEach(element => {
        game.openParkinglots += 1;
    });

    game.openParkinglots = 0;
    parkinglots.forEach(element => {
        game.gameObjects.push(new Parkinglot(game, element[0], element[1], element[2]));
        game.openParkinglots += 1;
    });

    trees.forEach(element => {
        game.gameObjects.push(new Tree(game, element[0], element[1], element[2]));
    });

    pigeons.forEach(element => {
        game.gameObjects.push(new Pigeon(game, element[0], element[1], element[2]));
    });

}

export const level1 = {
    img: document.getElementById("level3"),
    size: { x: 2400, y: 1800 },
    car: { x: 624, y: 1650, r: 340 },
    position: { x: 600, y: 1600, r: 0 }
}

export const trees1 = [
    [305, 957, 15],
    [721, 748, 5],
    [250, 1500, 40],
    [800, 1520, 35],
    [800, 500, 0],
    [1994, 1081, 35]
]

export const npCars1 = [
    [742, 1346, 15],
    [1160, 1128, 90],
    [1165, 1328, 90],
    [1162, 1628, 265],
    [1155, 1528, 275],
    [1160, 1728, 90],
    [960, 1430, 175],
    [1790, 333, 85],
    [1375, 333, 96],
    [1553, 453, 96],
    [115, 275, 130],
    [330, 120, 140]
]

export const parkinglots1 = [
    [1160, 1430, 90],
    [1583, 333, 90],
    [215, 175, 135]
]

export const pigeons1 = [
    [1700, 700, 270],
    [200, 200, 90],
    [1700, 1700, 300]
]





