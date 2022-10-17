import InputHandler from "./inputHandler.js";
import Menu from "./menu.js";
import { buildlevel, level1, npCars1, parkinglots1, pigeons1, trees1 } from "./levels.js";
import { GAMESTATE } from "./constants.js";
import Timer from "./timer.js"

export default class Game {
    constructor(gameWidth, gameHeight) {
        // Game starts at the Menu
        this.state = GAMESTATE.MENU;
        // Size of the screen
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        //this.car = new Car(this, 0, 0, 0);

        // Highscore from the local storage
        this.highscore = [];
        if (JSON.parse(window.localStorage.getItem("highscore"))) {
            this.highscore.push(JSON.parse(window.localStorage.getItem("highscore")));
        }

        // In this array will all Game objects be stored
        this.gameObjects = [];

        this.menu = new Menu(this);
        new InputHandler(this);
        // Lives for the player. Will be overitten at start.
        this.lives = 3;
        this.livesImg = document.getElementById("heart");
        // Parking places the player hast to find. Will be overitten at start.
        this.openParkinglots = 5;
        this.timer = new Timer();

    }
    // Start is called and the level is build.
    start() {
        this.lives = 3;
        this.gameObjects = [];
        buildlevel(this, level1, parkinglots1, npCars1, pigeons1, trees1);
        this.timer.reset();
        this.timer.start();
        this.state = GAMESTATE.RUNNING;
    }

    won() {
        this.state = GAMESTATE.MENU;
        this.timer.stop();

        let name = prompt("Gib deinen Namen ein!");
        let sec = (this.timer.time / 1000) % 60;
        let min = ((this.timer.time / 1000) - (this.timer.time / 1000) % 60) / 60;
        let winner = {
            name: name,
            timems: this.timer.time,
            time: min + " min : " + sec + "sec"
        };

        this.highscore.push(winner);
        this.highscore.sort(
            (function (a, b) { return a.timems - b.timems })
        );
        window.localStorage.setItem("highscore", JSON.stringify(this.highscore));
        this.menu.won();
    }

    gameover() {
        this.state = GAMESTATE.MENU;
        this.timer.stop();
        this.menu.gameover();
    }

    update(dt) {
        if (this.state == GAMESTATE.MENU) { this.menu.update(dt); }
        if (this.state != GAMESTATE.RUNNING) { return; }

        this.timer.update(dt);

        if (this.lives <= 0) { this.gameover(); }
        if (this.openParkinglots <= 0) { this.won(); }

        this.car.update(dt);

        // Updates the Camera
        // Makes sure it is not outside the map
        if ((this.car.position.x < this.levelSize.x - this.gameWidth * 0.5) &&
            (this.car.position.x > this.gameWidth * 0.5)) {
            //Makes the cam follow the car a bit slowly. TODO: Could include dt? Also maybe the cam could move into the direction the car is heading...
            this.position.x = this.car.position.x * 0.05 + this.position.x * 0.95;
        }
        if ((this.car.position.y < this.levelSize.y - this.gameHeight * 0.5) &&
            (this.car.position.y > this.gameHeight * 0.5)) {
            this.position.y = this.car.position.y * 0.05 + this.position.y * 0.95;
        }
        // Updates the Game Objects
        [...this.gameObjects].forEach(object => object.update(dt));

        // Filters out all gameobjects that are no longer needed.
        this.gameObjects = this.gameObjects.filter(object => object.isInGame);
    }
    draw(ctx) {
        if (this.state == GAMESTATE.MENU) { this.menu.draw(ctx); }
        if (this.state != GAMESTATE.RUNNING) { return; }
        ctx.translate(this.gameWidth * 0.5, this.gameHeight * 0.5);
        ctx.drawImage(this.level,
            this.position.x - this.gameWidth * 0.5,
            this.position.y - this.gameHeight * 0.5,
            this.gameWidth, this.gameHeight,
            -this.gameWidth * 0.5,
            -this.gameHeight * 0.5,
            this.gameWidth,
            this.gameHeight);
        ctx.translate(-this.gameWidth * 0.5, -this.gameHeight * 0.5);
        this.car.draw(ctx);
        [...this.gameObjects].forEach(object => object.draw(ctx));

        // Draws the lives    
        for (let i = 0; i < this.lives; i++) {
            ctx.drawImage(this.livesImg, 5 + 50 * i, 550);
        }
        // Draws the timer. 
        this.timer.draw(ctx);
    }
}