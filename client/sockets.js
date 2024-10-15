import { on, emit } from './eventEmitter.js';

let socket;

export function initSocket() {
    socket = new WebSocket('ws://localhost:8081');

    socket.onopen = () => {
        console.log("Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
        try {
            const message = JSON.parse(event.data);

            // Emit events based on the message type
            if (message.type === 'initialData') {
                emit('initialData', { orbs: message.orbs, gameSize: message.gameSize });
            } else if (message.type === 'allSnakesPositions') {
                emit('allSnakesPositions', message.data);
            } else if (message.type === 'updateOrbs') {
                emit('updateOrbs', message.data);
            } else {
                console.log(message.message);
            }
        } catch (error) {
            console.log("Error parsing WebSocket message:", error);
        }
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
}

export function sendOrbCollision(eatenOrbIndex) {
    if (socket.readyState === WebSocket.OPEN) {
        const message = {
            type: 'orbCollision',
            eatenOrb: eatenOrbIndex
        };
        socket.send(JSON.stringify(message));  // Send orb collision data to server
    }
}

export function getAllSnakes() {
    // Here we'll subscribe to the 'allSnakePositions' event
    return new Promise((resolve) => {
        on('allSnakesPositions', (data) => {
            resolve(data);
        });
    });
}
