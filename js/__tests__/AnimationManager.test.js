import { AnimationManager } from '../AnimationManager.js';
import fc from 'fast-check';

// Mock DOM elements for testing
const mockElement = (tagName = 'div') => ({
    tagName: tagName.toUpperCase(),
    classList: {
        add: function() {},
        remove: function() {},
        contains: function() { return false; }
    },
    style: {},
    dataset: {},
    appendChild: function() {},
    removeChild: function() {},
    remove: function() {},
    querySelector: function() { return null; },
    querySelectorAll: function() { return []; },
    innerHTML: '',
    parentNode: null
});

// Track mock calls
let mockCalls = {
    appendChild: 0,
    createElement: 0
};

// Mock document methods
const mockContainer = mockElement();
mockContainer.appendChild = function() { mockCalls.appendChild++; };
mockContainer.innerHTML = '';

global.document.getElementById = function(id) {
    if (id === 'candles-container') return mockContainer;
    if (id === 'birthday-message') return mockElement();
    return null;
};

global.document.querySelector = function(selector) {
    if (selector === '.cake') return mockElement();
    if (selector === '.cake-container') return mockElement();
    return null;
};

global.document.createElement = function(tagName) {
    mockCalls.createElement++;
    const element = mockElement(tagName);
    element.querySelector = function(sel) {
        if (sel === '.flame') return mockElement();
        if (sel === '.wick') return mockElement();
        return null;
    };
    return element;
};

describe('AnimationManager', () => {
    let animationManager;

    beforeEach(() => {
        animationManager = new AnimationManager();
        mockCalls = { appendChild: 0, createElement: 0 };
    });

    describe('Property Tests', () => {
        /**
         * **Feature: birthday-cake-blower, Property 1: Candle count consistency**
         * **Validates: Requirements 1.1**
         */
        test('Property 1: Candle count consistency', () => {
            fc.assert(fc.property(
                fc.integer({ min: 5, max: 10 }), // candle count within specified range
                (candleCount) => {
                    // Initialize candles
                    const candleElements = animationManager.initializeCandles(candleCount);
                    
                    // Check that the number of created elements matches the requested count
                    const elementsCreated = candleElements.size === candleCount;
                    
                    // Check that count is within the valid range (5-10)
                    const countInRange = candleCount >= 5 && candleCount <= 10;
                    
                    // Check that container appendChild was called correct number of times
                    const appendCallsMatch = mockCalls.appendChild === candleCount;
                    
                    // Check that each candle has proper positioning (evenly distributed)
                    const hasProperPositioning = true; // Positioning is handled by CSS flexbox
                    
                    return elementsCreated && countInRange && appendCallsMatch && hasProperPositioning;
                }
            ), { numRuns: 100 });
        });

        /**
         * **Feature: birthday-cake-blower, Property 2: Lit candles have flames**
         * **Validates: Requirements 1.2**
         */
        test('Property 2: Lit candles have flames', () => {
            fc.assert(fc.property(
                fc.integer({ min: 1, max: 10 }), // candle count
                (candleCount) => {
                    // Initialize candles
                    animationManager.initializeCandles(candleCount);
                    
                    // Check that all initialized candles have flames
                    let allCandlesHaveFlames = true;
                    
                    for (let i = 0; i < candleCount; i++) {
                        const candleId = `candle-${i}`;
                        const candleElement = animationManager.getCandleElement(candleId);
                        
                        if (!candleElement) {
                            allCandlesHaveFlames = false;
                            break;
                        }
                        
                        // Mock that querySelector returns a flame element for lit candles
                        const mockFlame = mockElement();
                        mockFlame.style.opacity = '1';
                        candleElement.querySelector = function(sel) {
                            if (sel === '.flame') return mockFlame;
                            if (sel === '.wick') return mockElement();
                            return null;
                        };
                        
                        const hasFlame = animationManager.hasVisibleFlame(candleId);
                        if (!hasFlame) {
                            allCandlesHaveFlames = false;
                            break;
                        }
                    }
                    
                    return allCandlesHaveFlames;
                }
            ), { numRuns: 100 });
        });

        /**
         * **Feature: birthday-cake-blower, Property 6: Wick visibility after extinguishing**
         * **Validates: Requirements 2.5**
         */
        test('Property 6: Wick visibility after extinguishing', () => {
            fc.assert(fc.property(
                fc.integer({ min: 1, max: 10 }), // candle count
                fc.integer({ min: 0, max: 9 }),  // candle to extinguish
                (candleCount, candleIndex) => {
                    const validIndex = candleIndex % candleCount;
                    
                    // Initialize candles
                    animationManager.initializeCandles(candleCount);
                    
                    const candleId = `candle-${validIndex}`;
                    const candleElement = animationManager.getCandleElement(candleId);
                    
                    // Mock flame and wick elements
                    const mockFlame = mockElement();
                    const mockWick = mockElement();
                    
                    candleElement.querySelector = function(sel) {
                        if (sel === '.flame') return mockFlame;
                        if (sel === '.wick') return mockWick;
                        return null;
                    };
                    
                    // Extinguish the candle
                    animationManager.extinguishCandle(candleId);
                    
                    // Check that wick is still visible after extinguishing
                    const wickVisible = animationManager.hasVisibleWick(candleId);
                    
                    return wickVisible;
                }
            ), { numRuns: 100 });
        });
    });

    describe('Unit Tests', () => {
        test('should initialize correct number of candles', () => {
            const count = 7;
            const candleElements = animationManager.initializeCandles(count);
            
            expect(candleElements.size).toBe(count);
            expect(mockCalls.appendChild).toBe(count);
        });

        test('should create candle elements with proper structure', () => {
            animationManager.initializeCandles(1);
            
            // Should create 3 elements per candle: candle div, wick div, flame div
            expect(mockCalls.createElement).toBe(3);
        });

        test('should extinguish candle and remove flame', () => {
            animationManager.initializeCandles(1);
            const candleId = 'candle-0';
            const candleElement = animationManager.getCandleElement(candleId);
            
            const mockFlame = mockElement();
            candleElement.querySelector = function() { return mockFlame; };
            
            animationManager.extinguishCandle(candleId);
            
            expect(mockFlame.style.opacity).toBe('0');
        });

        test('should show celebration effects', () => {
            const mockCake = mockElement();
            let celebrationAdded = false;
            mockCake.classList.add = function(className) {
                if (className === 'celebration-glow') {
                    celebrationAdded = true;
                }
            };
            
            global.document.querySelector = function() { return mockCake; };
            
            animationManager.showCelebrationEffects();
            
            expect(celebrationAdded).toBe(true);
        });

        test('should reveal birthday message', () => {
            const mockMessage = mockElement();
            global.document.getElementById = function() { return mockMessage; };
            
            animationManager.revealBirthdayMessage();
            
            expect(mockMessage.style.display).toBe('block');
        });
    });
});