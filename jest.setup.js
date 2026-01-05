// Jest setup file for Birthday Cake Blower tests

// Mock Web Audio API
global.AudioContext = function() {
    return {
        createAnalyser: function() {
            return {
                fftSize: 256,
                frequencyBinCount: 128,
                getByteFrequencyData: function() {}
            };
        },
        createMediaStreamSource: function() {
            return {
                connect: function() {}
            };
        },
        resume: function() { return Promise.resolve(); },
        close: function() { return Promise.resolve(); }
    };
};

global.webkitAudioContext = global.AudioContext;

// Mock getUserMedia
global.navigator = global.navigator || {};
global.navigator.mediaDevices = {
    getUserMedia: function() {
        return Promise.resolve({
            getTracks: function() {
                return [{
                    stop: function() {}
                }];
            }
        });
    }
};

// Mock Framer Motion
global.Motion = {
    animate: function() { return Promise.resolve(); },
    timeline: function() { return Promise.resolve(); }
};

// Mock DOM methods
const mockElement = function(tagName = 'div') {
    return {
        tagName: tagName.toUpperCase(),
        classList: {
            add: function() {},
            remove: function() {},
            contains: function() { return false; }
        },
        style: {},
        dataset: {},
        addEventListener: function() {},
        removeEventListener: function() {},
        appendChild: function() {},
        removeChild: function() {},
        remove: function() {},
        querySelector: function() { return null; },
        querySelectorAll: function() { return []; },
        getAttribute: function() { return null; },
        setAttribute: function() {},
        innerHTML: '',
        textContent: '',
        parentNode: null
    };
};

global.document.createElement = function(tagName) {
    const element = mockElement(tagName);
    element.querySelector = function(sel) {
        if (sel === '.flame') return mockElement();
        if (sel === '.wick') return mockElement();
        return null;
    };
    return element;
};

// Mock document.head.appendChild if it exists
if (global.document.head && global.document.head.appendChild) {
    global.document.head.appendChild = function() {};
}

// Mock console methods to reduce noise in tests
global.console = {
    ...console,
    log: function() {},
    warn: function() {},
    error: function() {}
};