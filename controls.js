// Controls Module
// Handles UI controls, weight selection, and user interactions

let currentWeight = 'light';

function setWeight(weight) {
    currentWeight = weight;
    
    // Update button states
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Set active button
    const activeBtn = document.getElementById(weight + 'Btn');
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // If currently running, restart with new weight
    if (isRunning) {
        resetSequence();
        setTimeout(() => {
            createScene();
            startSequence();
        }, 100);
    } else {
        // Just recreate scene with new weight
        createScene();
        draw();
    }
}

function initializeButtons() {
    const startBtn = document.getElementById('startBtn');
    const lightBtn = document.getElementById('lightBtn');
    const mediumBtn = document.getElementById('mediumBtn');
    const heavyBtn = document.getElementById('heavyBtn');
    
    if (startBtn) {
        startBtn.onclick = function() {
            resetSequence();
            setTimeout(startSequence, 100);
        };
    }
    
    if (lightBtn) {
        lightBtn.onclick = function() {
            setWeight('light');
        };
    }
    
    if (mediumBtn) {
        mediumBtn.onclick = function() {
            setWeight('medium');
        };
    }
    
    if (heavyBtn) {
        heavyBtn.onclick = function() {
            setWeight('heavy');
        };
    }
}

// Initialize controls when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeButtons();
});

// Export for access from other modules
window.setWeight = setWeight;
window.currentWeight = () => currentWeight;
