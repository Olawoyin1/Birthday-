/**
 * Candle data model
 */
class Candle {
    constructor(id, position) {
        this.id = id;
        this.isLit = true;
        this.position = position || { x: 0, y: 0 };
        this.flameIntensity = 1.0;
        this.element = null;
    }

    extinguish() {
        this.isLit = false;
        this.flameIntensity = 0;
    }

    setFlameIntensity(intensity) {
        this.flameIntensity = Math.max(0, Math.min(1, intensity));
    }

    setElement(element) {
        this.element = element;
    }
}

/**
 * StateManager handles all application state including candle states and progress tracking
 */
class StateManager {
    constructor() {
        this.candles = [];
        this.microphoneAccess = false;
        this.blowDetectionActive = false;
        this.celebrationTriggered = false;
        this.fallbackMode = false;
        this.userPreferences = {
            name: '',
            customMessage: ''
        };
    }

    /**
     * Initialize candle states with the specified count
     * @param {number} count - Number of candles to create
     */
    initializeCandleStates(count) {
        this.candles = [];
        const spacing = 100 / (count + 1); // Distribute evenly across container
        
        for (let i = 0; i < count; i++) {
            const position = {
                x: spacing * (i + 1),
                y: 0
            };
            const candle = new Candle(`candle-${i}`, position);
            this.candles.push(candle);
        }
        
        return this.candles;
    }

    /**
     * Extinguish a specific candle
     * @param {string} candleId - ID of the candle to extinguish
     * @returns {boolean} - True if candle was successfully extinguished
     */
    extinguishCandle(candleId) {
        const candle = this.candles.find(c => c.id === candleId);
        if (candle && candle.isLit) {
            candle.extinguish();
            return true;
        }
        return false;
    }

    /**
     * Get all currently lit candles
     * @returns {Candle[]} - Array of lit candles
     */
    getAllLitCandles() {
        return this.candles.filter(candle => candle.isLit);
    }

    /**
     * Check if all candles are extinguished
     * @returns {boolean} - True if all candles are out
     */
    isAllCandlesExtinguished() {
        return this.candles.every(candle => !candle.isLit);
    }

    /**
     * Get current progress (number of extinguished candles)
     * @returns {number} - Number of extinguished candles
     */
    getCurrentProgress() {
        return this.candles.filter(candle => !candle.isLit).length;
    }

    /**
     * Get total number of candles
     * @returns {number} - Total candle count
     */
    getTotalCandles() {
        return this.candles.length;
    }

    /**
     * Check if a specific candle is lit
     * @param {string} candleId - ID of the candle to check
     * @returns {boolean} - True if candle is lit
     */
    isCandleLit(candleId) {
        const candle = this.candles.find(c => c.id === candleId);
        return candle ? candle.isLit : false;
    }

    /**
     * Get candle by ID
     * @param {string} candleId - ID of the candle
     * @returns {Candle|null} - The candle object or null if not found
     */
    getCandle(candleId) {
        return this.candles.find(c => c.id === candleId) || null;
    }

    /**
     * Set microphone access status
     * @param {boolean} hasAccess - Whether microphone access is granted
     */
    setMicrophoneAccess(hasAccess) {
        this.microphoneAccess = hasAccess;
    }

    /**
     * Set blow detection status
     * @param {boolean} isActive - Whether blow detection is active
     */
    setBlowDetectionActive(isActive) {
        this.blowDetectionActive = isActive;
    }

    /**
     * Set fallback mode status
     * @param {boolean} enabled - Whether fallback mode is enabled
     */
    setFallbackMode(enabled) {
        this.fallbackMode = enabled;
    }

    /**
     * Trigger celebration state
     */
    triggerCelebration() {
        this.celebrationTriggered = true;
    }

    /**
     * Set user preferences
     * @param {Object} preferences - User preferences object
     */
    setUserPreferences(preferences) {
        this.userPreferences = { ...this.userPreferences, ...preferences };
    }

    /**
     * Get current application state
     * @returns {Object} - Current state object
     */
    getState() {
        return {
            candles: this.candles.map(c => ({
                id: c.id,
                isLit: c.isLit,
                position: c.position,
                flameIntensity: c.flameIntensity
            })),
            microphoneAccess: this.microphoneAccess,
            blowDetectionActive: this.blowDetectionActive,
            celebrationTriggered: this.celebrationTriggered,
            fallbackMode: this.fallbackMode,
            userPreferences: { ...this.userPreferences }
        };
    }

    /**
     * Reset all candles to lit state
     */
    resetCandles() {
        this.candles.forEach(candle => {
            candle.isLit = true;
            candle.flameIntensity = 1.0;
        });
        this.celebrationTriggered = false;
    }
}

export { StateManager, Candle };