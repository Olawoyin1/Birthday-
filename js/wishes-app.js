import { ParticleSystem } from './ParticleSystem.js';

class WishesApp {
    constructor() {
        this.slides = [];
        this.currentSlide = 0;
        this.particleSystem = new ParticleSystem();
        this.celebrationElements = [];
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadWishesData();
        this.init();
    }

    /**
     * Initialize DOM element references
     */
    initializeElements() {
        this.slidesWrapper = document.getElementById('slides-wrapper');
        this.indicatorsContainer = document.getElementById('slide-indicators');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.title = document.getElementById('slideshow-title');
        this.backBtn = document.getElementById('back-btn');
        this.restartBtn = document.getElementById('restart-btn');
        
        console.log('Wishes DOM elements:', {
            slidesWrapper: !!this.slidesWrapper,
            indicatorsContainer: !!this.indicatorsContainer,
            prevBtn: !!this.prevBtn,
            nextBtn: !!this.nextBtn,
            title: !!this.title
        });
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                    this.nextSlide();
                    break;
                case 'Home':
                    this.goToSlide(0);
                    break;
                case 'End':
                    this.goToSlide(this.slides.length - 1);
                    break;
            }
        });
    }

    /**
     * Load wishes data from URL parameters or use default
     */
    loadWishesData() {
        // Try to get wishes data from URL parameters or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const wishesParam = urlParams.get('wishes');
        
        if (wishesParam) {
            try {
                this.slides = JSON.parse(decodeURIComponent(wishesParam));
            } catch (error) {
                console.error('Error parsing wishes data:', error);
                this.loadDefaultWishes();
            }
        } else {
            // Try localStorage
            const storedWishes = localStorage.getItem('birthdayWishes');
            if (storedWishes) {
                try {
                    this.slides = JSON.parse(storedWishes);
                } catch (error) {
                    console.error('Error parsing stored wishes:', error);
                    this.loadDefaultWishes();
                }
            } else {
                this.loadDefaultWishes();
            }
        }
    }

    /**
     * Load default wishes data
     */
    loadDefaultWishes() {
        this.slides = [
            {
                text: "🎉 Happy birthday Flourish! 🥰 Thank you for always being there with laughter, advice, and premium gists. You make life sweeter just by being around. Enjoy your special day! 🎂✨",
                image: "img/IMG_1434.HEIC",
                headerImage: "img/IMG_1438.HEIC"
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
            },
            {
                text: "🎊 Here's to another year of being fabulous, inspiring, and absolutely wonderful! May your birthday be as special as you are! 🎊🎉",
                image: "img/IMG_0978.HEIC"
            }
        ];
    }

    /**
     * Initialize the app
     */
    init() {
        console.log('Initializing wishes app with slides:', this.slides.length);
        
        if (this.slides.length === 0) {
            console.error('No slides to display');
            return;
        }
        
        this.renderSlides();
        this.renderIndicators();
        this.showCelebrationEffects();
        
        // Start particle effects
        this.particleSystem.createConfetti(100, 5000);
        this.particleSystem.createFloatingHearts(20);
        
        console.log('Wishes app initialized successfully');
    }

    /**
     * Render all slides in the DOM
     */
    renderSlides() {
        if (!this.slidesWrapper) return;
        
        this.slidesWrapper.innerHTML = '';
        
        this.slides.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = `slide ${index === 0 ? 'active' : ''}`;
            slideElement.dataset.slideIndex = index;
            
            const slideContent = document.createElement('div');
            slideContent.className = 'slide-content';
            
            // Add header image for first slide if provided
            if (index === 0 && slide.headerImage) {
                const headerImageContainer = document.createElement('div');
                headerImageContainer.className = 'slide-header-image-container';
                
                const headerImg = document.createElement('img');
                headerImg.src = slide.headerImage;
                headerImg.alt = 'Birthday celebration header';
                headerImg.className = 'slide-header-image';
                
                headerImg.style.opacity = '0';
                headerImg.onload = () => {
                    headerImg.style.transition = 'opacity 0.5s ease';
                    headerImg.style.opacity = '1';
                };
                
                headerImg.onerror = () => {
                    headerImageContainer.style.display = 'none';
                };
                
                headerImageContainer.appendChild(headerImg);
                slideContent.appendChild(headerImageContainer);
            }
            
            // Add main image if provided
            if (slide.image) {
                const imageContainer = document.createElement('div');
                imageContainer.className = 'slide-image-container';
                
                const img = document.createElement('img');
                img.src = slide.image;
                img.alt = slide.alt || `Birthday slide ${index + 1}`;
                img.className = 'slide-image';
                
                img.style.opacity = '0';
                img.onload = () => {
                    img.style.transition = 'opacity 0.5s ease';
                    img.style.opacity = '1';
                };
                
                img.onerror = () => {
                    // Hide image container if it fails to load
                    imageContainer.style.display = 'none';
                };
                
                imageContainer.appendChild(img);
                slideContent.appendChild(imageContainer);
            }
            
            // Add text content
            if (slide.text) {
                const textElement = document.createElement('div');
                textElement.className = 'slide-text';
                textElement.innerHTML = slide.text;
                slideContent.appendChild(textElement);
            }
            
            slideElement.appendChild(slideContent);
            this.slidesWrapper.appendChild(slideElement);
        });
    }

    /**
     * Render slide indicators
     */
    renderIndicators() {
        if (!this.indicatorsContainer) return;
        
        this.indicatorsContainer.innerHTML = '';
        
        this.slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
            indicator.dataset.slideIndex = index;
            indicator.addEventListener('click', () => this.goToSlide(index));
            this.indicatorsContainer.appendChild(indicator);
        });
    }

    /**
     * Go to next slide
     */
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    /**
     * Go to previous slide
     */
    previousSlide() {
        const prevIndex = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.goToSlide(prevIndex);
    }

    /**
     * Go to specific slide
     */
    goToSlide(index) {
        if (index < 0 || index >= this.slides.length || index === this.currentSlide) return;
        
        const slides = this.slidesWrapper.querySelectorAll('.slide');
        const indicators = this.indicatorsContainer.querySelectorAll('.indicator');
        
        // Remove active class from current slide and indicator
        if (slides[this.currentSlide]) {
            slides[this.currentSlide].classList.remove('active');
            slides[this.currentSlide].classList.add('prev');
        }
        if (indicators[this.currentSlide]) {
            indicators[this.currentSlide].classList.remove('active');
        }
        
        // Add active class to new slide and indicator
        setTimeout(() => {
            if (slides[this.currentSlide]) {
                slides[this.currentSlide].classList.remove('prev');
            }
            
            if (slides[index]) {
                slides[index].classList.add('active');
            }
            if (indicators[index]) {
                indicators[index].classList.add('active');
            }
            
            this.currentSlide = index;
            
            // Show celebration animation for each slide change
            this.createCelebrationBurst();
        }, 50);
    }

    /**
     * Show initial celebration effects
     */
    showCelebrationEffects() {
        setTimeout(() => {
            this.createCelebrationBurst();
            this.showHurrayText();
        }, 500);
    }

    /**
     * Create celebration burst animation
     */
    createCelebrationBurst() {
        const colors = ['#FF1493', '#8A2BE2', '#FFD700', '#FF69B4', '#00CED1'];
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.position = 'fixed';
                particle.style.width = '8px';
                particle.style.height = '8px';
                particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                particle.style.borderRadius = '50%';
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '1000';
                
                const startX = window.innerWidth / 2;
                const startY = window.innerHeight / 2;
                const angle = (Math.PI * 2 * i) / 15;
                const distance = 100 + Math.random() * 100;
                const endX = startX + Math.cos(angle) * distance;
                const endY = startY + Math.sin(angle) * distance;
                
                particle.style.left = startX + 'px';
                particle.style.top = startY + 'px';
                
                document.body.appendChild(particle);
                
                particle.animate([
                    { transform: 'translate(0, 0) scale(0)', opacity: 1 },
                    { transform: `translate(${endX - startX}px, ${endY - startY}px) scale(1)`, opacity: 0 }
                ], {
                    duration: 1000,
                    easing: 'ease-out'
                }).onfinish = () => {
                    particle.remove();
                };
            }, i * 50);
        }
    }

    /**
     * Show "Hurray!" text animation
     */
    showHurrayText() {
        const hurrayTexts = ['🎉 Hurray! 🎉', '✨ Amazing! ✨', '🌟 Wonderful! 🌟', '💫 Magical! 💫'];
        const randomText = hurrayTexts[Math.floor(Math.random() * hurrayTexts.length)];
        
        const hurray = document.createElement('div');
        hurray.style.position = 'fixed';
        hurray.style.top = '20%';
        hurray.style.left = '50%';
        hurray.style.transform = 'translateX(-50%)';
        hurray.style.fontFamily = "'Fredoka One', cursive";
        hurray.style.fontSize = '3rem';
        hurray.style.color = '#fff';
        hurray.style.textShadow = '3px 3px 0px rgba(255, 20, 147, 0.8), 6px 6px 20px rgba(0, 0, 0, 0.5)';
        hurray.style.pointerEvents = 'none';
        hurray.style.zIndex = '1001';
        hurray.textContent = randomText;
        
        document.body.appendChild(hurray);
        
        hurray.animate([
            { transform: 'translateX(-50%) translateY(-100px) scale(0)', opacity: 0 },
            { transform: 'translateX(-50%) translateY(0px) scale(1.2)', opacity: 1, offset: 0.5 },
            { transform: 'translateX(-50%) translateY(0px) scale(1)', opacity: 1 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        });
        
        setTimeout(() => {
            hurray.remove();
        }, 2000);
    }

    /**
     * Restart slideshow from beginning
     */
    restartSlideshow() {
        this.goToSlide(0);
        this.showCelebrationEffects();
        this.particleSystem.createConfetti(50, 3000);
    }
}

// Global functions for navigation buttons
window.goBack = function() {
    window.location.href = 'index.html';
};

window.restartSlideshow = function() {
    if (window.wishesApp) {
        window.wishesApp.restartSlideshow();
    }
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.wishesApp = new WishesApp();
});

export { WishesApp };