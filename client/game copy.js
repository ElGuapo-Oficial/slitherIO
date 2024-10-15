import { GameRules } from './gameRules.js';
import { mouseX, mouseY, speed } from './events.js';
import { Snake } from './snake.js';
import { initSocket, getAllSnakes, sendOrbCollision } from './sockets.js';

// Game canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const snake = new Snake(); // Local player's snake

const game = async () => {
    try {
        // Wait for the initial data from the server (orbs and game size)
        const { orbsInstance, gameSize } = await initSocket();

        // Set canvas dimensions from server
        canvas.width = gameSize.width;
        canvas.height = gameSize.height;

        const gameRules = new GameRules(orbsInstance.getOrbs(), snake); 

        function gameLoop() {
            // Clear the canvas first
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Fill the entire canvas with black
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Move and draw the snake
            snake.moveSnake(mouseX, mouseY, speed);
            snake.drawSnake(ctx);

            // Get all opponents snakes from the server
            const allSnakes = getAllSnakes();
            allSnakes.forEach((opponentSnake) => {
                opponentSnake.forEach((segment) => {
                    // ctx.fillStyle = "blue";  // Different color for the opponent
                    ctx.beginPath();
                    ctx.arc(segment.x, segment.y, snake.snakeSize, 0, Math.PI * 2);
                    ctx.fill();
                });
            });

            const eatenOrbIndex = gameRules.checkCollision();  // Check for orb collision
            if (eatenOrbIndex) {
                snake.grow();
                sendOrbCollision(eatenOrbIndex);  // Notify the server if an orb was eaten
            }

            // Draw the orbs
            orbsInstance.drawOrbs(ctx);

            requestAnimationFrame(gameLoop);
        }

        // Start the game loop after the game size and orbs are ready
        gameLoop();
    } catch (error) {
        console.error('Error during WebSocket connection:', error);
    }
}

// Start the game
game();
