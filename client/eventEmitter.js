const events = {};

/**
 * Subscribe to an event.
 * @param {string} eventName - Name of the event.
 * @param {function} handler - Function to call when the event is emitted.
 */
export function on(eventName, handler) {
    if (!events[eventName]) {
        events[eventName] = [];
    }
    events[eventName].push(handler);
}

/**
 * Emit an event, calling all subscribed handlers.
 * @param {string} eventName - Name of the event.
 * @param {any} data - Data to pass to the event handler.
 */
export function emit(eventName, data) {
    if (events[eventName]) {
        events[eventName].forEach(handler => handler(data));
    }
}
