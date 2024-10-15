export let mouseX = window.innerWidth / 2;
export let mouseY = window.innerHeight / 2;
const defaultSpeed = 2
export let speed = defaultSpeed;

// Event listener for mouse movement
window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

window.addEventListener("mousedown", () => {
    speed += 2;
});

window.addEventListener("mouseup", () => {
    speed = defaultSpeed;
});