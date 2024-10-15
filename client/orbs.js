export class Orbs {
    constructor(orbs) {
        this.orbs = orbs;
        this.baseOrbRadius = 5;
        this.growthFactor = 0.2;
    }

    // Draw the orbs and check for collision with the snake
    drawOrbs(ctx) {
        // let snakePosition = snake.getSnakePosition();
        
        this.orbs.forEach((orb) => {
            // Increment the 'time' for each orb
            orb.time += 0.2; // Time for growth/shrink cycle

            // Calculate the growing and shrinking effect
            let orbRadius = orb.radius * (1 + Math.sin(orb.time) * this.growthFactor);

            // Draw the orb
            ctx.fillStyle = orb.color;
            ctx.beginPath();
            ctx.arc(orb.x, orb.y, orbRadius, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // Get the orbs array (if needed elsewhere)
    getOrbs() {
        return this.orbs;
    }

    updateOrbs(newOrbs) {
        this.orbs = newOrbs;
    }
}