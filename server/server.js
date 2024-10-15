import { WebSocketServer, WebSocket } from 'ws';  // Node.js WebSocket library
import { generateOrbs } from './orbs.js';
import { gameWidth, gameHeight } from './gameDimensions.js';

// Create WebSocket server listening on port 8081
const wss = new WebSocketServer({ port: 8081 });
let orbs = generateOrbs(50);
let players = []; // Store player connections

// Handle new connections
wss.on('connection', (ws) => {
    console.log('New player connected');

    const player = {
        ws: ws,
        snake: []  // Store this player's snake positions here
    };
    players.push(player);

    ws.send(JSON.stringify({
        type: 'initialData',
        gameSize: {
            width: gameWidth,
            height: gameHeight
        },
        orbs: orbs,
        snakes: players.map(p => p.snake)  // Send current snake positions of all players
    }));

    // Broadcast to other players when a new player joins
    players.forEach((player) => {
        if (player !== ws && player.readyState === WebSocket.OPEN) {
            player.send(JSON.stringify({ message: 'A new player has joined!' }));
        }
    });

    // Handle incoming messages from the player
    ws.on('message', (data) => {
        const message = JSON.parse(data);

        if (message.type === 'snakePosition') {
            // Update the current player's snake position
            player.snake = message.data;

            // Broadcast all snake positions to all players
            broadcastAllSnakes(player);
        } else if (message.type === 'orbCollision') {
            const eatenOrb = message.eatenOrb;
            console.log("Orb eaten:", eatenOrb);

            // Remove the orb from the orbs array on the server
            // orbs = orbs.filter(orb => orb.id !== eatenOrb.id);
            orbs = orbs.filter(orb => orb.id !== eatenOrb.id);

            // Broadcast the updated orb list to all players
            broadcastOrbs();
        }
    });

    // Handle player disconnects
    ws.on('close', () => {
        console.log('Player disconnected');
        players = players.filter((player) => player !== ws);
        broadcastAllSnakes();  // Update remaining players about the change
    });
});

// Broadcast all players' snake positions to every connected client
function broadcastAllSnakes(excludePlayer) {
    const snakePositions = players.map(p => p.snake);  // Get positions of all players' snakes
    const message = {
        type: 'allSnakesPositions',
        data: snakePositions
    };

    players.forEach((player) => {
        // Exclude the player who sent the snake position update
        if (player !== excludePlayer && player.ws.readyState === WebSocket.OPEN) {
            player.ws.send(JSON.stringify(message));
        }
    });
}

// Broadcast the updated orbs to all players
function broadcastOrbs() {
    const message = {
        type: 'updateOrbs',
        data: orbs  // Send the updated list of orbs
    };

    players.forEach((player) => {
        if (player.ws.readyState === WebSocket.OPEN) {
            player.ws.send(JSON.stringify(message));
        }
    });
}

console.log('WebSocket server is running on ws://localhost:8081');
