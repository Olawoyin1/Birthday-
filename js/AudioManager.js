/**
 * AudioManager handles microphone access, audio processing, and blow detection
 */
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.frequencyData = null;
        this.isListening = false;
        this.blowThreshold = 50; // Adjust based on testing
        this.onBlowCallback = null;
        this.animationFrame = null;
    }

    /**
     * Request microphone access from the user
     * @returns {Promise<boolean>} - True if access granted
     */
    async requestMicrophoneAccess() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                } 
            });
            
            // Initialize Web Audio API
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
            
            // Connect microphone to analyser
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.microphone.connect(this.analyser);
            
            // Resume audio context if suspended
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            return true;
        } catch (error) {
            console.warn('Microphone access denied or unavailable:', error);
            return false;
        }
    }

    /**
     * Start blow detection monitoring
     */
    startBlowDetection() {
        if (!this.analyser || this.isListening) return;
        
        this.isListening = true;
        this.detectBlow();
    }

    /**
     * Stop blow detection monitoring
     */
    stopBlowDetection() {
        this.isListening = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        // Close audio context and stop microphone
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        
        if (this.microphone && this.microphone.mediaStream) {
            this.microphone.mediaStream.getTracks().forEach(track => track.stop());
        }
    }

    /**
     * Set callback function for blow detection events
     * @param {Function} callback - Function to call when blow is detected
     */
    onBlowDetected(callback) {
        this.onBlowCallback = callback;
    }

    /**
     * Continuous blow detection loop
     */
    detectBlow() {
        if (!this.isListening || !this.analyser) return;
        
        // Get frequency data
        this.analyser.getByteFrequencyData(this.frequencyData);
        
        // Calculate blow intensity
        const intensity = this.calculateBlowIntensity();
        
        // Trigger callback if blow detected
        if (intensity > 0.3 && this.onBlowCallback) {
            this.onBlowCallback(intensity);
        }
        
        // Continue monitoring
        this.animationFrame = requestAnimationFrame(() => this.detectBlow());
    }

    /**
     * Calculate blow intensity from frequency data
     * @returns {number} - Intensity value between 0 and 1
     */
    calculateBlowIntensity() {
        if (!this.frequencyData) return 0;
        
        // Focus on lower frequencies where breath sounds are prominent
        const lowFreqEnd = Math.floor(this.frequencyData.length * 0.3);
        let sum = 0;
        let count = 0;
        
        for (let i = 0; i < lowFreqEnd; i++) {
            sum += this.frequencyData[i];
            count++;
        }
        
        const average = count > 0 ? sum / count : 0;
        
        // Normalize to 0-1 range and apply threshold
        const normalized = Math.max(0, (average - this.blowThreshold) / (255 - this.blowThreshold));
        
        return Math.min(1, normalized);
    }

    /**
     * Get current blow intensity
     * @returns {number} - Current intensity value
     */
    getBlowIntensity() {
        return this.calculateBlowIntensity();
    }

    /**
     * Check if microphone is currently active
     * @returns {boolean} - True if listening for audio
     */
    isActive() {
        return this.isListening && this.audioContext && this.audioContext.state === 'running';
    }

    /**
     * Adjust blow detection sensitivity
     * @param {number} threshold - New threshold value (0-255)
     */
    setBlowThreshold(threshold) {
        this.blowThreshold = Math.max(0, Math.min(255, threshold));
    }

    /**
     * Get current audio context state
     * @returns {string} - Audio context state
     */
    getAudioContextState() {
        return this.audioContext ? this.audioContext.state : 'closed';
    }
}

export { AudioManager };