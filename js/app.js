import { StateManager } from './StateManager.js';
import { AudioManager } from './AudioManager.js';
import { AnimationManager } from './AnimationManager.js';
import { UIController } from './UIController.js';
import { SlideShowManager } from './SlideShowManager.js';
import { ParticleSystem } from './ParticleSystem.js';

class App {
    constructor() {
        this.stateManager = new StateManager();
        this.audioManager = new AudioManager();
        this.animationManager = new AnimationManager();
        this.uiController = new UIController();
        this.slideShowManager = new SlideShowManager();
        this.particleSystem = new ParticleSystem();
        
        this.isInitialized = false;
        this.candleCount = 7; // Default number of candles
        
        // Sample wishes data - you can customize this
        this.wishesData = [
            {
                text: "🎉 Happy birthday Flourish! 🥰 Thank you for always being there with laughter, advice, and premium gists. You make life sweeter just by being around. Enjoy your special day! 🎂✨",
                image: "img/IMG_1434.HEIC",
                headerImage: "img/IMG_1438.HEIC" // Special header image for the first message
            },
            {
                text: "🌟 Wishing you endless happiness, love, and magical moments that sparkle like stars in the night sky! May every dream you've ever had come true! 🌟💫",
                image: "img/IMG_0916.HEIC"
            },
            {
                text: "💖 May this special moment bring you peace, prosperity, and beautiful memories to treasure forever! You deserve all the wonderful things life has to offer! 💖🌈",
                image: "img/IMG_0921.HEIC"
            },
            {
                text: "🎭 Life is a beautiful journey filled with amazing adventures! May yours be overflowing with wonder, excitement, and countless reasons to smile every single day! 🎭🎪",
                image: "img/IMG_1471.HEIC"
            },
            {
                text: "🌈 Sending you love, light, and all the good vibes in the universe! You are absolutely amazing and deserve every happiness that comes your way! 🌈✨💕"
                // Note: This one intentionally has no image to show optional images work
            },
            {
                text: "🎊 Here's to another year of being fabulous, inspiring, and absolutely wonderful! May your birthday be as special as you are! 🎊🎉",
                image: "img/IMG_0978.HEIC"
            }
        ];
    }

