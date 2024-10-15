const colors = ["red", "blue", "lime", "yellow", "purple"]; 

export class Snake {
    constructor() {
        // Instance-specific properties
        this.snakePostion = [{ x: window.innerWidth / 2, y: window.innerHeight / 2 }];
        this.snakeSize = 15;
        this.snakeLength = 1;
    }

    // Method to move the snake
    moveSnake(mouseX, mouseY, speed) {
        let dx = mouseX - this.snakePostion[0].x;
        let dy = mouseY - this.snakePostion[0].y;
        // Calculate the angle (direction) from the snake's current position to the target position (dx, dy).
        // This will give us the correct direction for the snake to move toward the target.
        let angle = Math.atan2(dy, dx);

        // Create a new head for the snake by moving it in the direction of the calculated angle.
        // - Math.cos(angle) gives us how much to move horizontally (x-axis) based on the angle.
        // - Math.sin(angle) gives us how much to move vertically (y-axis) based on the angle.
        // Multiplying by 'speed' determines how fast the snake moves in that direction.
        let newHead = {
            x: this.snakePostion[0].x + Math.cos(angle) * speed,  // Move horizontally
            y: this.snakePostion[0].y + Math.sin(angle) * speed,  // Move vertically
        };

        // Add the new head to the snake
        this.snakePostion.unshift(newHead);

        // Keep the snake the correct length
        if (this.snakePostion.length > this.snakeLength) {
            this.snakePostion.pop();
        }
    }

    // Method to draw the snake on the canvas
    drawSnake(ctx) {
        for (let i = this.snakePostion.length - 1; i >= 0; i--) {
            ctx.fillStyle = colors[i % colors.length];
            ctx.beginPath();
            ctx.arc(this.snakePostion[i].x, this.snakePostion[i].y, this.snakeSize, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Method to grow the snake
    grow() {
        this.snakeLength += 5; // Increase the length of the snake
    }

    // Method to return the snake array (positions)
    getSnakePosition() {
        return this.snakePostion;
    }
}
