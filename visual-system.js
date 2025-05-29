
// Visual System Module
// Handles all rendering, lighting, materials, and visual effects

// Physically accurate directional lighting system
const lightSource = {
    x: -0.4,  // Light comes from upper-left
    y: -0.6,  // Above and slightly to the left
    z: 0.8,   // Forward toward viewer
    intensity: 1.0,
    color: { r: 255, g: 252, b: 248 } // Warm studio light
};

// Realistic granite material properties
const materials = {
    granite: {
        baseColor: '#6a6a6a',
        lightGray: '#8a8a8a', 
        darkGray: '#4a4a4a',
        speckleLight: '#9a9a9a',
        speckleDark: '#3a3a3a',
        shadow: 'rgba(0,0,0,0.8)'
    }
};

// Add draw methods to Ball class
Ball.prototype.draw = function() {
    if (!this.active) return;
    
    const mat = materials[this.material];
    
    // Draw enhanced trail for motion blur with granite-appropriate colors
    this.trail.forEach((point, index) => {
        if (index < this.trail.length - 1) { // Don't draw trail on current position
            ctx.globalAlpha = point.alpha * 0.4; // More subtle for stone
            this.drawBallAt(point.x, point.y, mat, true); // true = isTrail
        }
    });
    
    ctx.globalAlpha = 1;
    this.drawBallAt(this.x, this.y, mat, false);
};

