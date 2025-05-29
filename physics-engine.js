// Physics Engine Module
// Handles ball physics, platform collisions, and particle systems

class Ball {
    constructor(x, y, radius, material, weight) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.radius = radius;
        this.material = material;
        this.weight = weight;
        this.weightConfig = WEIGHT_SETTINGS[weight];
        this.active = true;
        this.trail = [];
        
        // Generate static texture pattern once
        this.speckles = [];
        this.patches = [];
        this.imperfections = [];
        this.mineralFormations = [];
        this.crystalInclusions = [];
        this.quartzVeins = [];
        this.micaClusters = [];
        this.heightVariations = [];
        this.generateTexture();
    }
    
    generateTexture() {
        // Premium natural granite texture with high contrast and depth
        
        // Bright white quartz veins - the defining feature of granite
        this.quartzVeins = [];
        const veinCount = 12;
        for (let i = 0; i < veinCount; i++) {
            const startAngle = (i * 0.8 + Math.sin(i * 0.4) * 2) * Math.PI * 2;
            const startDistance = (i * 0.15) % (this.radius * 0.3);
            const endAngle = startAngle + (Math.sin(i * 0.6) * 0.8 + 0.4);
            const endDistance = startDistance + (i % 4) * 8 + 15;
            
            this.quartzVeins.push({
                startX: Math.cos(startAngle) * startDistance,
                startY: Math.sin(startAngle) * startDistance,
                endX: Math.cos(endAngle) * Math.min(endDistance, this.radius * 0.85),
                endY: Math.sin(endAngle) * Math.min(endDistance, this.radius * 0.85),
                width: 1.5 + (i % 3) * 0.8,
                brightness: 0.8 + (i % 2) * 0.2,
                roughness: Math.sin(i * 0.5) * 0.5 + 1
            });
        }
        
        // Large mineral formations with sharp definition
        this.mineralFormations = [];
        const formationCount = 45;
        for (let i = 0; i < formationCount; i++) {
            const angle = (i * 1.6 + Math.sin(i * 0.12) * 1.8) % (Math.PI * 2);
            const distance = (i * 0.22 + Math.cos(i * 0.1) * 18) % (this.radius * 0.8);
            this.mineralFormations.push({
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                size: (i % 9) + 5,
                mineralType: i % 4, // 0=quartz, 1=feldspar, 2=mica, 3=biotite
                contrast: 0.6 + (i % 3) * 0.3, // High contrast
                height: (i % 5) * 0.4 + 0.2, // Surface height variation
                sharpness: 0.7 + (i % 2) * 0.3
            });
        }
        
        // Sharp dark mica clusters - high contrast
        this.micaClusters = [];
        const micaCount = 25;
        for (let i = 0; i < micaCount; i++) {
            const angle = (i * 2.1) * Math.PI * 2;
            const distance = (i * 0.3) % (this.radius * 0.75);
            this.micaClusters.push({
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                size: (i % 6) + 3,
                darkness: 0.8 + (i % 2) * 0.2,
                depth: 0.3 + (i % 3) * 0.2,
                edges: 4 + (i % 3) // Angular, crystalline edges
            });
        }
        
        // Fine mineral speckles with dramatic contrast
        const fineSpeckleCount = 180;
        for (let i = 0; i < fineSpeckleCount; i++) {
            const angle = (i * 2.2 + Math.sin(i * 0.07) * 0.9) % (Math.PI * 2);
            const distance = (i * 0.18 + Math.sin(i * 0.2) * 10) % (this.radius * 0.92);
            this.speckles.push({
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                size: (i % 6) * 0.2 + 0.4,
                mineralType: i % 4,
                contrast: 0.7 + (i % 3) * 0.3, // High contrast
                height: (i % 4) * 0.1 + 0.05,
                sharpness: 0.8 + (i % 2) * 0.2
            });
        }
        
        // Surface height variations for micro-shadows
        this.heightVariations = [];
        const heightCount = 35;
        for (let i = 0; i < heightCount; i++) {
            const angle = (i * 1.5 + Math.cos(i * 0.25) * 1.4) % (Math.PI * 2);
            const distance = (i * 0.25) % (this.radius * 0.7);
            this.heightVariations.push({
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                size: (i % 8) + 4,
                height: 0.4 + (i % 4) * 0.3,
                slope: Math.sin(i * 0.3) * 0.8 + 1.2
            });
        }
        
        // Natural stone color bands with sharp transitions
        const colorBandCount = 6;
        for (let i = 0; i < colorBandCount; i++) {
            const angle = (i * 1.1 + Math.sin(i * 0.4) * 2.5) * Math.PI * 2;
            const distance = (i * 0.18 + Math.cos(i * 0.15) * 22) % (this.radius * 0.75);
            this.patches.push({
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                size: (i % 10) + 8,
                colorVariation: i % 5,
                contrast: 0.5 + (i % 4) * 0.2, // Sharp color transitions
                height: 0.2 + (i % 3) * 0.15,
                definition: 0.8 + (i % 2) * 0.2 // Sharp vs soft edges
            });
        }
        
        // Surface imperfections and micro-fractures with depth
        this.imperfections = [];
        const imperfectionCount = 20;
        for (let i = 0; i < imperfectionCount; i++) {
            const angle = (i * 1.3) * Math.PI * 2;
            const distance = (i * 0.22) % (this.radius * 0.8);
            this.imperfections.push({
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                length: 2 + (i % 7) * 1.2,
                width: 0.3 + (i % 3) * 0.2,
                angle: angle + Math.sin(i * 0.25) * 1.5,
                depth: 0.3 + (i % 4) * 0.2, // Deeper shadows
                sharpness: 0.6 + (i % 3) * 0.3
            });
        }
        
        // Crystal inclusions with high reflectivity
        this.crystalInclusions = [];
        const crystalCount = 18;
        for (let i = 0; i < crystalCount; i++) {
            const angle = (i * 2.3) * Math.PI * 2;
            const distance = (i * 0.3) % (this.radius * 0.65);
            this.crystalInclusions.push({
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                size: 0.6 + (i % 4) * 0.4,
                facets: 3 + (i % 4),
                reflectivity: 0.8 + (i % 2) * 0.2, // Very reflective
                orientation: angle + Math.sin(i * 0.3) * Math.PI,
                brightness: 0.9 + (i % 2) * 0.1
            });
        }
    }
    
    update() {
        if (!this.active) return;
        
        // Physics with weight-specific gravity
        const effectiveGravity = PHYSICS_CONSTANTS.gravity * (this.weightConfig ? this.weightConfig.gravityMultiplier : 1.0);
        this.vy += effectiveGravity;
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= PHYSICS_CONSTANTS.friction;
        this.vy *= PHYSICS_CONSTANTS.friction;
        
        // Wall collisions
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.vx *= -PHYSICS_CONSTANTS.bounce;
        }
        if (this.x + this.radius > canvas.width) {
            this.x = canvas.width - this.radius;
            this.vx *= -PHYSICS_CONSTANTS.bounce;
        }
        
        // Floor collision with weight-specific bounce
        if (this.y + this.radius > canvas.height - 35) {
            this.y = canvas.height - 35 - this.radius;
            
            // Weight-specific floor bounce behavior
            if (this.weight === 'heavy') {
                // Heavy balls stop completely - absolutely no bouncing
                this.vy = 0;
                this.vx = 0;
            } else if (this.weight === 'medium') {
                // Medium weight - moderate bounce
                this.vy *= -PHYSICS_CONSTANTS.bounce * 0.5;
                this.vx *= 0.6;
                
                // Stop small bounces
                if (Math.abs(this.vy) < 1.0) {
                    this.vy = 0;
                    this.vx *= 0.8;
                }
            } else {
                // Light weight - normal bounce
                this.vy *= -PHYSICS_CONSTANTS.bounce;
                this.vx *= 0.8;
                
                // Stop small bounces
                if (Math.abs(this.vy) < 0.5) {
                    this.vy = 0;
                    this.vx *= 0.9;
                }
            }
            
            // Only create impact effect if there was significant velocity
            if (Math.abs(this.vy) > 1.0 || this.weight !== 'heavy') {
                this.createImpactEffect();
            }
        }
        
        // Update trail
        this.trail.push({x: this.x, y: this.y, alpha: 1});
        if (this.trail.length > 3) this.trail.shift();
        this.trail.forEach((point, i) => {
            point.alpha = (i + 1) / this.trail.length * 0.2;
        });
        
        // Check platform collisions
        this.checkPlatformCollisions();
    }
    
    checkPlatformCollisions() {
        platforms.forEach(platform => {
            if (platform.checkCollision(this)) {
                platform.handleCollision(this);
            }
        });
    }
    
    createImpactEffect() {
        const stoneColor = '#666666'; // Gray stone debris
        const mass = this.weightConfig ? this.weightConfig.mass : 1.0;
        const particleCount = Math.floor(mass * 8) + 6; // More particles for stone impact
        
        for (let i = 0; i < particleCount; i++) {
            const speed = (Math.random() * 3 + 1) * mass;
            particles.push(new Particle(
                this.x + (Math.random() - 0.5) * this.radius,
                this.y + this.radius,
                (Math.random() - 0.5) * speed,
                -Math.random() * speed * 0.7,
                stoneColor,
                1.5 * mass
            ));
        }
    }
    
    createWeightBasedImpactEffect(impactForce) {
        const mass = this.weightConfig ? this.weightConfig.mass : 1.0;
        const particleCount = Math.floor(impactForce * 5) + 4; // More particles for stone
        
        // Color based on impact intensity - stone appropriate colors
        let effectColor = '#888888'; // Light gray stone
        if (impactForce > 4) effectColor = '#aa6666'; // Heavy impact - reddish stone
        else if (impactForce > 2) effectColor = '#aa8866'; // Medium impact - brownish stone
        else effectColor = '#777777'; // Light impact - standard gray stone
        
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI;
            const speed = (Math.random() * impactForce + 1) * 0.8;
            
            particles.push(new Particle(
                this.x + (Math.random() - 0.5) * this.radius * 1.5,
                this.y + this.radius,
                Math.cos(angle) * speed * (Math.random() - 0.5) * 2,
                -Math.sin(angle) * speed,
                effectColor,
                1.0 + impactForce * 0.2
            ));
        }
    }
    
    createHeavyImpactEffect(impactForce) {
        // Special effect for when heavy ball breaks through platforms
        const burstCount = Math.floor(impactForce * 6) + 8;
        
        for (let i = 0; i < burstCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * impactForce * 1.5 + 2;
            
            particles.push(new Particle(
                this.x + (Math.random() - 0.5) * 40,
                this.y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                i % 3 === 0 ? '#ff4444' : '#ffaa00',
                1.5 + Math.random() * 0.5
            ));
        }
    }
}

