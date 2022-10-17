import { GAMESTATE } from "./constants.js";

export default class InputHandler {
    constructor(game) {

        document.addEventListener("keydown", (event) => {

            if (game.state == GAMESTATE.RUNNING) {
                switch (event.code) {
                    case "ArrowUp":
                    case "KeyW":

                        game.car.move(1);
                        break;

                    case "ArrowDown":
                    case "KeyS":

                        game.car.move(-1);
                        break;

                    case "ArrowRight":
                    case "KeyD":

                        game.car.rotate(1);
                        break;

                    case "ArrowLeft":
                    case "KeyA":

                        game.car.rotate(-1);
                        break;
                }
            }
        });

        document.addEventListener("keyup", (event) => {

            if (game.state == GAMESTATE.RUNNING) {

                switch (event.code) {

                    case "ArrowUp":
                    case "KeyW":
                        if (game.car.positionSpeed.x > 0) {
                            game.car.stop();
                        }

                        break;

                    case "ArrowDown":
                    case "KeyS":
                        if (game.car.positionSpeed.x < 0) {
                            game.car.stop();
                        }
                        break;

                    case "ArrowRight":
                    case "KeyD":

                        game.car.stopRotate();
                        break;

                    case "ArrowLeft":
                    case "KeyA":

                        game.car.stopRotate();
                        break;
                }
            }
            if (game.state == GAMESTATE.MENU) {

                switch (event.code) {

                    case "ArrowUp":
                    case "KeyW":
                        game.menu.up();

                        break;

                    case "ArrowDown":
                    case "KeyS":
                        game.menu.down();
                        break;



                    case "Enter":

                        game.menu.enter();

                        break;

                }
            }
        });
    }
}

