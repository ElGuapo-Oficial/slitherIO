import { on } from './eventEmitter.js';
import { GameRules } from './gameRules.js';
import { mouseX, mouseY, speed } from './events.js';
import { Snake } from './snake.js';
import { initSocket, sendOrbCollision, sendSnakePosition } from './sockets.js';
import { Orbs } from './orbs.js';

const game = async () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");    
    const snake = new Snake();  // Local player's snake
    let opponentSnakes = [];
    let orbsInstance;
    let gameRules;

    initSocket();  // Initialize the WebSocket connection

    // Handle initialData event from WebSocket
    on('initialData', ({ orbs, gameSize }) => {
        // Set up the game size and initialize the orbs
        canvas.width = gameSize.width;
        canvas.height = gameSize.height;

        // Initialize Orbs instance and GameRules with the orbs and snake
        orbsInstance = new Orbs(orbs);
        gameRules = new GameRules(orbsInstance.getOrbs(), snake);

        // Start the game loop after receiving the initial data
        gameLoop();
    });

    // Handle updateOrbs event from WebSocket (orb updates from the server)
    on('updateOrbs', (newOrbs) => {
        orbsInstance.updateOrbs(newOrbs);  // Update the Orbs instance
    });

    // Handle allSnakePositions event from WebSocket (snake positions from other players)
    on('allSnakesPositions', (allSnakes) => {
        console.log("Received updated snake positions:", allSnakes);
        opponentSnakes = allSnakes;  // Store the snake positions for drawing in the game loop
    });

    // The game loop
    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Fill the entire canvas with black
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Move and draw the local player's snake
        snake.moveSnake(mouseX, mouseY, speed);
        sendSnakePosition(snake.getSnakePosition())
        snake.drawSnake(ctx);

        // Draw opponent snakes
        opponentSnakes.forEach((opponentSnake) => {
            opponentSnake.forEach((segment) => {
                ctx.fillStyle = "blue";  // Different color for the opponent
                ctx.beginPath();
                ctx.arc(segment.x, segment.y, snake.snakeSize, 0, Math.PI * 2);
                ctx.fill();
            });
        });

        // Check for orb collisions
        const eatenOrbIndex = gameRules.checkCollision();
        if (eatenOrbIndex !== null) {
            snake.grow();
            sendOrbCollision(eatenOrbIndex);  // Notify the server if an orb was eaten
        }

        // Draw orbs
        orbsInstance.drawOrbs(ctx);

        // Continue the game loop
        requestAnimationFrame(gameLoop);
    }
};

game();  // Start the game
