import { myDraw, detectInside, detectCollision, myDrawImg, detectLevelCollision } from "./tools.js";
// In this file do live all the objects that can be pushed into the gameobject array.
export class GameObject {
    constructor(game) {
        this.game = game;
        this.isInGame = true;
        this.levelsize = game.levelsize;
    }
}

export class Explosion extends GameObject {
    constructor(game, x, y) {
        super(game);
        this.img = document.getElementById("explosion");
        this.time = 0;
        this.position = { x: x, y: y, r: 0 };
        this.size = { x: 150, y: 150, z: 0 };
    }
    update(dt) {
        // Makes sure an explosion is removed after a certain time.
        if (this.time < 500) {
            this.time += dt;
            return;
        }
        this.isInGame = false;
    }
    draw(ctx) {
        myDrawImg(ctx, this);

    }
}

export class Tree extends GameObject {
    constructor(game, x, y, r) {
        super(game);
        this.img = document.getElementById("tree");
        this.time = 0;
        this.position = { x: x, y: y, r: r };
        this.size = { x: 120, y: 120, z: 0 };
        this.size.z = Math.sqrt(Math.pow(this.size.x, 2) + Math.pow(this.size.y, 2));
    }

    update(dt) {

        if (detectCollision(this.game.car, this)) {
            this.game.gameObjects.push(new Explosion(this.game,
                (this.game.car.position.x + this.position.x) * 0.5,
                (this.game.car.position.y + this.position.y) * 0.5
            ));
            this.img = document.getElementById("fallentree");
            this.position.r = this.game.car.position.r;
            this.game.car.hit();
        }
    }

    draw(ctx) {
        myDrawImg(ctx, this);
    }
}


export class NpCar extends GameObject {
    constructor(game, x, y, r) {
        super(game);
        this.img = document.getElementById("npcCar");
        this.time = 0;
        this.position = { x: x, y: y, r: r };
        this.size = { x: 82, y: 156, z: 0 };
        this.size.z = Math.sqrt(Math.pow(this.size.x, 2) + Math.pow(this.size.y, 2));
    }
    update(dt) {

        if (detectCollision(this.game.car, this)) {
            this.game.gameObjects.push(new Explosion(this.game,
                (this.game.car.position.x + this.position.x) * 0.5,
                (this.game.car.position.y + this.position.y) * 0.5
            ));
            this.game.car.hit();
        }


    }
    draw(ctx) {
        myDrawImg(ctx, this);
    }
}

export class Parkinglot extends GameObject {
    constructor(game, x, y, r) {
        super(game);

        this.size = { x: 125, y: 185, z: 0, ang: 0 };
        this.size.z = Math.sqrt(Math.pow(this.size.x, 2) + Math.pow(this.size.y, 2));
        //this.size.ang = Math.asin(this.size.x / this.size.z);
        this.position = { x: x, y: y, r: r };
        this.color = "red";
        this.lineWidth = "4";
        this.isActive = true;


    }
    update(dt) {
        if (!this.isActive) { return; }

        if (
            detectInside(this.game.car, this) &&
            Math.abs(this.game.car.positionSpeed.x) < 0.1
        ) {
            this.isActive = false;
            this.game.openParkinglots -= 1;
            console.log("called");
            this.color = "green";
        }


    }

    draw(ctx) {
        myDraw(ctx, this);
    }
}

export class Pigeon extends GameObject {
    constructor(game, x, y, r) {
        super(game);
        this.size = { x: 150, y: 82, z: 0 };
        this.size.z = Math.sqrt(Math.pow(this.size.x, 2) + Math.pow(this.size.y, 2));

        this.img = document.getElementById("pigeon");
        this.position = { x: x, y: y, r: r };
        this.positionSpeed = { x: 0, r: 0 };
        this.maxSpeed = { x: 0.2, r: 0.2 };
        this.invincible = 0;

    }
    update(dt) {

        if (this.invincible > 0) {
            this.invincible -= dt;
        }

        this.position.r += this.positionSpeed.r;

        let r = this.position.r * Math.PI / 180;
        this.position.x += Math.sin(r) * this.positionSpeed.x * dt;
        this.position.y -= Math.cos(r) * this.positionSpeed.x * dt;

        if (detectCollision(this.game.car, this)) {
            this.game.gameObjects.push(new Explosion(this.game,
                (this.game.car.position.x + this.position.x) * 0.5,
                (this.game.car.position.y + this.position.y) * 0.5
            ));
            this.game.car.hit();

            if (this.invincible > 0) {
                return;
            }
            this.invincible = 2500;
           
            // Makes the Pigeon turn around if hit.
            this.position.r = this.position.r + 180;
        }

        if (detectLevelCollision(this.game.levelSize, this)) {
            this.position.r = this.position.r - 180;
        }
        this.positionSpeed.x = Math.random() / 10;
        this.positionSpeed.r = Math.random() / 10;
    }
    draw(ctx) {
        myDrawImg(ctx, this);
    }

}



