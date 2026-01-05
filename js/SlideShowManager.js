/**
 * SlideShowManager handles the dynamic birthday message slideshow
 */
class SlideShowManager {
    constructor() {
        this.slides = [];
        this.currentSlide = 0;
        this.isActive = false;
        this.celebrationElements = [];
        
        this.initializeElements();
        this.setupEventListeners();
    }

    /**
     * Initialize DOM element references
     */
    initializeElements() {
        this.overlay = document.getElementById('slideshow-overlay');
        this.container = document.getElementById('slideshow-container');
        this.slidesWrapper = document.getElementById('slides-wrapper');
        this.indicatorsContainer = document.getElementById('slide-indicators');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.closeBtn = document.getElementById('close-slideshow');
        this.title = document.querySelector('.slideshow-title');
        
        // Debug: Check if all elements are found
        console.log('SlideShow DOM elements:', {
            overlay: !!this.overlay,
            container: !!this.container,
            slidesWrapper: !!this.slidesWrapper,
            indicatorsContainer: !!this.indicatorsContainer,
            prevBtn: !!this.prevBtn,
            nextBtn: !!this.nextBtn,
            closeBtn: !!this.closeBtn,
            title: !!this.title
        });
        
        if (!this.overlay) {
            console.error('Slideshow overlay element not found!');
        }
    }

