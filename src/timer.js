export default class Timer {
    constructor() {
        this.time = 0;
        this.isRunning = false;
    }

    start() {
        this.isRunning = true;
    }

    stop() {
        this.isRunning = false;
    }

    reset() {
        this.time = 0;
    }

    update(dt) {
        if (!(this.isRunning)) { return; }
        this.time += dt;
    }

    draw(ctx) {
        ctx.save();
        let sec = (this.time / 1000) % 60;
        let min = ((this.time / 1000) - (this.time / 1000) % 60) / 60;

        ctx.font = "30px Comic Sans MS";
        ctx.fillStyle = "red";
        ctx.fillText(min + " : " + sec, canvas.width - 95, 50);

        ctx.restore();
    }

    drawWinTime(ctx){

        ctx.save();
        let sec = (this.time / 1000) % 60;
        let min = ((this.time / 1000) - (this.time / 1000) % 60) / 60;
        ctx.font = "60px Comic Sans MS";
        ctx.fillStyle = "red";
        ctx.fillText("Your time: " + min + " : " + sec, 0,canvas.height*0.5);

        ctx.restore();

    }

}