    async init() {
        if (this.isInitialized) return;
        
        try {
            // Initialize components
            this.stateManager.initializeCandleStates(this.candleCount);
            this.animationManager.initializeCandles(this.candleCount);
            this.uiController.displayInstructions();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Try to initialize audio
            await this.initializeAudio();
            
            // Update UI
            this.updateProgress();
            
            this.isInitialized = true;
            console.log('Make a Wish app initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.enableFallbackMode();
        }
    }

    async initializeAudio() {
        try {
            const hasAccess = await this.audioManager.requestMicrophoneAccess();
            if (hasAccess) {
                this.audioManager.startBlowDetection();
                this.audioManager.onBlowDetected((intensity) => {
                    this.handleBlowDetection(intensity);
                });
                this.uiController.showBlowFeedback();
            } else {
                this.enableFallbackMode();
            }
        } catch (error) {
            console.warn('Audio initialization failed:', error);
            this.enableFallbackMode();
        }
    }

    enableFallbackMode() {
        this.stateManager.setFallbackMode(true);
        this.uiController.showFallbackControls();
        this.uiController.updateInstructions('Tap on candles to make your wishes come true!');
    }

    setupEventListeners() {
        // Handle candle clicks for fallback mode
        document.addEventListener('click', (event) => {
            if (event.target.closest('.candle')) {
                const candleElement = event.target.closest('.candle');
                const candleId = candleElement.dataset.candleId;
                if (candleId && this.stateManager.isCandleLit(candleId)) {
                    this.extinguishCandle(candleId);
                }
            }
        });

        // Handle window resize for responsive behavior
        window.addEventListener('resize', () => {
            this.animationManager.handleResize();
        });
    }

    handleBlowDetection(intensity) {
        const litCandles = this.stateManager.getAllLitCandles();
        if (litCandles.length === 0) return;

        // Show blow feedback
        this.uiController.showBlowFeedback();

        // Extinguish candles based on intensity
        if (intensity > 0.7) {
            // Strong blow - extinguish multiple candles
            const candlesToExtinguish = Math.min(2, litCandles.length);
            for (let i = 0; i < candlesToExtinguish; i++) {
                this.extinguishCandle(litCandles[i].id);
            }
        } else if (intensity > 0.4) {
            // Medium blow - extinguish one candle
            this.extinguishCandle(litCandles[0].id);
        } else {
            // Light blow - just flicker
            litCandles.forEach(candle => {
                this.animationManager.animateFlameFlicker(candle.id, intensity);
            });
        }
    }

    extinguishCandle(candleId) {
        if (!this.stateManager.isCandleLit(candleId)) return;

        // Update state
        this.stateManager.extinguishCandle(candleId);
        
        // Animate extinguishing
        this.animationManager.extinguishCandle(candleId);
        
        // Update progress
        this.updateProgress();
        
        // Check if all candles are out
        if (this.stateManager.isAllCandlesExtinguished()) {
            this.handleAllCandlesExtinguished();
        }
    }

    updateProgress() {
        const remainingCount = this.stateManager.getAllLitCandles().length;
        const totalCount = this.stateManager.getTotalCandles();
        const progress = totalCount > 0 ? ((totalCount - remainingCount) / totalCount) * 100 : 0;
        
        // Update progress bar
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
        
        this.uiController.updateProgressIndicator(remainingCount);
    }

    handleAllCandlesExtinguished() {
        console.log('All candles extinguished! Starting celebration...');
        
        // Stop audio detection
        this.audioManager.stopBlowDetection();
        
        // Show celebration effects
        this.animationManager.showCelebrationEffects();
        this.particleSystem.createConfetti(150, 4000);
        
        // Store wishes data and navigate to wishes page
        setTimeout(() => {
            console.log('Storing wishes data and navigating to wishes page...');
            
            // Store wishes data in localStorage
            localStorage.setItem('birthdayWishes', JSON.stringify(this.wishesData));
            
            // Navigate to wishes page
            window.location.href = 'wishes.html';
        }, 2000); // Give time for celebration effects
    }

    // Public methods for testing
    getCandleCount() {
        return this.candleCount;
    }

    getStateManager() {
        return this.stateManager;
    }

    getAudioManager() {
        return this.audioManager;
    }

    getAnimationManager() {
        return this.animationManager;
    }

    getUIController() {
        return this.uiController;
    }

    getSlideShowManager() {
        return this.slideShowManager;
    }

    getParticleSystem() {
        return this.particleSystem;
    }

    /**
     * Add custom wishes to the slideshow
     * @param {Array} customWishes - Array of wish objects with text and optional image
     */
    setCustomWishes(customWishes) {
        this.wishesData = this.validateWishesData(customWishes);
    }

    /**
     * Add a single wish to the slideshow
     * @param {Object} wish - Wish object with text and optional image
     */
    addWish(wish) {
        this.wishesData.push(wish);
        this.wishesData = this.validateWishesData(this.wishesData);
    }

    /**
     * Validate wishes data to ensure first message has an image
     * @param {Array} wishes - Array of wish objects
     * @returns {Array} Validated wishes array
     */
    validateWishesData(wishes) {
        if (!wishes || wishes.length === 0) return this.wishesData;
        
        // Ensure first wish has an image
        if (wishes[0] && !wishes[0].image) {
            // Find the first wish with an image and move it to the front
            const wishWithImage = wishes.find(wish => wish.image);
            if (wishWithImage) {
                const index = wishes.indexOf(wishWithImage);
                wishes.splice(index, 1);
                wishes.unshift(wishWithImage);
            } else {
                // If no wishes have images, add a default image to the first one
                wishes[0].image = "img/IMG_1434.HEIC";
            }
        }
        
        return wishes;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const app = new App();
    await app.init();
    
    // Make app globally available for testing and customization
    window.makeAWishApp = app;
    
    // Example of how to add custom wishes:
    // app.addWish({
    //     text: "🎨 Your custom wish message here! 🎨",
    //     image: "path/to/your/image.jpg" // optional
    // });
});

export { App };