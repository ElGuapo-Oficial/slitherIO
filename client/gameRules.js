// gameRules.js
// This file defines the GameRules class, which includes collision detection and prepared for future game logic.

export class GameRules {
    constructor(orbs, snake) {
        this.orbs = orbs;
        this.snake = snake;
    }

    checkCollision() {
        const snakePosition = this.snake.getSnakePosition();  // Get the snake's body positions
        const snakeHead = snakePosition[0];  // The head is the first element of the snake

        for (let index = 0; index < this.orbs.length; index++) {
            const orb = this.orbs[index];
            const orbRadius = orb.radius || 5;  // Default radius if not set

            // Use Math.hypot for Euclidean distance between orb and snake head
            if (Math.hypot(orb.x - snakeHead.x, orb.y - snakeHead.y) < this.snake.snakeSize / 2 + orbRadius) {
                this.orbs = this.orbs.filter(o => o.id !== orb.id);
                return orb;  // Return the eaten orb
            }
        }

        return null;  // No collision
    }
}
