/**
 * ParticleSystem creates beautiful floating particles and confetti effects
 */
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.confetti = [];
        this.isActive = false;
        this.animationFrame = null;
        
        this.particlesContainer = document.getElementById('particles-container');
        this.confettiContainer = document.getElementById('confetti-container');
        
        this.initializeParticles();
    }

    /**
     * Initialize background particles
     */
    initializeParticles() {
        if (!this.particlesContainer) return;
        
        // Create floating particles
        for (let i = 0; i < 50; i++) {
            this.createParticle();
        }
        
        this.startAnimation();
    }

    /**
     * Create a single floating particle
     */
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random animation delay and duration
        const delay = Math.random() * 6;
        const duration = 4 + Math.random() * 4;
        particle.style.animationDelay = delay + 's';
        particle.style.animationDuration = duration + 's';
        
        // Random size
        const size = 2 + Math.random() * 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random opacity
        particle.style.opacity = 0.3 + Math.random() * 0.4;
        
        this.particlesContainer.appendChild(particle);
        this.particles.push(particle);
    }

    /**
     * Start particle animation loop
     */
    startAnimation() {
        this.isActive = true;
        this.animate();
    }

    /**
     * Stop particle animations
     */
    stopAnimation() {
        this.isActive = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }

    /**
     * Animation loop
     */
    animate() {
        if (!this.isActive) return;
        
        // Update confetti if active
        this.updateConfetti();
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    /**
     * Create confetti explosion
     * @param {number} count - Number of confetti pieces
     * @param {number} duration - Duration in milliseconds
     */
    createConfetti(count = 100, duration = 3000) {
        if (!this.confettiContainer) return;
        
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.createConfettiPiece(colors[Math.floor(Math.random() * colors.length)], duration);
            }, Math.random() * 1000); // Stagger creation
        }
    }

    /**
     * Create a single confetti piece
     * @param {string} color - Confetti color
     * @param {number} duration - Fall duration
     */
    createConfettiPiece(color, duration) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = color;
        
        // Random horizontal position
        confetti.style.left = Math.random() * 100 + '%';
        
        // Random size and shape
        const size = 4 + Math.random() * 8;
        confetti.style.width = size + 'px';
        confetti.style.height = size + 'px';
        
        // Random rotation and animation
        const rotation = Math.random() * 360;
        confetti.style.transform = `rotate(${rotation}deg)`;
        
        // Set animation duration
        confetti.style.animationDuration = (duration / 1000) + 's';
        
        this.confettiContainer.appendChild(confetti);
        this.confetti.push(confetti);
        
        // Remove after animation
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.remove();
            }
            const index = this.confetti.indexOf(confetti);
            if (index > -1) {
                this.confetti.splice(index, 1);
            }
        }, duration);
    }

    /**
     * Update confetti positions (if needed for custom physics)
     */
    updateConfetti() {
        // This method can be used for custom confetti physics
        // Currently using CSS animations, but can be extended
    }

    /**
     * Create sparkle effect at specific position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} count - Number of sparkles
     */
    createSparkles(x, y, count = 10) {
        if (!this.particlesContainer) return;
        
        for (let i = 0; i < count; i++) {
            const sparkle = document.createElement('div');
            sparkle.style.position = 'absolute';
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            sparkle.style.width = '6px';
            sparkle.style.height = '6px';
            sparkle.style.background = '#FFD700';
            sparkle.style.borderRadius = '50%';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '999';
            
            // Random direction and distance
            const angle = (Math.PI * 2 * i) / count;
            const distance = 20 + Math.random() * 30;
            const endX = x + Math.cos(angle) * distance;
            const endY = y + Math.sin(angle) * distance;
            
            // Animate sparkle
            sparkle.animate([
                {
                    transform: 'translate(0, 0) scale(0)',
                    opacity: 1
                },
                {
                    transform: `translate(${endX - x}px, ${endY - y}px) scale(1)`,
                    opacity: 1,
                    offset: 0.7
                },
                {
                    transform: `translate(${endX - x}px, ${endY - y}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: 800,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }).onfinish = () => {
                if (sparkle.parentNode) {
                    sparkle.remove();
                }
            };
            
            this.particlesContainer.appendChild(sparkle);
        }
    }

    /**
     * Create floating hearts effect
     * @param {number} count - Number of hearts
     */
    createFloatingHearts(count = 20) {
        if (!this.particlesContainer) return;
        
        const hearts = ['💖', '💕', '💗', '💓', '💝'];
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
                heart.style.position = 'absolute';
                heart.style.fontSize = (12 + Math.random() * 8) + 'px';
                heart.style.left = Math.random() * 100 + '%';
                heart.style.top = '100%';
                heart.style.pointerEvents = 'none';
                heart.style.zIndex = '998';
                
                // Animate upward
                heart.animate([
                    {
                        transform: 'translateY(0) rotate(0deg)',
                        opacity: 0
                    },
                    {
                        transform: 'translateY(-50px) rotate(10deg)',
                        opacity: 1,
                        offset: 0.1
                    },
                    {
                        transform: `translateY(-${100 + Math.random() * 200}px) rotate(${-10 + Math.random() * 20}deg)`,
                        opacity: 0
                    }
                ], {
                    duration: 3000 + Math.random() * 2000,
                    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }).onfinish = () => {
                    if (heart.parentNode) {
                        heart.remove();
                    }
                };
                
                this.particlesContainer.appendChild(heart);
            }, Math.random() * 2000);
        }
    }

    /**
     * Create celebration burst effect
     * @param {number} x - Center X coordinate
     * @param {number} y - Center Y coordinate
     */
    createCelebrationBurst(x, y) {
        // Create sparkles
        this.createSparkles(x, y, 15);
        
        // Create small confetti burst
        setTimeout(() => {
            this.createConfetti(30, 2000);
        }, 200);
        
        // Create floating hearts
        setTimeout(() => {
            this.createFloatingHearts(10);
        }, 500);
    }

    /**
     * Clear all particles and effects
     */
    clearAll() {
        // Clear confetti
        this.confetti.forEach(confetti => {
            if (confetti.parentNode) {
                confetti.remove();
            }
        });
        this.confetti = [];
        
        // Clear temporary sparkles and hearts
        const temporaryElements = this.particlesContainer.querySelectorAll('div:not(.particle)');
        temporaryElements.forEach(element => element.remove());
    }

    /**
     * Reset particle system
     */
    reset() {
        this.clearAll();
        this.stopAnimation();
        
        // Clear existing particles
        this.particles.forEach(particle => {
            if (particle.parentNode) {
                particle.remove();
            }
        });
        this.particles = [];
        
        // Reinitialize
        this.initializeParticles();
    }

    /**
     * Set particle density
     * @param {number} density - Number of particles (10-100)
     */
    setParticleDensity(density) {
        const targetCount = Math.max(10, Math.min(100, density));
        const currentCount = this.particles.length;
        
        if (targetCount > currentCount) {
            // Add more particles
            for (let i = 0; i < targetCount - currentCount; i++) {
                this.createParticle();
            }
        } else if (targetCount < currentCount) {
            // Remove excess particles
            const toRemove = currentCount - targetCount;
            for (let i = 0; i < toRemove; i++) {
                const particle = this.particles.pop();
                if (particle && particle.parentNode) {
                    particle.remove();
                }
            }
        }
    }
}

export { ParticleSystem };