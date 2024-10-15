// Game canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth-100;
canvas.height = window.innerHeight-100;

// Snake and orb properties
const defaultSpeed = 2;
const colors = ["red", "blue", "lime", "yellow", "purple"]; 

let snake = [{ x: canvas.width / 2, y: canvas.height / 2 }];
let snakeSize = 15;
let speed = defaultSpeed;
let orbs = [];
let baseOrbRadius = 5;
let snakeLength = 1;

// Time factor for orb growth cycle
let time = 0;
const growthFactor = 0.05; // 5% growth

// Mouse position for snake direction
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

// Event listener for mouse movement
window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

window.addEventListener("mousedown", (event) => {
    speed += 2;
});

window.addEventListener("mouseup", (event) => {
    speed = defaultSpeed;
});

// Generate random orbs
for (let i = 0; i < 20; i++) {
    orbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
    });
}

// Game loop
function gameLoop() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Move the snake towards the mouse
    let dx = mouseX - snake[0].x;
    let dy = mouseY - snake[0].y;
    let angle = Math.atan2(dy, dx);

    let newHead = {
        x: snake[0].x + Math.cos(angle) * speed,
        y: snake[0].y + Math.sin(angle) * speed,
    };

    // Add the new head to the snake
    snake.unshift(newHead);

    // Keep the snake the correct length
    if (snake.length > snakeLength) {
        snake.pop();
    }

    // Draw the snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = colors[index % colors.length];
        ctx.beginPath();
        ctx.arc(segment.x, segment.y, snakeSize / 2, 0, Math.PI * 2);
        ctx.fill();
    });

    time += 0.05;

    // Draw the orbs
    orbs.forEach((orb, index) => {
        // Calculate current radius with growth factor (based on sine wave)
        let orbRadius = baseOrbRadius * (1 + Math.sin(time) * growthFactor);

        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orbRadius, 0, Math.PI * 2);
        ctx.fill();

        // Check collision with snake
        if (
            Math.hypot(orb.x - snake[0].x, orb.y - snake[0].y) <
            snakeSize / 2 + orbRadius
        ) {
            orbs.splice(index, 1); // Remove the orb
            snakeLength += 5; // Increase snake length
        }
    });

    // Check collision with canvas boundaries
    if (
        snake[0].x < 0 ||
        snake[0].x > canvas.width ||
        snake[0].y < 0 ||
        snake[0].y > canvas.height
    ) {
        alert("Game Over!");
        window.location.reload();
    }

    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