    /**
     * Set up event listeners for slideshow controls
     */
    setupEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.hide());
        }
        
        // Close on overlay click
        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.hide();
                }
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isActive) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                    this.nextSlide();
                    break;
                case 'Escape':
                    this.hide();
                    break;
            }
        });
    }

    /**
     * Set slides data
     * @param {Array} slidesData - Array of slide objects with text and optional image
     * @param {string} customTitle - Optional custom title for the slideshow
     */
    setSlides(slidesData, customTitle = '🌟 Your Wishes Have Come True! 💫') {
        console.log('Setting slides:', slidesData);
        this.slides = slidesData;
        this.currentSlide = 0;
        
        // Update title
        if (this.title) {
            this.title.textContent = customTitle;
        }
        
        this.renderSlides();
        this.renderIndicators();
        console.log('Slides rendered, total:', this.slides.length);
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
                
                // Add loading placeholder
                headerImg.style.opacity = '0';
                headerImg.onload = () => {
                    headerImg.style.transition = 'opacity 0.5s ease';
                    headerImg.style.opacity = '1';
                };
                
                headerImg.onerror = () => {
                    // Hide header image if it fails to load
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
                
                // Add loading placeholder
                img.style.opacity = '0';
                img.onload = () => {
                    img.style.transition = 'opacity 0.5s ease';
                    img.style.opacity = '1';
                };
                
                img.onerror = () => {
                    // Create a beautiful placeholder if image fails to load
                    imageContainer.innerHTML = `
                        <div class="image-placeholder">
                            <div class="placeholder-icon">🎂</div>
                            <div class="placeholder-text">Birthday Memories</div>
                        </div>
                    `;
                };
                
                imageContainer.appendChild(img);
                slideContent.appendChild(imageContainer);
            }
            
            // Add text content
            if (slide.text) {
                const textElement = document.createElement('div');
                textElement.className = 'slide-text';
                textElement.innerHTML = slide.text; // Allow HTML in text
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
     * Show the slideshow
     * @param {boolean} autoPlay - Whether to auto-play slides (disabled by default)
     */
    show(autoPlay = false) {
        console.log('SlideShowManager.show() called with slides:', this.slides.length);
        
        if (!this.overlay || this.slides.length === 0) {
            console.error('Cannot show slideshow: overlay missing or no slides');
            return;
        }
        
        console.log('Overlay element:', this.overlay);
        console.log('Overlay current classes:', this.overlay.className);
        console.log('Overlay current style:', this.overlay.style.cssText);
        
        this.isActive = true;
        this.overlay.classList.add('active');
        
        console.log('After adding active class:', this.overlay.className);
        console.log('Computed style display:', window.getComputedStyle(this.overlay).display);
        console.log('Computed style opacity:', window.getComputedStyle(this.overlay).opacity);
        console.log('Computed style visibility:', window.getComputedStyle(this.overlay).visibility);
        console.log('Computed style z-index:', window.getComputedStyle(this.overlay).zIndex);
        
        // Force style update
        this.overlay.style.display = 'flex';
        this.overlay.style.opacity = '1';
        this.overlay.style.visibility = 'visible';
        this.overlay.style.zIndex = '9999';
        
        console.log('Slideshow overlay activated');
        
        // Show initial celebration
        setTimeout(() => {
            this.createCelebrationBurst();
            this.showHurrayText();
        }, 500);
        
        // Animate entrance
        this.animateEntrance();
    }

    /**
     * Hide the slideshow
     */
    hide() {
        if (!this.overlay) return;
        
        this.isActive = false;
        this.clearCelebrationElements();
        this.overlay.classList.remove('active');
        
        // Reset to first slide
        setTimeout(() => {
            this.goToSlide(0);
        }, 500);
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
     * @param {number} index - Slide index
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
            this.addFloatingCelebrationElements();
        }, 50);
    }

    /**
     * Create celebration burst animation
     */
    createCelebrationBurst() {
        if (!this.overlay) return;
        
        const burst = document.createElement('div');
        burst.className = 'celebration-burst';
        
        const colors = ['#FF1493', '#8A2BE2', '#1E90FF', '#FF69B4', '#FF4500', '#FFD700', '#00CED1'];
        
        // Create particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'celebration-particle';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Random direction and distance
            const angle = (Math.PI * 2 * i) / 20;
            const distance = 100 + Math.random() * 100;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;
            
            particle.style.setProperty('--dx', dx + 'px');
            particle.style.setProperty('--dy', dy + 'px');
            
            burst.appendChild(particle);
        }
        
        this.overlay.appendChild(burst);
        this.celebrationElements.push(burst);
        
        // Remove after animation
        setTimeout(() => {
            if (burst.parentNode) {
                burst.remove();
            }
            const index = this.celebrationElements.indexOf(burst);
            if (index > -1) {
                this.celebrationElements.splice(index, 1);
            }
        }, 1500);
    }

    /**
     * Show "Hurray!" text animation
     */
    showHurrayText() {
        if (!this.overlay) return;
        
        const hurrayTexts = ['🎉 Hurray! 🎉', '✨ Amazing! ✨', '🌟 Wonderful! 🌟', '💫 Magical! 💫'];
        const randomText = hurrayTexts[Math.floor(Math.random() * hurrayTexts.length)];
        
        const hurray = document.createElement('div');
        hurray.className = 'hurray-text';
        hurray.textContent = randomText;
        
        this.overlay.appendChild(hurray);
        this.celebrationElements.push(hurray);
        
        // Remove after animation
        setTimeout(() => {
            if (hurray.parentNode) {
                hurray.remove();
            }
            const index = this.celebrationElements.indexOf(hurray);
            if (index > -1) {
                this.celebrationElements.splice(index, 1);
            }
        }, 2000);
    }

    /**
     * Add floating celebration elements
     */
    addFloatingCelebrationElements() {
        if (!this.overlay) return;
        
        const celebrationEmojis = ['🎈', '🎊', '🎁', '🌟', '✨', '💖', '🦄', '🌈'];
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const element = document.createElement('div');
                element.className = 'floating-celebration';
                element.textContent = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
                
                // Random position
                element.style.left = Math.random() * 80 + 10 + '%';
                element.style.top = Math.random() * 60 + 20 + '%';
                element.style.animationDelay = Math.random() * 2 + 's';
                element.style.animationDuration = (3 + Math.random() * 2) + 's';
                
                this.overlay.appendChild(element);
                this.celebrationElements.push(element);
                
                // Remove after animation
                setTimeout(() => {
                    if (element.parentNode) {
                        element.remove();
                    }
                    const index = this.celebrationElements.indexOf(element);
                    if (index > -1) {
                        this.celebrationElements.splice(index, 1);
                    }
                }, 5000);
            }, i * 200);
        }
    }

    /**
     * Clear all celebration elements
     */
    clearCelebrationElements() {
        this.celebrationElements.forEach(element => {
            if (element.parentNode) {
                element.remove();
            }
        });
        this.celebrationElements = [];
    }

    /**
     * Animate slideshow entrance
     */
    animateEntrance() {
        if (!this.container) return;
        
        // Initial state
        this.container.style.transform = 'scale(0.8) translateY(50px)';
        this.container.style.opacity = '0';
        
        // Animate to final state
        setTimeout(() => {
            this.container.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            this.container.style.transform = 'scale(1) translateY(0)';
            this.container.style.opacity = '1';
        }, 100);
    }

    /**
     * Get total number of slides
     * @returns {number} Number of slides
     */
    getSlideCount() {
        return this.slides.length;
    }
}

export { SlideShowManager };