class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.broken = false;
    }
    
    checkCollision(ball) {
        // Check if ball is touching platform from above
        return !this.broken &&
               ball.vy > 0 && // Only when falling
               ball.y + ball.radius >= this.y &&
               ball.y - ball.radius <= this.y + this.height &&
               ball.x + ball.radius >= this.x && 
               ball.x - ball.radius <= this.x + this.width;
    }
    
    handleCollision(ball) {
        if (this.broken) return;
        
        // Position ball just above platform
        ball.y = this.y - ball.radius;
        
        // Calculate impact force
        const mass = ball.weightConfig ? ball.weightConfig.mass : 1.0;
        const impactForce = Math.abs(ball.vy) * mass;
        
        if (ball.weight === 'light') {
            // Light ball: bounces with energy loss
            const bounceVelocity = ball.vy * -0.7; // 70% energy retention
            
            if (Math.abs(bounceVelocity) < 1.0) {
                // Too slow to bounce, settle on platform
                ball.vy = 0;
                ball.vx *= 0.8;
            } else {
                ball.vy = bounceVelocity;
                ball.vx *= 0.9;
            }
            
        } else if (ball.weight === 'medium') {
            // Medium ball: stops completely, no bouncing
            ball.vy = 0;
            ball.vx = 0;
            
        } else if (ball.weight === 'heavy') {
            // Heavy ball: breaks through with enough force
            if (impactForce > 3.0) {
                this.broken = true;
                ball.vy *= 0.6; // Lose some speed but continue
            } else {
                // Not enough force, minimal bounce
                ball.vy = ball.vy * -0.1;
                ball.vx *= 0.7;
            }
        }
    }
    
    createPlatformImpactEffect(ball, impactForce) {
        // Create platform deformation effect for heavy impacts
        const particleCount = Math.floor(impactForce * 3) + 2;
        const maxSpeed = Math.min(8, impactForce * 1.5);
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 0.5) + (Math.random() - 0.5) * Math.PI * 0.8;
            const speed = Math.random() * maxSpeed + 1;
            
            particles.push(new Particle(
                ball.x + (Math.random() - 0.5) * 30,
                this.y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                impactForce > 3 ? '#ffaa00' : '#888888',
                1.0 + impactForce * 0.2
            ));
        }
    }
    
    createBreakEffect(ball, impactForce) {
        // Minimal breaking effect for heavy balls - just gray debris
        const pieces = Math.floor(impactForce * 3) + 6;
        
        for (let i = 0; i < pieces; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * (impactForce * 1.5) + 1;
            
            particles.push(new Particle(
                ball.x + (Math.random() - 0.5) * this.width * 0.5,
                this.y + this.height / 2,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                '#555555', // Just gray debris
                1.0 + impactForce * 0.2
            ));
        }
    }
}