Ball.prototype.drawBallAt = function(x, y, mat, isTrail = false) {
    ctx.save();
    ctx.translate(x, y);
    
    // Physically accurate shadow casting from directional light
    const shadowOffset = {
        x: -lightSource.x * 8,
        y: -lightSource.y * 6 + this.radius + 10
    };
    
    // Dramatically enhanced shadow casting for maximum contrast
    ctx.globalAlpha = 0.9; // Much stronger shadow
    const shadowGradient = ctx.createRadialGradient(
        shadowOffset.x, shadowOffset.y, 0, 
        shadowOffset.x, shadowOffset.y, this.radius * 2.2
    );
    shadowGradient.addColorStop(0, 'rgba(0,0,0,0.95)');  // Almost black center
    shadowGradient.addColorStop(0.2, 'rgba(0,0,0,0.8)'); // Very dark
    shadowGradient.addColorStop(0.5, 'rgba(0,0,0,0.4)'); // Medium dark
    shadowGradient.addColorStop(0.8, 'rgba(0,0,0,0.15)'); // Light shadow
    shadowGradient.addColorStop(1, 'rgba(0,0,0,0)');     // Fade out
    ctx.fillStyle = shadowGradient;
    ctx.beginPath();
    ctx.ellipse(shadowOffset.x, shadowOffset.y, this.radius * 1.4, this.radius * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    
    // Dramatically enhanced granite base with extreme contrast
    const baseGradient = ctx.createRadialGradient(
        lightSource.x * this.radius * 0.5, lightSource.y * this.radius * 0.5, 0,
        0, 0, this.radius * 1.4
    );
    baseGradient.addColorStop(0, '#e8e3d8');   // Much brighter granite highlight
    baseGradient.addColorStop(0.1, '#d8d3c8');  // Bright granite
    baseGradient.addColorStop(0.25, '#a8a298'); // Light granite
    baseGradient.addColorStop(0.4, '#888575');  // Medium granite
    baseGradient.addColorStop(0.6, '#4d4538');  // Dark granite
    baseGradient.addColorStop(0.8, '#2a251f');  // Very dark areas
    baseGradient.addColorStop(0.95, '#1a1510'); // Deep shadow
    baseGradient.addColorStop(1, '#0f0a05');    // Almost black edges
    
    ctx.fillStyle = baseGradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Surface height variations creating micro-shadows
    if (this.heightVariations && !isTrail) {
        this.heightVariations.forEach(variation => {
            const shadowIntensity = variation.height * 0.6;
            ctx.globalAlpha = shadowIntensity;
            
            // Create micro-shadow effect
            const microShadow = ctx.createRadialGradient(
                variation.x + 1, variation.y + 1, 0,
                variation.x, variation.y, variation.size
            );
            microShadow.addColorStop(0, 'rgba(25, 20, 15, 0.8)');
            microShadow.addColorStop(0.5, 'rgba(25, 20, 15, 0.3)');
            microShadow.addColorStop(1, 'rgba(25, 20, 15, 0)');
            
            ctx.fillStyle = microShadow;
            ctx.beginPath();
            ctx.arc(variation.x, variation.y, variation.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    }
    
    // Dark mica clusters - high contrast black areas
    if (this.micaClusters && !isTrail) {
        this.micaClusters.forEach(mica => {
            ctx.globalAlpha = mica.darkness;
            
            const micaGradient = ctx.createRadialGradient(
                mica.x, mica.y, 0,
                mica.x, mica.y, mica.size
            );
            micaGradient.addColorStop(0, '#1a1510'); // Very dark mica core
            micaGradient.addColorStop(0.6, '#2a251f'); // Dark mica edge
            micaGradient.addColorStop(1, 'rgba(42, 37, 31, 0)');
            
            ctx.fillStyle = micaGradient;
            ctx.beginPath();
            ctx.arc(mica.x, mica.y, mica.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Add depth shadow
            ctx.globalAlpha = mica.depth;
            ctx.fillStyle = 'rgba(15, 12, 8, 0.8)';
            ctx.beginPath();
            ctx.arc(mica.x + 0.5, mica.y + 0.5, mica.size * 0.8, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    }
    
    // Large mineral formations with sharp definition and high contrast
    if (this.mineralFormations && !isTrail) {
        this.mineralFormations.forEach(formation => {
            const formationNormalX = formation.x / this.radius;
            const formationNormalY = formation.y / this.radius;
            const lightDot = -(formationNormalX * lightSource.x + formationNormalY * lightSource.y);
            const lightIntensity = Math.max(0, lightDot) * formation.contrast;
            
            ctx.globalAlpha = 0.4 + lightIntensity * 0.5;
            
            let formationColor;
            switch(formation.mineralType) {
                case 0: // Quartz - very light, highly reflective
                    formationColor = lightIntensity > 0.4 ? '#e5e0d5' : '#b5b0a5';
                    break;
                case 1: // Feldspar - pinkish gray with high contrast
                    formationColor = lightIntensity > 0.4 ? '#d5c5b8' : '#95857a';
                    break;
                case 2: // Mica - medium contrast
                    formationColor = lightIntensity > 0.4 ? '#95887d' : '#5a4d42';
                    break;
                case 3: // Biotite - very dark
                    formationColor = lightIntensity > 0.4 ? '#4a3d32' : '#2a1f14';
                    break;
            }
            
            // Sharp-edged mineral formation
            const sharpGradient = ctx.createRadialGradient(
                formation.x, formation.y, 0,
                formation.x, formation.y, formation.size * (1 + formation.sharpness)
            );
            sharpGradient.addColorStop(0, formationColor);
            sharpGradient.addColorStop(0.7, formationColor + 'C0');
            sharpGradient.addColorStop(0.95, formationColor + '60');
            sharpGradient.addColorStop(1, formationColor + '00');
            
            ctx.fillStyle = sharpGradient;
            ctx.beginPath();
            ctx.arc(formation.x, formation.y, formation.size * (1 + formation.sharpness), 0, Math.PI * 2);
            ctx.fill();
            
            // Add micro-shadow for surface height
            if (formation.height > 0.3) {
                ctx.globalAlpha = formation.height * 0.4;
                ctx.fillStyle = 'rgba(20, 15, 10, 0.7)';
                ctx.beginPath();
                ctx.arc(formation.x + 1, formation.y + 1, formation.size * 0.7, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        ctx.globalAlpha = 1;
    }
    
    // Bright white quartz veins - the signature of granite
    if (this.quartzVeins && !isTrail) {
        ctx.globalAlpha = 0.9;
        this.quartzVeins.forEach(vein => {
            // Calculate if vein catches light
            const veinAngle = Math.atan2(vein.endY - vein.startY, vein.endX - vein.startX);
            const veinNormalX = Math.cos(vein.angle + Math.PI/2);
            const veinNormalY = Math.sin(vein.angle + Math.PI/2);
            const lightDot = -(veinNormalX * lightSource.x + veinNormalY * lightSource.y);
            const brightness = Math.max(0.4, vein.brightness + (lightDot > 0 ? lightDot * 0.4 : 0));
            
            // Bright white quartz vein
            const veinGradient = ctx.createLinearGradient(
                vein.startX, vein.startY,
                vein.endX, vein.endY
            );
            veinGradient.addColorStop(0, `rgba(255, 252, 248, ${brightness})`);
            veinGradient.addColorStop(0.5, `rgba(240, 235, 228, ${brightness * 0.8})`);
            veinGradient.addColorStop(1, `rgba(225, 220, 215, ${brightness * 0.6})`);
            
            ctx.strokeStyle = veinGradient;
            ctx.lineWidth = vein.width * (1 + vein.roughness * 0.3);
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(vein.startX, vein.startY);
            ctx.lineTo(vein.endX, vein.endY);
            ctx.stroke();
            
            // Add slight glow to bright veins
            if (brightness > 0.7) {
                ctx.globalAlpha = 0.3;
                ctx.strokeStyle = `rgba(255, 255, 255, ${brightness * 0.4})`;
                ctx.lineWidth = vein.width * 1.8;
                ctx.beginPath();
                ctx.moveTo(vein.startX, vein.startY);
                ctx.lineTo(vein.endX, vein.endY);
                ctx.stroke();
            }
        });
        ctx.globalAlpha = 1;
    }
    
    // Fine granite speckles with high contrast
    this.speckles.forEach(speckle => {
        const speckleNormalX = speckle.x / this.radius;
        const speckleNormalY = speckle.y / this.radius;
        const lightDot = -(speckleNormalX * lightSource.x + speckleNormalY * lightSource.y);
        const reflectionIntensity = Math.max(0, lightDot) * speckle.contrast;
        
        ctx.globalAlpha = (0.6 + reflectionIntensity * 0.4) * speckle.sharpness;
        
        let speckleColor;
        switch(speckle.mineralType % 4) {
            case 0: // Bright quartz crystals
                speckleColor = reflectionIntensity > 0.5 ? '#f5f0e5' : '#c5c0b5';
                break;
            case 1: // Feldspar grains - high contrast
                speckleColor = reflectionIntensity > 0.5 ? '#e5d5c8' : '#a5958a';
                break;
            case 2: // Dark mica flakes
                speckleColor = reflectionIntensity > 0.5 ? '#6a5d52' : '#2a1f14';
                break;
            case 3: // Very dark biotite
                speckleColor = reflectionIntensity > 0.5 ? '#4a3d32' : '#1a0f04';
                break;
        }
        
        ctx.fillStyle = speckleColor;
        ctx.beginPath();
        ctx.arc(speckle.x, speckle.y, speckle.size * speckle.sharpness, 0, Math.PI * 2);
        ctx.fill();
        
        // Add micro-shadow for raised speckles
        if (speckle.height > 0.08) {
            ctx.globalAlpha = speckle.height * 0.6;
            ctx.fillStyle = 'rgba(15, 10, 5, 0.8)';
            ctx.beginPath();
            ctx.arc(speckle.x + 0.3, speckle.y + 0.3, speckle.size * 0.6, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    
    // Natural stone color bands with sharp definition
    ctx.globalAlpha = 0.5;
    this.patches.forEach(patch => {
        const patchNormalX = patch.x / this.radius;
        const patchNormalY = patch.y / this.radius;
        const lightDot = -(patchNormalX * lightSource.x + patchNormalY * lightSource.y);
        const lightIntensity = Math.max(0, lightDot) * patch.contrast;
        
        let patchColor;
        switch(patch.colorVariation) {
            case 0: // Very light granite band
                patchColor = lightIntensity > 0.4 ? 'rgba(195, 191, 184, ' : 'rgba(155, 151, 144, ';
                break;
            case 1: // Medium granite band  
                patchColor = lightIntensity > 0.4 ? 'rgba(165, 158, 148, ' : 'rgba(125, 118, 108, ';
                break;
            case 2: // Dark granite band
                patchColor = lightIntensity > 0.4 ? 'rgba(105, 98, 88, ' : 'rgba(65, 58, 48, ';
                break;
            case 3: // Very dark band
                patchColor = lightIntensity > 0.4 ? 'rgba(75, 65, 55, ' : 'rgba(35, 25, 15, ';
                break;
            case 4: // Iron-rich band
                patchColor = lightIntensity > 0.4 ? 'rgba(125, 105, 85, ' : 'rgba(85, 65, 45, ';
                break;
        }
        
        // Sharp vs soft edge definition
        const edgeSharpness = patch.definition;
        const patchGradient = ctx.createRadialGradient(
            patch.x, patch.y, 0,
            patch.x, patch.y, patch.size
        );
        patchGradient.addColorStop(0, patchColor + (patch.contrast + lightIntensity * 0.3) + ')');
        patchGradient.addColorStop(edgeSharpness, patchColor + (patch.contrast * 0.7) + ')');
        patchGradient.addColorStop(1, patchColor + '0)');
        
        ctx.fillStyle = patchGradient;
        ctx.beginPath();
        ctx.arc(patch.x, patch.y, patch.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
    
    // Surface imperfections with enhanced depth and shadows
    if (this.imperfections && !isTrail) {
        ctx.globalAlpha = 0.6;
        this.imperfections.forEach(imp => {
            const impNormalX = Math.cos(imp.angle + Math.PI/2);
            const impNormalY = Math.sin(imp.angle + Math.PI/2);
            const lightDot = -(impNormalX * lightSource.x + impNormalY * lightSource.y);
            const catchesLight = lightDot > 0;
            
            // Enhanced shadow/highlight contrast
            ctx.strokeStyle = catchesLight ? 
                `rgba(220, 215, 205, ${0.7 * imp.sharpness})` : 
                `rgba(15, 10, 5, ${0.9 * imp.depth})`;
            ctx.lineWidth = imp.width * (1 + imp.sharpness * 0.4);
            ctx.save();
            ctx.translate(imp.x, imp.y);
            ctx.rotate(imp.angle);
            ctx.beginPath();
            ctx.moveTo(-imp.length/2, 0);
            ctx.lineTo(imp.length/2, 0);
            ctx.stroke();
            ctx.restore();
            
            // Add deeper shadow for cracks
            if (!catchesLight && imp.depth > 0.4) {
                ctx.globalAlpha = imp.depth * 0.8;
                ctx.strokeStyle = 'rgba(8, 5, 2, 0.9)';
                ctx.lineWidth = imp.width * 0.6;
                ctx.save();
                ctx.translate(imp.x + 0.3, imp.y + 0.3);
                ctx.rotate(imp.angle);
                ctx.beginPath();
                ctx.moveTo(-imp.length/2, 0);
                ctx.lineTo(imp.length/2, 0);
                ctx.stroke();
                ctx.restore();
            }
        });
        ctx.globalAlpha = 1;
    }
    
    // Crystal inclusions with high brightness and reflectivity
    if (this.crystalInclusions && !isTrail) {
        this.crystalInclusions.forEach(crystal => {
            const crystalNormalX = crystal.x / this.radius;
            const crystalNormalY = crystal.y / this.radius;
            const lightDot = -(crystalNormalX * lightSource.x + crystalNormalY * lightSource.y);
            const reflectionIntensity = Math.max(0, lightDot) * crystal.reflectivity;
            
            if (reflectionIntensity > 0.3) {
                ctx.globalAlpha = reflectionIntensity * crystal.brightness;
                // Very bright crystal reflection
                ctx.fillStyle = `rgba(255, 255, 255, ${reflectionIntensity})`;
                ctx.beginPath();
                ctx.arc(crystal.x, crystal.y, crystal.size * 1.2, 0, Math.PI * 2);
                ctx.fill();
                
                // Add sparkle effect for high reflectivity
                if (reflectionIntensity > 0.7) {
                    ctx.globalAlpha = 0.4;
                    ctx.fillStyle = 'rgba(255, 252, 248, 0.8)';
                    ctx.beginPath();
                    ctx.arc(crystal.x, crystal.y, crystal.size * 0.6, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        });
        ctx.globalAlpha = 1;
    }
    
    // Dramatically enhanced physically accurate directional lighting
    const lightIntensity = isTrail ? 0.4 : 1.0; // Much stronger lighting
    const highlightGradient = ctx.createRadialGradient(
        lightSource.x * this.radius * 0.6, lightSource.y * this.radius * 0.6, 0,
        lightSource.x * this.radius * 0.2, lightSource.y * this.radius * 0.2, this.radius * 1.1
    );
    highlightGradient.addColorStop(0, `rgba(${lightSource.color.r}, ${lightSource.color.g}, ${lightSource.color.b}, ${lightIntensity})`);
    highlightGradient.addColorStop(0.15, `rgba(${lightSource.color.r}, ${lightSource.color.g}, ${lightSource.color.b}, ${lightIntensity * 0.7})`);
    highlightGradient.addColorStop(0.35, `rgba(${lightSource.color.r}, ${lightSource.color.g}, ${lightSource.color.b}, ${lightIntensity * 0.3})`);
    highlightGradient.addColorStop(0.6, `rgba(${lightSource.color.r}, ${lightSource.color.g}, ${lightSource.color.b}, ${lightIntensity * 0.1})`);
    highlightGradient.addColorStop(1, `rgba(${lightSource.color.r}, ${lightSource.color.g}, ${lightSource.color.b}, 0)`);
    
    ctx.fillStyle = highlightGradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Dramatically enhanced specular reflection highlight
    if (!isTrail) {
        ctx.globalAlpha = 0.9; // Much stronger specular
        const specularGradient = ctx.createRadialGradient(
            lightSource.x * this.radius * 0.7, lightSource.y * this.radius * 0.7, 0,
            lightSource.x * this.radius * 0.7, lightSource.y * this.radius * 0.7, this.radius * 0.3
        );
        specularGradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');  // Pure white center
        specularGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)'); // Bright white
        specularGradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.3)'); // Medium white
        specularGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');     // Fade out
        
        ctx.fillStyle = specularGradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Dramatically enhanced rim lighting for maximum separation
    if (!isTrail) {
        ctx.globalAlpha = 0.85; // Much stronger rim light
        const rimGradient = ctx.createRadialGradient(0, 0, this.radius * 0.75, 0, 0, this.radius);
        rimGradient.addColorStop(0, 'rgba(255, 252, 248, 0)');
        rimGradient.addColorStop(0.8, 'rgba(255, 252, 248, 0)');
        rimGradient.addColorStop(0.9, 'rgba(255, 252, 248, 0.6)');  // Stronger rim
        rimGradient.addColorStop(0.95, 'rgba(255, 252, 248, 0.9)'); // Very bright rim
        rimGradient.addColorStop(1, 'rgba(255, 255, 255, 1.0)');    // Pure white edge
        
        ctx.fillStyle = rimGradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.globalAlpha = 1;
    ctx.restore();
};

// Add draw method to Platform class
Platform.prototype.draw = function() {
    // Don't draw anything when platform is broken
    if (this.broken) {
        return;
    }
    
    // Physically accurate shadow casting from directional light
    ctx.save();
    ctx.globalAlpha = 0.35;
    const shadowOffset = {
        x: -lightSource.x * 6,
        y: this.height + (-lightSource.y * 4) + 8
    };
    
    const shadowGradient = ctx.createLinearGradient(
        this.x + shadowOffset.x, this.y + shadowOffset.y, 
        this.x + shadowOffset.x, this.y + shadowOffset.y + 18
    );
    shadowGradient.addColorStop(0, 'rgba(0,0,0,0.6)');
    shadowGradient.addColorStop(0.5, 'rgba(0,0,0,0.3)');
    shadowGradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = shadowGradient;
    ctx.fillRect(this.x + shadowOffset.x, this.y + shadowOffset.y, this.width, 18);
    ctx.restore();
    
    // Main platform with premium metallic gradient
    const platformGradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    platformGradient.addColorStop(0, '#8a8a8a');
    platformGradient.addColorStop(0.1, '#707070');
    platformGradient.addColorStop(0.5, '#5a5a5a');
    platformGradient.addColorStop(0.9, '#4a4a4a');
    platformGradient.addColorStop(1, '#3a3a3a');
    
    ctx.fillStyle = platformGradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Top highlight based on directional light
    const lightIntensity = Math.max(0, -lightSource.y); // Light coming from above
    const topHighlight = ctx.createLinearGradient(this.x, this.y, this.x, this.y + 4);
    topHighlight.addColorStop(0, `rgba(255, 252, 248, ${0.6 * lightIntensity})`);
    topHighlight.addColorStop(1, `rgba(255, 252, 248, ${0.1 * lightIntensity})`);
    ctx.fillStyle = topHighlight;
    ctx.fillRect(this.x, this.y, this.width, 4);
    
    // Subtle texture lines for realism
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;
    for (let i = 1; i < 4; i++) {
        const y = this.y + (this.height / 4) * i;
        ctx.beginPath();
        ctx.moveTo(this.x, y);
        ctx.lineTo(this.x + this.width, y);
        ctx.stroke();
    }
    
    // Directional edge glow effect
    ctx.save();
    ctx.globalAlpha = 0.25;
    const edgeGlow = ctx.createLinearGradient(
        this.x + lightSource.x * 3, this.y - 3, 
        this.x - lightSource.x * 3, this.y + 3
    );
    edgeGlow.addColorStop(0, `rgba(${lightSource.color.r}, ${lightSource.color.g}, ${lightSource.color.b}, 0.4)`);
    edgeGlow.addColorStop(0.5, `rgba(${lightSource.color.r}, ${lightSource.color.g}, ${lightSource.color.b}, 0.2)`);
    edgeGlow.addColorStop(1, `rgba(${lightSource.color.r}, ${lightSource.color.g}, ${lightSource.color.b}, 0)`);
    ctx.fillStyle = edgeGlow;
    ctx.fillRect(this.x, this.y - 3, this.width, 6);
    ctx.restore();
    
    // Bottom darker edge for depth
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(this.x, this.y + this.height - 2, this.width, 2);
};

// Add draw method to Particle class
Particle.prototype.draw = function() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    
    // Make particles more visible on dark background with glow effect
    const displayColor = this.color === '#f8fcff' || this.color === '#f2f8ff' ? '#ffffff' : this.color;
    
    // Glow effect for bright particles
    if (this.color === '#ffdd00' || this.color === '#ff4444' || this.color === '#ffaa00') {
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }
    
    ctx.fillStyle = displayColor;
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Reset shadow
    ctx.shadowBlur = 0;
    
    ctx.restore();
};

// Background rendering function
function drawBackground() {
    // Dramatic studio photography background - pronounced radial gradient
    const studioGradient = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.4, 0,
        canvas.width * 0.5, canvas.height * 0.4, canvas.width * 0.8
    );
    studioGradient.addColorStop(0, '#5a5550');    // Much lighter center
    studioGradient.addColorStop(0.3, '#4a453f');  // Medium transition
    studioGradient.addColorStop(0.6, '#3a3530');  // Darker ring
    studioGradient.addColorStop(0.8, '#2a251f');  // Very dark edges
    studioGradient.addColorStop(1, '#1a1510');    // Deep black corners
    
    ctx.fillStyle = studioGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Enhanced center spotlight for dramatic contrast
    const centerSpotlight = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.35, 0,
        canvas.width * 0.5, canvas.height * 0.35, canvas.width * 0.6
    );
    centerSpotlight.addColorStop(0, 'rgba(255, 252, 248, 0.25)'); // Bright center
    centerSpotlight.addColorStop(0.2, 'rgba(250, 248, 245, 0.15)'); // Strong highlight
    centerSpotlight.addColorStop(0.4, 'rgba(245, 243, 240, 0.08)'); // Medium transition  
    centerSpotlight.addColorStop(0.7, 'rgba(240, 238, 235, 0.03)'); // Subtle fade
    centerSpotlight.addColorStop(1, 'rgba(235, 233, 230, 0)');     // Complete fade
    
    ctx.fillStyle = centerSpotlight;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Secondary dramatic lighting layer
    const dramaticLayer = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.3, 0,
        canvas.width * 0.5, canvas.height * 0.3, canvas.width * 0.5
    );
    dramaticLayer.addColorStop(0, 'rgba(255, 255, 255, 0.12)'); // Very bright center
    dramaticLayer.addColorStop(0.3, 'rgba(255, 253, 250, 0.06)'); // Bright falloff
    dramaticLayer.addColorStop(0.6, 'rgba(250, 248, 245, 0.02)'); // Gentle transition
    dramaticLayer.addColorStop(1, 'rgba(245, 243, 240, 0)');      // Fade to nothing
    
    ctx.fillStyle = dramaticLayer;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Color utility functions
Ball.prototype.lightenColor = function(color, factor) {
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.substr(0, 2), 16) * (1 + factor));
    const g = Math.min(255, parseInt(hex.substr(2, 2), 16) * (1 + factor));
    const b = Math.min(255, parseInt(hex.substr(4, 2), 16) * (1 + factor));
    return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
};

Ball.prototype.darkenColor = function(color, factor) {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) * (1 - factor));
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) * (1 - factor));
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) * (1 - factor));
    return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
};
