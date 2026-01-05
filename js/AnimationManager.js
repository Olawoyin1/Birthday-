/**
 * AnimationManager handles all Framer Motion animations and DOM manipulation for candles
 */
class AnimationManager {
    constructor() {
        this.candleElements = new Map();
        this.isInitialized = false;
        this.motion = null;
        
        // Initialize Framer Motion when available
        this.initializeFramerMotion();
    }

    /**
     * Initialize Framer Motion library
     */
    initializeFramerMotion() {
        // Using pure CSS and JavaScript animations instead of Framer Motion
        console.log('Using CSS and JavaScript animations for better compatibility');
    }

    /**
     * Initialize candles in the DOM with the specified count
     * @param {number} count - Number of candles to create
     */
    initializeCandles(count) {
        const container = document.getElementById('candles-container');
        if (!container) {
            throw new Error('Candles container not found');
        }

        // Clear existing candles
        container.innerHTML = '';
        this.candleElements.clear();

        // Create candles with staggered animation
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const candleId = `candle-${i}`;
                const candleElement = this.createCandleElement(candleId, i, count);
                container.appendChild(candleElement);
                this.candleElements.set(candleId, candleElement);
                
                // Animate candle entrance
                this.animateCandleEntrance(candleElement, i);
            }, i * 100); // Stagger by 100ms
        }

        this.isInitialized = true;
        return this.candleElements;
    }

    /**
     * Create a single candle DOM element
     * @param {string} candleId - Unique identifier for the candle
     * @param {number} index - Index position of the candle
     * @param {number} total - Total number of candles
     * @returns {HTMLElement} - The candle DOM element
     */
    createCandleElement(candleId, index, total) {
        // Create candle container
        const candleDiv = document.createElement('div');
        candleDiv.className = 'candle';
        candleDiv.dataset.candleId = candleId;
        candleDiv.style.transform = 'translateY(50px) scale(0.8)';
        candleDiv.style.opacity = '0';

        // Create wick
        const wick = document.createElement('div');
        wick.className = 'wick';
        candleDiv.appendChild(wick);

        // Create flame
        const flame = document.createElement('div');
        flame.className = 'flame';
        flame.dataset.candleId = candleId;
        candleDiv.appendChild(flame);

        // Start flame animation
        this.startAdvancedFlameAnimation(flame);

        return candleDiv;
    }

    /**
     * Animate candle entrance with CSS animations
     * @param {HTMLElement} candleElement - The candle element
     * @param {number} index - Candle index for staggered animation
     */
    animateCandleEntrance(candleElement, index) {
        // Use CSS animation with staggered timing
        setTimeout(() => {
            candleElement.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            candleElement.style.transform = 'translateY(0) scale(1)';
            candleElement.style.opacity = '1';
        }, index * 100);
    }

    /**
     * Start advanced flame animation with CSS
     * @param {HTMLElement} flameElement - The flame element to animate
     */
    startAdvancedFlameAnimation(flameElement) {
        // Use CSS animation for flame flickering
        flameElement.style.animation = 'flicker 0.5s ease-in-out infinite alternate';
    }

    /**
     * Animate flame flicker with varying intensity using CSS
     * @param {string} candleId - ID of the candle
     * @param {number} intensity - Flicker intensity (0-1)
     */
    animateFlameFlicker(candleId, intensity) {
        const candleElement = this.candleElements.get(candleId);
        if (!candleElement) return;

        const flame = candleElement.querySelector('.flame');
        if (!flame) return;

        // CSS animation with intensity-based modifications
        const flickerDuration = Math.max(0.1, 0.5 - (intensity * 0.3));
        const flickerScale = 1 + (intensity * 0.5);
        
        flame.style.animation = `flicker ${flickerDuration}s ease-in-out infinite alternate`;
        flame.style.transform = `translateX(-50%) scale(${flickerScale})`;
        flame.style.filter = `hue-rotate(${intensity * 30}deg) brightness(${1 + intensity * 0.3})`;

        setTimeout(() => {
            flame.style.animation = 'flicker 0.5s ease-in-out infinite alternate';
            flame.style.transform = 'translateX(-50%) scale(1)';
            flame.style.filter = 'none';
        }, 1000);
    }

    /**
     * Extinguish a candle with CSS animation
     * @param {string} candleId - ID of the candle to extinguish
     */
    extinguishCandle(candleId) {
        const candleElement = this.candleElements.get(candleId);
        if (!candleElement) return;

        const flame = candleElement.querySelector('.flame');
        if (!flame) return;

        // Add extinguished class to candle
        candleElement.classList.add('extinguished');

        // CSS animation for flame extinguishing
        flame.style.animation = 'none';
        flame.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        flame.style.transform = 'translateX(-50%) scale(0)';
        flame.style.opacity = '0';
        flame.style.filter = 'hue-rotate(60deg) brightness(0)';

        setTimeout(() => {
            if (flame.parentNode) {
                flame.remove();
            }
            this.showAdvancedSmokeEffect(candleId);
        }, 800);
    }

    /**
     * Show advanced smoke effect with CSS animations
     * @param {string} candleId - ID of the candle
     */
    showAdvancedSmokeEffect(candleId) {
        const candleElement = this.candleElements.get(candleId);
        if (!candleElement) return;

        // Create multiple smoke particles
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const smoke = document.createElement('div');
                smoke.className = 'smoke';
                smoke.style.left = `${45 + Math.random() * 10}%`;
                smoke.style.animationDelay = `${Math.random() * 0.5}s`;
                smoke.style.animationDuration = `${2 + Math.random()}s`;
                candleElement.appendChild(smoke);

                // Trigger smoke animation
                setTimeout(() => {
                    smoke.style.opacity = '0.8';
                }, 10);

                // Remove after animation
                setTimeout(() => {
                    if (smoke.parentNode) {
                        smoke.remove();
                    }
                }, 3000);
            }, i * 200);
        }
    }

    /**
     * Show smoke effect (fallback method)
     * @param {string} candleId - ID of the candle
     */
    showSmokeEffect(candleId) {
        const candleElement = this.candleElements.get(candleId);
        if (!candleElement) return;

        const smoke = document.createElement('div');
        smoke.className = 'smoke';
        candleElement.appendChild(smoke);

        setTimeout(() => {
            smoke.style.opacity = '0.8';
        }, 10);

        setTimeout(() => {
            if (smoke.parentNode) {
                smoke.remove();
            }
        }, 2000);
    }

    /**
     * Show celebration effects around the cake with CSS animations
     */
    showCelebrationEffects() {
        const cake = document.querySelector('.cake');
        if (cake) {
            cake.classList.add('celebration-glow');
        }

        // Create sparkle effects
        this.createAdvancedSparkleEffects();
    }

    /**
     * Create advanced sparkle effects with CSS animations
     */
    createAdvancedSparkleEffects() {
        const container = document.querySelector('.cake-container');
        if (!container) return;

        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.style.position = 'absolute';
                sparkle.style.width = '6px';
                sparkle.style.height = '6px';
                sparkle.style.background = '#FFD700';
                sparkle.style.borderRadius = '50%';
                sparkle.style.pointerEvents = 'none';
                sparkle.style.zIndex = '999';
                
                const x = Math.random() * 400;
                const y = Math.random() * 300;
                sparkle.style.left = x + 'px';
                sparkle.style.top = y + 'px';
                
                // CSS animation
                sparkle.style.animation = 'sparkle 1.5s ease-out forwards';
                
                container.appendChild(sparkle);
                
                // Remove after animation
                setTimeout(() => {
                    if (sparkle.parentNode) {
                        sparkle.remove();
                    }
                }, 1500);
            }, i * 100);
        }
    }

    /**
     * Reveal birthday message with advanced animation
     */
    revealBirthdayMessage() {
        // This method is now handled by SlideShowManager
        // Keeping for compatibility
        console.log('Birthday message reveal handled by SlideShowManager');
    }

    /**
     * Handle window resize for responsive behavior
     */
    handleResize() {
        // Recalculate positions and animations if needed
        const container = document.getElementById('candles-container');
        if (container && this.candleElements.size > 0) {
            // Responsive adjustments handled by CSS
            // This method available for future enhancements
        }
    }

    /**
     * Get candle element by ID
     * @param {string} candleId - ID of the candle
     * @returns {HTMLElement|null} - The candle element or null
     */
    getCandleElement(candleId) {
        return this.candleElements.get(candleId) || null;
    }

    /**
     * Check if candle has visible flame
     * @param {string} candleId - ID of the candle
     * @returns {boolean} - True if candle has visible flame
     */
    hasVisibleFlame(candleId) {
        const candleElement = this.candleElements.get(candleId);
        if (!candleElement) return false;
        
        const flame = candleElement.querySelector('.flame');
        return flame !== null && flame.style.opacity !== '0';
    }

    /**
     * Check if candle has visible wick
     * @param {string} candleId - ID of the candle
     * @returns {boolean} - True if candle has visible wick
     */
    hasVisibleWick(candleId) {
        const candleElement = this.candleElements.get(candleId);
        if (!candleElement) return false;
        
        const wick = candleElement.querySelector('.wick');
        return wick !== null;
    }

    /**
     * Reset all animations and effects
     */
    reset() {
        // Remove celebration effects
        const cake = document.querySelector('.cake');
        if (cake) {
            cake.classList.remove('celebration-glow');
        }

        // Clear candles and reinitialize if needed
        this.candleElements.clear();
        this.isInitialized = false;
    }
}

export { AnimationManager };