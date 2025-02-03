# MMM-Birthday-Paged

A MagicMirror² module that celebrates birthdays with animated fireworks and confetti effects, specifically designed for use with page-switching modules like MMM-pages and MMM-Carousel.

This is a specialized version of [MMM-Birthday](https://github.com/cgillinger/MMM-Birthday) optimized for multi-page MagicMirror setups. If you're running a single-page setup where you want birthday celebrations to overlay existing content, please use the original [MMM-Birthday](https://github.com/cgillinger/MMM-Birthday) module instead.

## Key Differences from Original MMM-Birthday

- Designed for dedicated celebration pages in multi-page setups
- Full page takeover during celebrations (completely dims other content)
- Optimized for page transitions
- Enhanced compatibility with MMM-pages and MMM-Carousel
- Improved startup behavior with page-switching modules
- Multiple firework effects to choose from

## Installation

1. Navigate to your MagicMirror's modules directory:
```bash
cd ~/MagicMirror/modules
```

2. Clone this repository:
```bash
git clone https://github.com/cgillinger/MMM-Birthday-Paged.git
```

3. Install dependencies:
```bash
cd MMM-Birthday-Paged
npm install
```

## Configuration

### Basic Module Configuration

Add the module to your `config/config.js` file:

```javascript
{
    module: "MMM-Birthday-Paged",
    position: "middle_center",
    config: {
        birthdays: [
            { name: "Anna", date: "03-15" },
            { name: "Beth", date: "07-22" },
            { name: "Charlie", date: "12-25 08:00" }
        ],
        fireworkDuration: "infinite", // or specific duration in milliseconds
        confettiDuration: "infinite"  // or specific duration in milliseconds
    }
}
```

### Firework Effects

The module comes with several firework effects located in the `fireworks` directory. You can choose between:

- `classic` - Traditional starburst firework effect (default)
- `sparkle` - CSS-based effect with glowing sparks and trails
- `spiral` - Rotating star-shaped particles in spiral patterns
- `comet_trail` - Long-lasting trails with comet-like effects
- `glow` - Enhanced glowing effects with improved physics
- `jellyfish` - Unique jellyfish-inspired effect with tentacles
- `kaleidoscope` - Geometric patterns with rotating elements
- `waterfall` - Cascading color-shifting effects
- `megabombastic` - High-intensity effect (requires powerful hardware)

To change the firework effect:

1. Navigate to the module's `fireworks` directory
2. Choose the effect you want to use
3. Copy your chosen effect file to the module's root directory
4. Rename the copied file to `fireworks.js` (this is important!)

For example, to use the spiral effect:
```bash
cd ~/MagicMirror/modules/MMM-Birthday-Paged
cp fireworks/spiral_fireworks.js fireworks.js
```

Note: The ability to select effects via config.js will be added in a future update.

### Using with MMM-pages

```javascript
{
    module: "MMM-Birthday-Paged",
    position: "middle_center",
    classes: "page2",  // Specify which page this module belongs to
    config: {
        birthdays: [
            { name: "Anna", date: "03-15" }
        ],
        fireworkEffect: "sparkle"
    }
},
{
    module: "MMM-pages",
    config: {
        modules: [
            ["clock", "calendar", "weather"],  // Page 1
            ["MMM-Birthday-Paged"]            // Page 2 - Birthday page
        ],
        fixed: ["alert"],
        rotationTime: 15000,
        rotationDelay: 15000,
    }
}
```

### Using with MMM-Carousel

```javascript
{
    module: "MMM-Carousel",
    config: {
        transitionInterval: 15000,
        mode: "slides",
        slides: [
            ["clock", "calendar"],
            ["MMM-Birthday-Paged"]
        ]
    }
}
```

### Important Configuration Notes

1. Always place this module on its own page in your rotation
2. The module completely dims any other content when active
3. First page transition after startup might display slightly differently
4. Consider setting `rotationDelay` equal to `rotationTime` for smoother transitions
5. Some firework effects may be more resource-intensive than others

## Language Support

The module's language is controlled by your MagicMirror's global language setting. To change the language, modify the global `language` setting in your `config/config.js`:

```javascript
{
    language: "en", // en, sv, da, de, es, fi, fr, it, nl, no, pt, uk
    ...
}
```

## Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `birthdays` | Array of birthday objects containing name and date | `[]` |
| `fireworkDuration` | Duration of fireworks in ms or "infinite" | "infinite" |
| `confettiDuration` | Duration of confetti in ms or "infinite" | "infinite" |

| `debug` | Enable detailed logging for troubleshooting | false |

### Birthday Format
- Date format: `MM-DD` or `MM-DD HH:mm`
- Example: `"12-25"` for December 25th
- Example with time: `"12-25 08:00"` for December 25th at 8:00 AM

## Technical Details

### Page Switching Behavior

When using this module with page-switching modules:
1. The module fully dims all other content on its page during celebrations
2. First startup/transition might behave slightly differently due to module initialization timing
3. Subsequent transitions will work smoothly
4. The module automatically handles cleanup during page transitions

### Firework Effects Performance

Different firework effects have varying performance requirements:
- `classic`, `sparkle`, and `comet_trail` are optimized for all devices including Raspberry Pi
- `spiral`, `glow`, and `waterfall` require moderate processing power
- `megabombastic` is designed for powerful hardware and should be used with caution on low-power devices
- All other effects should work well on most modern devices

### Debug Logging

Enable debug logging in your config to troubleshoot any issues:
```javascript
config: {
    debug: true,
    ...
}
```

## Dependencies

- MagicMirror²: Minimum version 2.15.0
- Node.js: Minimum version 12.0.0
- canvas-confetti: ^1.9.3
- MMM-pages or MMM-Carousel (recommended)

## Creating Custom Firework Effects

You can create your own firework effects by adding new JavaScript files to the `fireworks` directory. Each effect must:

1. Export a class named `Fireworks`
2. Implement the standard API:
   - `start(duration)` method
   - `cleanup()` method
3. Follow the module's canvas setup requirements

See the existing effects in the `fireworks` directory for examples.

## Credits

This module is a specialized version of the original [MMM-Birthday](https://github.com/cgillinger/MMM-Birthday) module, modified specifically for use with page-switching modules.

## Author

- Christian Gillinger
- License: MIT
- Version: 1.0.0

## Support

For issues and feature requests, please use the [GitHub issue tracker](https://github.com/yourusername/MMM-Birthday-Paged/issues).

## Changelog

### Version 1.0.0
- Initial release based on MMM-Birthday v1.4.2
- Added multiple firework effect options
- Added custom firework effect support
- Specialized for page-switching environments
- Enhanced page transition handling
- Added comprehensive debug logging
- Improved module state management for page switches