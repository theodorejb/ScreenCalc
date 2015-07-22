# ScreenCalc

[![NPM version](https://img.shields.io/npm/v/screencalc.svg)](https://www.npmjs.org/package/screencalc) [![Total downloads](https://img.shields.io/npm/dm/screencalc.svg)](https://www.npmjs.org/package/screencalc) [![Build Status](https://travis-ci.org/theodorejb/ScreenCalc.svg?branch=master)](https://travis-ci.org/theodorejb/ScreenCalc)

ScreenCalc is a powerful JavaScript module which makes it easy to answer almost any kind of question about the properties of a display. For example:

*What is the resolution of a 16:9 screen with 1,440,000 pixels?*

```javascript
var screen = new ScreenCalc({
    ratio:      16/9,
    pixelCount: 1440000
});

var w = screen.getPixelWidth();  // 1600
var h = screen.getPixelHeight(); // 900
```

*What are the physical dimensions and ppi of a 50-inch 1080p television screen?*

```javascript
var screen = new ScreenCalc({
    pixelWidth:   1920,
    pixelHeight:  1080,
    diagonalSize: 50
});

var w = screen.getPhysicalWidth();  // 43.579
var h = screen.getPhysicalHeight(); // 24.513
var d = screen.getPixelDensity();   // 44.058
```

*What resolution is needed for a 27-inch 16:9 display with 300ppi?*

```javascript
var screen = new ScreenCalc({
    diagonalSize: 27,
    pixelDensity: 300,
    ratio:        16/9
});

var w = screen.getPixelWidth();  // 7059.762
var h = screen.getPixelHeight(); // 3971.116
```

*What is the aspect ratio and diagonal size of a screen with an area of 8437.5 square centimeters and a width of 112.5 centimeters?*

```javascript
var screen = new ScreenCalc({
    area: 8437.5,
    physicalWidth: 112.5
});

var r = screen.getStringRatio();  // 3:2
var d = screen.getDiagonalSize(); // 135.2
```

## Usage

Install using npm. For client-side use, check out [browserify](http://browserify.org/).

`npm install screencalc`

Require the module and instantiate with any combination of properties:

```javascript
var ScreenCalc = require('screencalc');

var screen = new ScreenCalc({
    ratio:          16/10,
    pixelDensity:   225,
    physicalHeight: 4.5
});
```

### Full list of settable properties

1. ratio
2. pixelWidth
3. pixelHeight
4. pixelCount
5. pixelDensity
6. physicalWidth
7. physicalHeight
8. area
9. diagonalSize

Each of these properties has a corresponding *getPropertyName()* method (e.g. `getPixelHeight()`). Individual methods will return `null` if there is not enough data to perform the calculation:

```javascript
var noPixels = new ScreenCalc({
	physicalWidth:  30,
    physicalHeight: 18
}).getPixelCount(); // null
```

**Note:** ScreenCalc intentionally avoids rounding any values calculated by these methods (including pixel width, pixel height, and pixel count). When working with imprecise data, be sure to round results as necessary.

### Simplified ratio calculation

In addition to the getter methods corresponding to each settable property, ScreenCalc comes with two additional methods for calculating simplified ratios: `getSimpleRatio()` and `getStringRatio()`.

`getSimpleRatio()` returns an object with `width` and `height` properties containing the simplified ratio. Additionally, a `difference` property stores the difference between the simplified ratio and the exact ratio of the screen. The difference will be zero if the simplified ratio is precise.

```javascript
var laptop = new ScreenCalc({
	pixelWidth:  1366,
    pixelHeight: 768
});

var ratio = laptop.getSimpleRatio(); // { width: 16, height: 9, difference: -0.0008680555555555802 }
```

`getStringRatio()` returns the same simplified ratio as `getSimpleRatio()`, but as a string in the format *width:height*. If the simplified ratio is not exact, a tilde will be prepended to the string:

```javascript
var strRatio = laptop.getStringRatio(); // "~16:9"
```

Both `getSimpleRatio()` and `getStringRatio()` accept an optional parameter to override the default precision. This parameter should be a number between 0 and 1, where values closer to zero increase the precision. If not specified, the precision will default to `5.0e-3`.

```javascript
var exactRatio    = laptop.getSimpleRatio(1.0e-5); // { width: 683, height: 384, difference: 0 }
var exactStrRatio = laptop.getStringRatio(1.0e-5); // "683:384"
```

## Development

ScreenCalc is written in TypeScript. After editing files, run `npm install` to
compile everything and create a browser test bundle. Run `npm test` to ensure all
the tests pass, or use `test/browser/index.html` to run the tests in a browser.
Bug reports and pull requests are welcome!

## Author

Theodore Brown  
<http://theodorejb.me>

## License

MIT
