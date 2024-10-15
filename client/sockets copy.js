import { Orbs } from './orbs.js';

let socket;
let allSnakes = [];
let orbs = [];
let gameSize;
let orbsInstance;

export function initSocket1() {
    return new Promise((resolve, reject) => {
        socket = new WebSocket('ws://localhost:8081');

        socket.onopen = () => {
            console.log("Connected to WebSocket server");
        };

        socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);

                if (message.type === 'initialData') {
                    // get initial data from the server
                    orbsInstance = new Orbs(message.orbs);
                    resolve({ orbsInstance, gameSize: message.gameSize });
                } else if (message.type === 'allSnakePositions') {
                    console.log(message.data);
                    allSnakes = message.data;
                } else if (message.type === 'updateOrbs') {
                    console.log("Received updated orbs from server:", message.data);
                    orbsInstance.updateOrbs(message.data); 
                } else {
                    console.log(message.message)
                }
            } catch (error) {
                console.log(error);
            }
        };

        socket.onerror = (error) => {
            reject(error);
        };
    })
}

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
            } else if (message.type === 'allSnakePositions') {
                emit('allSnakePositions', message.data);
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

export function sendSnakePosition(snakePosition) {
    if (socket.readyState === WebSocket.OPEN) {
        const message = {
            type: 'snakePosition',
            data: snakePosition
        };
        console.log("message: ", message);
        socket.send(JSON.stringify(message));
    } else {
        console.error('WebSocket is not open. Cannot send message.');
    }
}

export function sendOrbCollision(eatenOrb) {
    if (socket.readyState === WebSocket.OPEN) {
        const message = {
            type: 'orbCollision',
            orb: eatenOrb
        };
        console.log("Sending orb collision to server:", message);
        socket.send(JSON.stringify(message));  // Send the collision to the server
    } else {
        console.error('WebSocket is not open. Cannot send orb collision message.');
    }
}

export function getAllSnakes() {
    return allSnakes;
}

export function getServerOrbs() {
    return orbs;
}

export function getServerGameSize() {
    return gameSize;
}