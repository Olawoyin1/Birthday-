# ✨ Make a Wish ✨

A magical interactive experience where you can blow out candles and reveal beautiful wishes in a stunning slideshow. Perfect for sending personalized messages to someone special!

## 🌟 Features

- **Interactive Candles**: Blow into your microphone or tap candles to make wishes
- **Beautiful Animations**: Smooth Framer Motion animations and particle effects
- **Stunning Slideshow**: Manual navigation through personalized wishes with celebration animations
- **Celebration Effects**: Hurray animations, particle bursts, and floating elements on each slide
- **Beautiful Typography**: Festive fonts perfect for celebrations (Fredoka One, Dancing Script, Quicksand)
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Fallback Support**: Touch controls when microphone isn't available

## 🎭 How to Customize Wishes

### Method 1: Edit the Default Wishes
Open `js/app.js` and modify the `wishesData` array:

```javascript
this.wishesData = [
    {
        text: "✨ Your custom wish message here! ✨",
        image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&h=300&fit=crop"
    },
    {
        text: "🌟 Another beautiful wish! 🌟",
        image: null // no image for this slide
    }
    // Add more wishes...
];
```

### Method 2: Add Wishes Programmatically
After the app loads, you can add wishes using the browser console:

```javascript
// Add a single wish
makeAWishApp.addWish({
    text: "🎨 Your amazing wish message! 🎨",
    image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=500&h=300&fit=crop"
});

// Replace all wishes
makeAWishApp.setCustomWishes([
    { 
        text: "First wish ✨",
        image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&h=300&fit=crop"
    },
    { text: "Second wish 🌟" },
    { text: "Third wish 💫" }
]);
```

### Method 3: Customize the Title
You can change the slideshow title by modifying the HTML in `index.html`:

```html
<h2 class="slideshow-title">🌟 Your Custom Title Here! 💫</h2>
```

## 🎨 Adding Images

To add images to your wishes:

1. Place your images in a folder (e.g., `images/`)
2. Reference them in the wish object:

```javascript
{
    text: "Your wish text here!",
    image: "images/your-photo.jpg",
    alt: "Description of your image" // optional
}
```

**Supported formats**: JPG, PNG, GIF, WebP

## 🚀 Getting Started

1. Open `index.html` in a web browser
2. Allow microphone access when prompted (optional)
3. Blow into your microphone or tap candles to make wishes
4. Enjoy the magical slideshow!

## 📱 Mobile Support

The app works great on mobile devices:
- Touch controls automatically activate if microphone isn't available
- Responsive design adapts to all screen sizes
- Optimized animations for smooth performance

## 🎪 Customization Tips

- **Colors**: Modify CSS variables in `styles.css` to change the color scheme
- **Animation Speed**: Adjust timing in `SlideShowManager.js` (`autoPlayDelay`)
- **Particle Effects**: Customize particle density and effects in `ParticleSystem.js`
- **Candle Count**: Change `candleCount` in `js/app.js` (recommended: 5-10)

## 🌈 Perfect For

- Birthday surprises
- Anniversary messages
- Graduation wishes
- Holiday greetings
- Any special occasion!

## 💝 Sharing

Simply send the entire folder to someone, and they can open `index.html` to experience your personalized wishes!

---

*Made with ✨ magic ✨ and lots of love!*