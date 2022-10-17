import { MENUSTATE } from "./constants.js";

export default class Menu {
    constructor(game) {
        this.game = game;
        this.MENUSTATE = MENUSTATE.START1;
        this.img = document.getElementById("menu");
        this.icon = document.getElementById("car");
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.r = 0;
        this.iconsize = {
            x: 101,
            y: 156

        };
        this.iconpos = {
            x: 370,
            y: 300
        };
    }

    enter() {
        if (this.MENUSTATE == MENUSTATE.START1) {
            this.game.start();
            return;
        }
        if (this.MENUSTATE == MENUSTATE.HIGHSCORE) {
            this.MENUSTATE = MENUSTATE.HIGHSCORESCREEN;
            return;
        }
        if (this.MENUSTATE == MENUSTATE.WINSCREEN) {
            this.MENUSTATE = MENUSTATE.HIGHSCORE;
            return;
        }
        if (this.MENUSTATE == MENUSTATE.HIGHSCORESCREEN) {
            this.MENUSTATE = MENUSTATE.HIGHSCORE;
            return;
        }
        if (this.MENUSTATE == MENUSTATE.GAMEOVERSCREEN) {
            this.MENUSTATE = MENUSTATE.HIGHSCORE;
            return;
        }
    }

    won() { this.MENUSTATE = MENUSTATE.WINSCREEN; }

    gameover() { this.MENUSTATE = MENUSTATE.GAMEOVERSCREEN; }

    // Rotates the Car Icon.
    update(dt) {
        this.r += dt * 0.001;
        switch (this.MENUSTATE) {
            case 0:
                this.iconpos.y = 300;
                break;
            case 1:
                this.iconpos.y = 430;
                break;
        }
    }

    down() {
        if (this.MENUSTATE == MENUSTATE.START1) {
            this.MENUSTATE = MENUSTATE.HIGHSCORE;
        }
    }

    up() {
        if (this.MENUSTATE == MENUSTATE.HIGHSCORE) {
            this.MENUSTATE = MENUSTATE.START1;
        }
    }
    draw(ctx) {

        if (
            this.MENUSTATE == MENUSTATE.START1 ||
            this.MENUSTATE == MENUSTATE.HIGHSCORE ||
            this.MENUSTATE == MENUSTATE.HIGHSCORESCREEN
        ) {
            ctx.drawImage(this.img, 0, 0);
        }
        if (
            this.MENUSTATE == MENUSTATE.START1 ||
            this.MENUSTATE == MENUSTATE.HIGHSCORE
        ) {
            ctx.save();

            ctx.font = "30px Comic Sans MS";
            ctx.fillStyle = "red";
            ctx.fillText("Start Game", 100, canvas.height / 2);
            ctx.fillText("Highscore", 100, canvas.height / 2 + 150);

            ctx.translate(this.iconpos.x, this.iconpos.y);
            ctx.rotate(this.r)
            ctx.drawImage(this.icon, -this.iconsize.x * 0.5, -this.iconsize.y * 0.5);
            ctx.rotate(-this.r)
            ctx.translate(-this.iconpos.x, -this.iconpos.y);

            ctx.restore();

        }
        if (
            this.MENUSTATE == MENUSTATE.WINSCREEN
        ) {
            ctx.drawImage(document.getElementById("win"), 0, 0);
        }
        if (
            this.MENUSTATE == MENUSTATE.GAMEOVERSCREEN
        ) {
            ctx.drawImage(document.getElementById("gameover"), 0, 0);
        }

        if (
            this.MENUSTATE == MENUSTATE.HIGHSCORESCREEN
        ) {
            ctx.save();
            ctx.drawImage(this.img, 0, 0);
            ctx.font = "50px Comic Sans MS";
            ctx.fillStyle = "red";
            ctx.fillText("BESTENLISTE", 100, 250);
            ctx.font = "30px Comic Sans MS";

            for (let i = 0; i < this.game.highscore.length; i++) {
                if ((this.game.highscore[i].name) &&
                    (this.game.highscore[i].time)) {
                    ctx.fillText(this.game.highscore[i].name, 25, 300 + 25 * i);
                    ctx.fillText(this.game.highscore[i].time, 200, 300 + 25 * i);
                }
            }
            ctx.restore();

        }
    }

}

