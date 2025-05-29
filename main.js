// Main Module
// Coordinates all systems and manages the simulation loop

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let balls = [];
let platforms = [];
let particles = [];
let isRunning = false;
let animationId = null;
let sequenceStep = 0;

function createScene() {
    balls = [];
    platforms = [];
    particles = [];
    sequenceStep = 0;
    
    // Single granite marble at the top center with current weight (25% smaller)
    balls.push(new Ball(canvas.width * 0.5, 70, 30, 'granite', window.currentWeight()));
    
    // Two full-width horizontal platforms at proper intervals
    const platformHeight = 14;
    
    // First platform - upper third
    platforms.push(new Platform(
        0,
        200,
        canvas.width,
        platformHeight
    ));
    
    // Second platform - lower third  
    platforms.push(new Platform(
        0,
        400,
        canvas.width,
        platformHeight
    ));
}

function startSequence() {
    if (isRunning) return;
    
    isRunning = true;
    
    // Reset platforms to unbroken state
    platforms.forEach(platform => {
        platform.broken = false;
    });
    
    // Give single ball minimal initial velocity for mesmerizing drop
    balls[0].vy = 0.2;
    balls[0].vx = 0;
    
    gameLoop();
}

function resetSequence() {
    isRunning = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    // Controls stay visible
    createScene();
    draw();
}

function gameLoop() {
    if (!isRunning) return;
    
    // Update all objects
    balls.forEach(ball => ball.update());
    particles.forEach(particle => particle.update());
    
    // Remove dead particles
    particles = particles.filter(particle => !particle.isDead());
    
    draw();
    
    // Continue loop
    animationId = requestAnimationFrame(gameLoop);
}

function draw() {
    // Draw background
    drawBackground();
    
    // Draw scene elements
    platforms.forEach(platform => platform.draw());
    particles.forEach(particle => particle.draw());
    balls.forEach(ball => ball.draw());
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize buttons (handled by controls.js)
    initializeButtons();
    
    // Create initial scene
    createScene();
    draw();
    
    // Auto-start after 2 seconds on light mode
    setTimeout(() => {
        if (!isRunning) {
            startSequence();
        }
    }, 2000);
});

// Make functions globally available
window.createScene = createScene;
window.startSequence = startSequence;
window.resetSequence = resetSequence;
window.isRunning = () => isRunning;