class Particle {
    constructor(x, y, vx, vy, color, life = 1) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.size = Math.random() * 4 + 2;
        this.decay = 0.008 + Math.random() * 0.007;
        this.rotation = Math.random() * Math.PI * 2;
        this.angularVelocity = (Math.random() - 0.5) * 0.2;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += PHYSICS_CONSTANTS.gravity * 0.15; // Particles affected by gravity
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.life -= this.decay;
        this.size *= 0.995;
        this.rotation += this.angularVelocity;
        
        // Bounce off floor
        if (this.y > canvas.height - 35) {
            this.y = canvas.height - 35;
            this.vy *= -0.3;
            this.vx *= 0.8;
        }
    }
    
    isDead() {
        return this.life <= 0 || this.size < 0.5;
    }
}

// Physics constants
const PHYSICS_CONSTANTS = {
    gravity: 0.25,
    friction: 0.98,
    bounce: 0.6
};

// Weight configurations with realistic stone physics
const WEIGHT_SETTINGS = {
    light: {
        mass: 0.4,
        bounceMultiplier: 1.2,
        gravityMultiplier: 0.6,
        platformBreak: false,
        color: '#e8f4ff',
        glow: '#c8d8ff',
        trailColor: '#b8d0ff'
    },
    medium: {
        mass: 1.5, // Heavier
        bounceMultiplier: 0.0, // Zero bounce
        gravityMultiplier: 1.2, // More gravity
        platformBreak: false,
        color: '#f0f6ff',
        glow: '#d0d8ff',
        trailColor: '#a8c0ff'
    },
    heavy: {
        mass: 2.2,
        bounceMultiplier: 0.05, // Almost no bounce
        gravityMultiplier: 1.8,
        platformBreak: true,
        color: '#f4f8ff',
        glow: '#d8e0ff',
        trailColor: '#98b0ff'
    }
};
