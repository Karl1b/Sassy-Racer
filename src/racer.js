import Game from "./game.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;

let game = new Game(SCREEN_WIDTH, SCREEN_HEIGHT);
let lastTime = 0;

function gameLoop(timestamp) {
    let dt = timestamp - lastTime;
    lastTime = timestamp;
    // Cleans screen
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    // Updates the Game and all objects.
    game.update(dt);
    // Draws the game and all objects.
    game.draw(ctx);
    // Loop
    requestAnimationFrame(gameLoop);
}
// Start of the gameloop
requestAnimationFrame(gameLoop);