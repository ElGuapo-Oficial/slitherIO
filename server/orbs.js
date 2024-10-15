import { gameWidth, gameHeight } from './gameDimensions.js';

const colors = ["red", "blue", "lime", "yellow", "purple"]; 

export function generateOrbs(count) {
    const orbs = [];
    for (let i = 0; i < count; i++) {
        orbs.push({
            id: i,
            x: Math.random() * gameWidth,
            y: Math.random() * gameHeight,
            time: Math.random() * Math.PI * 2, // Initialize time with a random phase for each orb
            radius: (Math.random() * 5) + 5,
            color: colors[Math.floor(Math.random() * 6)]
        });
    }
    return orbs;
}