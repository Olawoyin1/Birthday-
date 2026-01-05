import { StateManager, Candle } from '../StateManager.js';
import fc from 'fast-check';

describe('StateManager', () => {
    let stateManager;

    beforeEach(() => {
        stateManager = new StateManager();
    });

    describe('Property Tests', () => {
        /**
         * **Feature: birthday-cake-blower, Property 3: Individual candle state tracking**
         * **Validates: Requirements 1.5**
         */
        test('Property 3: Individual candle state tracking', () => {
            fc.assert(fc.property(
                fc.integer({ min: 1, max: 10 }), // candle count
                fc.integer({ min: 0, max: 9 }),  // candle index to extinguish
                (candleCount, candleIndex) => {
                    // Ensure candle index is valid for the count
                    const validIndex = candleIndex % candleCount;
                    
                    // Initialize candles
                    const candles = stateManager.initializeCandleStates(candleCount);
                    
                    // All candles should start lit
                    const allLitBefore = candles.every(candle => candle.isLit);
                    
                    // Extinguish one specific candle
                    const targetCandleId = candles[validIndex].id;
                    const extinguished = stateManager.extinguishCandle(targetCandleId);
                    
                    // The extinguish operation should succeed
                    const operationSucceeded = extinguished === true;
                    
                    // Only the target candle should be extinguished
                    const targetCandle = stateManager.getCandle(targetCandleId);
                    const targetExtinguished = !targetCandle.isLit;
                    
                    // All other candles should remain lit
                    const otherCandles = candles.filter(c => c.id !== targetCandleId);
                    const othersStillLit = otherCandles.every(candle => 
                        stateManager.getCandle(candle.id).isLit
                    );
                    
                    // Exactly one candle should be extinguished
                    const litCount = stateManager.getAllLitCandles().length;
                    const exactlyOneExtinguished = litCount === (candleCount - 1);
                    
                    return allLitBefore && 
                           operationSucceeded && 
                           targetExtinguished && 
                           othersStillLit && 
                           exactlyOneExtinguished;
                }
            ), { numRuns: 100 });
        });

        /**
         * **Feature: birthday-cake-blower, Property 11: Lit candle count tracking**
         * **Validates: Requirements 4.3**
         */
        test('Property 11: Lit candle count tracking', () => {
            fc.assert(fc.property(
                fc.integer({ min: 1, max: 10 }), // candle count
                fc.array(fc.integer({ min: 0, max: 9 }), { minLength: 1, maxLength: 5 }), // candles to extinguish
                (candleCount, candleIndices) => {
                    // Initialize candles
                    const candles = stateManager.initializeCandleStates(candleCount);
                    const initialLitCount = stateManager.getAllLitCandles().length;
                    
                    // Track extinguishing operations
                    let successfulExtinguishes = 0;
                    const uniqueIndices = [...new Set(candleIndices.map(i => i % candleCount))];
                    
                    for (const index of uniqueIndices) {
                        const candleId = candles[index].id;
                        if (stateManager.isCandleLit(candleId)) {
                            const success = stateManager.extinguishCandle(candleId);
                            if (success) {
                                successfulExtinguishes++;
                            }
                        }
                    }
                    
                    // Check that lit count decreased by exactly the number of successful extinguishes
                    const finalLitCount = stateManager.getAllLitCandles().length;
                    const expectedFinalCount = initialLitCount - successfulExtinguishes;
                    
                    return finalLitCount === expectedFinalCount;
                }
            ), { numRuns: 100 });
        });
    });

    describe('Unit Tests', () => {
        test('should initialize candles with correct count and positions', () => {
            const count = 5;
            const candles = stateManager.initializeCandleStates(count);
            
            expect(candles).toHaveLength(count);
            expect(candles.every(candle => candle.isLit)).toBe(true);
            expect(candles.every(candle => candle.id.startsWith('candle-'))).toBe(true);
        });

        test('should extinguish specific candle', () => {
            stateManager.initializeCandleStates(3);
            const candleId = 'candle-1';
            
            const result = stateManager.extinguishCandle(candleId);
            
            expect(result).toBe(true);
            expect(stateManager.isCandleLit(candleId)).toBe(false);
        });

        test('should return false when trying to extinguish non-existent candle', () => {
            stateManager.initializeCandleStates(3);
            
            const result = stateManager.extinguishCandle('non-existent');
            
            expect(result).toBe(false);
        });

        test('should track all lit candles correctly', () => {
            stateManager.initializeCandleStates(4);
            stateManager.extinguishCandle('candle-0');
            stateManager.extinguishCandle('candle-2');
            
            const litCandles = stateManager.getAllLitCandles();
            
            expect(litCandles).toHaveLength(2);
            expect(litCandles.map(c => c.id)).toEqual(['candle-1', 'candle-3']);
        });

        test('should detect when all candles are extinguished', () => {
            stateManager.initializeCandleStates(2);
            
            expect(stateManager.isAllCandlesExtinguished()).toBe(false);
            
            stateManager.extinguishCandle('candle-0');
            expect(stateManager.isAllCandlesExtinguished()).toBe(false);
            
            stateManager.extinguishCandle('candle-1');
            expect(stateManager.isAllCandlesExtinguished()).toBe(true);
        });

        test('should track progress correctly', () => {
            stateManager.initializeCandleStates(3);
            
            expect(stateManager.getCurrentProgress()).toBe(0);
            
            stateManager.extinguishCandle('candle-0');
            expect(stateManager.getCurrentProgress()).toBe(1);
            
            stateManager.extinguishCandle('candle-1');
            expect(stateManager.getCurrentProgress()).toBe(2);
        });
    });
});