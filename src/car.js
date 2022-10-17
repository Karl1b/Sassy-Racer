import { detectLevelCollision } from "./tools.js";
import { Explosion } from "./gameObject.js";

export default class Car {
    // x and y is the position. r is the rotation starting from -y = 0 in clockwise direction.
    constructor(game, x, y, r) {
        this.game = game;
        this.img = document.getElementById("car");
        //size of the Car. z is the longest diagonal diameter.ang is the angle of the diagonal.
        this.size = { x: 82, y: 156, z: 0, ang: 0 };
        this.size.z = Math.sqrt(Math.pow(this.size.x, 2) + Math.pow(this.size.y, 2));
        this.size.ang = Math.asin(this.size.x / this.size.z);
        // position w is the rotation of the wheels relative to the -y = 0 axis of the car.
        this.position = { x: x, y: y, r: r, w: 0, wmax: 45 };
        this.dims = { fd: 100, bd: 100 };
        // Speed of Change for the Positions.
        this.positionSpeed = { x: 0, r: 0, w: 0 };
        this.maxSpeed = { x: 0.3, r: 0.2, w: 0.1 };
        this.invincible = 0;
    }

    // The player car gets hit by something evil. It does turn invincible for a short time to not lose all lives at once.
    hit() {
        this.positionSpeed.x = 0;
        if (this.invincible > 0) {
            return;
        }
        this.invincible = 2500;
        this.game.lives -= 1;
    }

    // The player car receives a stop command.
    stop() {
        this.positionSpeed.x = this.positionSpeed.x * 0.8;
        if (this.positionSpeed.x < 0.02) {
            this.positionSpeed.x = 0;
        }
    }

    // The positions of the wheels get straigthend.
    stopRotate() {
        this.positionSpeed.w = 0;
    }

    // Basically the gas pedal.
    move(x) {
        this.positionSpeed.x += x * 0.05;
        // Upper Speed limit
        if (this.positionSpeed.x >= this.maxSpeed.x) {
            this.positionSpeed.x = this.maxSpeed.x;
        }
        // Lower Speed limit
        if (this.positionSpeed.x <= -this.maxSpeed.x) {
            this.positionSpeed.x = -this.maxSpeed.x;
        }
    }
    // Rotating the wheels
    rotate(w) {
        this.positionSpeed.w += w * 0.1;
        if (this.positionSpeed.w >= this.maxSpeed.w) {
            this.positionSpeed.w = this.maxSpeed.w;
        }
        if (this.positionSpeed.w <= -this.maxSpeed.w) {
            this.positionSpeed.w = -this.maxSpeed.w;
        }
    }

    update(dt) {
        if (this.invincible > 0) {
            this.invincible -= dt;
        }
        // Updates the positon of the Wheels
        //console.log(this.position.r);
        this.position.w += this.positionSpeed.w * dt;
        // Max range of the wheels.
        if (this.position.w >= this.position.wmax) {
            this.position.w = this.position.wmax;
        }
        if (this.position.w <= -this.position.wmax) {
            this.position.w = -this.position.wmax;
        }

        let r = this.position.r * Math.PI / 180;
        this.position.x += Math.sin(r) * this.positionSpeed.x * dt;
        this.position.y -= Math.cos(r) * this.positionSpeed.x * dt;

        let w = this.position.w * Math.Pi / 180;
        this.position.r += this.position.w * this.positionSpeed.x * dt * 0.01;


        // Fancy Level Border Collisiondetection 
        if (detectLevelCollision(this.game.levelSize, this)) {
            // PlayerCar loses a live.
            this.hit();
            this.game.gameObjects.push(new Explosion(this.game,
                (this.game.car.position.x + this.position.x) * 0.5,
                (this.game.car.position.y + this.position.y) * 0.5
            ));
        }

    }
    draw(ctx) {
        let drawX = this.position.x - this.game.position.x + this.game.gameWidth * 0.5;
        let drawY = this.position.y - this.game.position.y + this.game.gameHeight * 0.5;
        let r = this.position.r * Math.PI / 180;
        let w = this.position.w * Math.PI / 180;
        let wDistx = 35;
        let wDisty = 45;
        let wheelsizeX = 15;
        let wheelsizeY = 30;
        // Draws the car but first the wheels.
        ctx.save()
        ctx.translate(drawX, drawY);
        ctx.rotate(r);
        ctx.translate(-wDistx, -wDisty);
        ctx.rotate(w);
        ctx.fillRect(-wheelsizeX * 0.5, -wheelsizeX, wheelsizeX, wheelsizeY);
        ctx.rotate(-w);
        ctx.translate(wDistx * 2, 0);
        ctx.rotate(w);
        ctx.fillRect(-wheelsizeX * 0.5, -wheelsizeX, wheelsizeX, wheelsizeY);
        ctx.rotate(-w);
        ctx.translate(-wDistx, wDisty);
        ctx.drawImage(this.img, - this.size.x * 0.5, - this.size.y * 0.5);
        ctx.restore();
    }
}