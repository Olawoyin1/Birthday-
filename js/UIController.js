/**
 * UIController manages DOM interactions, user instructions, and fallback controls
 */
class UIController {
    constructor() {
        this.instructionElement = null;
        this.fallbackControlsElement = null;
        this.progressElement = null;
        this.blowFeedbackElement = null;
        this.birthdayMessageElement = null;
        
        this.initializeElements();
    }

    /**
     * Initialize DOM element references
     */
    initializeElements() {
        this.instructionElement = document.getElementById('instruction-text');
        this.fallbackControlsElement = document.getElementById('fallback-controls');
        this.progressElement = document.getElementById('progress-indicator');
        this.blowFeedbackElement = document.getElementById('blow-feedback');
        this.birthdayMessageElement = document.getElementById('birthday-message');
    }

    /**
     * Display initial instructions to the user
     */
    displayInstructions() {
        if (this.instructionElement) {
            this.instructionElement.textContent = 'Blow into your microphone to make your wishes come true!';
        }
    }

    /**
     * Update instruction text
     * @param {string} text - New instruction text
     */
    updateInstructions(text) {
        if (this.instructionElement) {
            this.instructionElement.textContent = text;
        }
    }

    /**
     * Show fallback controls when microphone is unavailable
     */
    showFallbackControls() {
        if (this.fallbackControlsElement) {
            this.fallbackControlsElement.style.display = 'block';
        }
        this.updateInstructions('Tap on candles to make your wishes come true!');
    }

    /**
     * Hide fallback controls
     */
    hideFallbackControls() {
        if (this.fallbackControlsElement) {
            this.fallbackControlsElement.style.display = 'none';
        }
    }

    /**
     * Update progress indicator
     * @param {number} remainingCandles - Number of candles still lit
     */
    updateProgressIndicator(remainingCandles) {
        const progressCard = document.querySelector('.progress-card');
        if (!progressCard) return;
        
        if (remainingCandles === 0) {
            // Hide the entire progress card when all candles are out
            progressCard.style.display = 'none';
        } else {
            progressCard.style.display = 'flex';
            
            const progressText = progressCard.querySelector('.progress-text');
            if (progressText) {
                const candleText = remainingCandles === 1 ? 'candle' : 'candles';
                progressText.innerHTML = `Blow out ${remainingCandles} ${candleText} to see your wishes!`;
            }
        }
    }

    /**
     * Show blow detection feedback
     */
    showBlowFeedback() {
        if (this.blowFeedbackElement) {
            this.blowFeedbackElement.style.display = 'flex';
            
            // Auto-hide after a short time
            setTimeout(() => {
                this.hideBlowFeedback();
            }, 1000);
        }
    }

    /**
     * Hide blow detection feedback
     */
    hideBlowFeedback() {
        if (this.blowFeedbackElement) {
            this.blowFeedbackElement.style.display = 'none';
        }
    }

    /**
     * Show birthday message
     * @param {string} name - Optional name for personalization
     * @param {string} customMessage - Optional custom message
     */
    showBirthdayMessage(name = '', customMessage = '') {
        if (this.birthdayMessageElement) {
            this.birthdayMessageElement.style.display = 'block';
            
            // Update message content
            const heading = this.birthdayMessageElement.querySelector('h2');
            const paragraph = this.birthdayMessageElement.querySelector('p');
            
            if (heading) {
                if (name) {
                    heading.textContent = `🌟 ${name}, Your Wishes Are Coming True! 💫`;
                } else {
                    heading.textContent = '🌟 Your Wishes Are Coming True! 💫';
                }
            }
            
            if (paragraph) {
                if (customMessage) {
                    paragraph.textContent = customMessage;
                } else {
                    paragraph.textContent = 'The magic is about to begin...';
                }
            }
        }
    }

    /**
     * Hide birthday message
     */
    hideBirthdayMessage() {
        if (this.birthdayMessageElement) {
            this.birthdayMessageElement.style.display = 'none';
        }
    }

    /**
     * Handle candle click events for fallback mode
     * @param {string} candleId - ID of the clicked candle
     * @param {Function} callback - Callback function to execute
     */
    handleCandleClick(candleId, callback) {
        const candleElement = document.querySelector(`[data-candle-id="${candleId}"]`);
        if (candleElement && callback) {
            callback(candleId);
        }
    }

    /**
     * Show loading state
     * @param {string} message - Loading message
     */
    showLoading(message = 'Loading...') {
        this.updateInstructions(message);
    }

    /**
     * Show error message
     * @param {string} error - Error message to display
     */
    showError(error) {
        this.updateInstructions(`Error: ${error}`);
        console.error('UI Error:', error);
    }

    /**
     * Reset UI to initial state
     */
    reset() {
        this.displayInstructions();
        this.hideFallbackControls();
        this.hideBlowFeedback();
        this.hideBirthdayMessage();
        
        if (this.progressElement) {
            this.progressElement.innerHTML = '<span id="candles-remaining">0</span> wishes remaining';
            this.progressElement.style.color = '#fff';
            this.progressElement.style.fontWeight = 'bold';
        }
    }

    /**
     * Check if fallback controls are visible
     * @returns {boolean} - True if fallback controls are shown
     */
    areFallbackControlsVisible() {
        return this.fallbackControlsElement && 
               this.fallbackControlsElement.style.display !== 'none';
    }

    /**
     * Check if birthday message is visible
     * @returns {boolean} - True if birthday message is shown
     */
    isBirthdayMessageVisible() {
        return this.birthdayMessageElement && 
               this.birthdayMessageElement.style.display !== 'none';
    }

    /**
     * Get current instruction text
     * @returns {string} - Current instruction text
     */
    getCurrentInstructions() {
        return this.instructionElement ? this.instructionElement.textContent : '';
    }

    /**
     * Add visual feedback for successful interaction
     * @param {string} type - Type of feedback ('success', 'error', 'info')
     * @param {string} message - Feedback message
     */
    showFeedback(type, message) {
        // Create temporary feedback element
        const feedback = document.createElement('div');
        feedback.className = `feedback feedback-${type}`;
        feedback.textContent = message;
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-size: 1.1rem;
            z-index: 1000;
            animation: feedback-show 0.3s ease-out;
        `;
        
        document.body.appendChild(feedback);
        
        // Remove after 2 seconds
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.remove();
            }
        }, 2000);
    }
}

// Add feedback animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes feedback-show {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
`;
document.head.appendChild(style);

export { UIController };