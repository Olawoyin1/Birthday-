# Design Document

## Overview

The Birthday Cake Blower is a web application that creates an interactive birthday celebration experience. Users blow into their microphone to extinguish animated candles on a birthday cake, with fallback click interactions for accessibility. The application uses vanilla JavaScript for logic and Framer Motion for smooth animations, ensuring a lightweight yet visually appealing experience.

The system architecture follows a modular approach with clear separation between audio processing, animation management, state tracking, and user interface components. The application prioritizes performance and accessibility while maintaining engaging visual effects.

## Architecture

The application follows a component-based architecture using vanilla JavaScript modules:

```
┌─────────────────────────────────────────┐
│              Main App                   │
│  ┌─────────────────────────────────────┐│
│  │         UI Controller               ││
│  │  ┌─────────────────────────────────┐││
│  │  │      Audio Manager              │││
│  │  └─────────────────────────────────┘││
│  │  ┌─────────────────────────────────┐││
│  │  │    Animation Manager            │││
│  │  └─────────────────────────────────┘││
│  │  ┌─────────────────────────────────┐││
│  │  │      State Manager              │││
│  │  └─────────────────────────────────┘││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### Core Components:

1. **Main App**: Entry point that initializes all components and manages the application lifecycle
2. **UI Controller**: Manages DOM interactions, user instructions, and fallback controls
3. **Audio Manager**: Handles microphone access, audio processing, and blow detection
4. **Animation Manager**: Controls all Framer Motion animations for candles, flames, and effects
5. **State Manager**: Tracks candle states, progress, and application state transitions

## Components and Interfaces

### Audio Manager
```javascript
class AudioManager {
  async requestMicrophoneAccess()
  startBlowDetection()
  stopBlowDetection()
  onBlowDetected(callback)
  getBlowIntensity()
}
```

**Responsibilities:**
- Request and manage microphone permissions
- Process audio input using Web Audio API
- Detect blow patterns through frequency analysis
- Provide real-time blow intensity measurements

### Animation Manager
```javascript
class AnimationManager {
  initializeCandles(count)
  animateFlameFlicker(candleId, intensity)
  extinguishCandle(candleId)
  showSmokeEffect(candleId)
  revealBirthdayMessage()
  showCelebrationEffects()
}
```

**Responsibilities:**
- Initialize and manage candle flame animations
- Control flame intensity based on blow detection
- Handle candle extinguishing sequences
- Manage celebration and message reveal animations

### State Manager
```javascript
class StateManager {
  initializeCandleStates(count)
  extinguishCandle(candleId)
  getAllLitCandles()
  isAllCandlesExtinguished()
  getCurrentProgress()
}
```

**Responsibilities:**
- Track individual candle states (lit/extinguished)
- Manage application state transitions
- Provide progress tracking functionality
- Handle state persistence if needed

### UI Controller
```javascript
class UIController {
  displayInstructions()
  showFallbackControls()
  updateProgressIndicator()
  handleCandleClick(candleId)
  showBlowFeedback()
}
```

**Responsibilities:**
- Render user instructions and feedback
- Handle fallback interaction methods
- Update visual progress indicators
- Manage accessibility features

## Data Models

### Candle Model
```javascript
{
  id: string,
  isLit: boolean,
  position: { x: number, y: number },
  flameIntensity: number,
  element: HTMLElement
}
```

### Application State
```javascript
{
  candles: Candle[],
  microphoneAccess: boolean,
  blowDetectionActive: boolean,
  celebrationTriggered: boolean,
  fallbackMode: boolean,
  userPreferences: {
    name: string,
    customMessage: string
  }
}
```

### Audio Data
```javascript
{
  audioContext: AudioContext,
  analyser: AnalyserNode,
  microphone: MediaStreamAudioSourceNode,
  frequencyData: Uint8Array,
  blowThreshold: number
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

**Property 1: Candle count consistency**
*For any* application initialization, the number of rendered candles should be between 5 and 10, and each candle should have proper positioning
**Validates: Requirements 1.1**

**Property 2: Lit candles have flames**
*For any* candle in the lit state, that candle should have a visible flame element present
**Validates: Requirements 1.2**

**Property 3: Individual candle state tracking**
*For any* candle, its state should be independently trackable as either lit or extinguished without affecting other candles
**Validates: Requirements 1.5**

**Property 4: Microphone monitoring activation**
*For any* successful microphone access grant, the audio monitoring system should become active and ready to detect blow events
**Validates: Requirements 2.1**

**Property 5: Sequential candle extinguishing**
*For any* blow detection event with sufficient intensity, candles should be extinguished one at a time rather than simultaneously
**Validates: Requirements 2.3**

**Property 6: Wick visibility after extinguishing**
*For any* extinguished candle, the candle wick should remain visible while the flame element is removed
**Validates: Requirements 2.5**

**Property 7: Fallback controls visibility**
*For any* scenario where microphone access is denied or unavailable, fallback interaction controls should be clearly visible
**Validates: Requirements 3.1**

**Property 8: Click-based candle extinguishing**
*For any* candle in fallback mode, clicking or tapping that candle should successfully extinguish it
**Validates: Requirements 3.2**

**Property 9: Complete fallback functionality**
*For any* application session without microphone access, all candles should be extinguishable through fallback interactions alone
**Validates: Requirements 3.4**

**Property 10: Fallback instruction display**
*For any* fallback mode activation, appropriate alternative interaction instructions should be displayed to the user
**Validates: Requirements 3.5**

**Property 11: Lit candle count tracking**
*For any* candle extinguishing event, the count of remaining lit candles should decrease by exactly one
**Validates: Requirements 4.3**

**Property 12: Message visibility before completion**
*For any* application state where candles remain lit, the birthday message should not be visible
**Validates: Requirements 4.5**

**Property 13: Message reveal on completion**
*For any* application state where all candles are extinguished, the birthday message should become visible
**Validates: Requirements 5.2**

**Property 14: Message content and personalization**
*For any* birthday message display, the content should include celebratory text and support personalization with user-provided data
**Validates: Requirements 5.3, 5.5**

## Error Handling

### Microphone Access Errors
- **Permission Denied**: Gracefully fall back to click/tap interactions with clear user messaging
- **Device Unavailable**: Detect when no microphone is available and automatically enable fallback mode
- **Audio Context Errors**: Handle Web Audio API failures and provide alternative interaction methods

### Animation Errors
- **Framer Motion Load Failures**: Provide basic CSS fallback animations if library fails to load
- **Performance Issues**: Implement animation throttling for lower-end devices
- **DOM Manipulation Errors**: Ensure candle elements exist before attempting animations

### State Management Errors
- **Invalid Candle States**: Validate candle state transitions and prevent invalid states
- **Progress Tracking Errors**: Ensure candle count consistency and handle edge cases
- **Personalization Errors**: Handle missing or invalid personalization data gracefully

### User Interaction Errors
- **Invalid Click Targets**: Ensure only valid candle elements can be clicked in fallback mode
- **Rapid Interaction Handling**: Prevent double-clicks or rapid interactions from causing state issues
- **Touch Event Conflicts**: Handle both mouse and touch events appropriately on mobile devices

## Testing Strategy

### Unit Testing Approach
The application will use Jest for unit testing, focusing on:
- **State Management**: Test candle state transitions, progress tracking, and application state changes
- **Audio Processing**: Test blow detection logic, intensity calculations, and microphone access handling
- **User Interactions**: Test click handlers, fallback mode activation, and instruction display
- **Error Handling**: Test graceful degradation and error recovery scenarios

### Property-Based Testing Approach
The application will use fast-check for property-based testing with a minimum of 100 iterations per test:
- **Universal Properties**: Test behaviors that should hold across all valid inputs and states
- **State Invariants**: Verify that application state remains consistent through all operations
- **Interaction Properties**: Test that user interactions produce expected results regardless of timing or sequence
- **Cross-Platform Properties**: Verify consistent behavior across different devices and browsers

Each property-based test will be tagged with comments explicitly referencing the correctness property from this design document using the format: **Feature: birthday-cake-blower, Property {number}: {property_text}**

### Integration Testing
- **End-to-End Scenarios**: Test complete user workflows from application load to birthday message reveal
- **Cross-Component Integration**: Verify proper communication between audio, animation, and state management components
- **Accessibility Testing**: Ensure fallback interactions work seamlessly when microphone access is unavailable
- **Performance Testing**: Validate smooth animation performance across target devices and browsers

### Testing Requirements
- Unit tests verify specific examples, edge cases, and error conditions
- Property tests verify universal properties that should hold across all inputs
- Both testing approaches are complementary and provide comprehensive coverage
- Unit tests catch concrete bugs while property tests verify general correctness
- All tests must validate real functionality without using mocks for core logic
- Property-based tests must run a minimum of 100 iterations to ensure thorough coverage
- Each correctness property must be implemented by a single property-based test
- Test failures should provide clear feedback about what functionality is broken