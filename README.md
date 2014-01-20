# ScreenCalc

ScreenCalc is a powerful utility which makes it easy to answer almost any kind of question about the properties of a display. For example:

*What is the resolution of a 16:9 screen with 1,440,000 pixels?*

```javascript
var screen = new ScreenCalc({
    ratio:      16/9,
    pixelCount: 1440000
});

var w = screen.getPixelWidth();  // 1600
var h = screen.getPixelHeight(); // 900
```

*What are the physical dimensions and dpi of a 50-inch 1080p television screen?*

```javascript
var screen = new ScreenCalc({
    pixelWidth:   1920,
    pixelHeight:  1080,
    diagonalSize: 50
});

var w = screen.getPhysicalWidth();  // 43.579
var h = screen.getPhysicalHeight(); // 24.513
var d = screen.getPixelDensity();   // 44
```

*What resolution is needed for a 27-inch 16:9 display with 300ppi?*

```javascript
var screen = new ScreenCalc({
    diagonalSize: 27,
    pixelDensity: 300,
    ratio:        16/9
});

var w = screen.getPixelWidth(); // 7060
var h = screen.getPixelHeight;  // 3971
```

## Usage

Install using npm. For client-side use, check out [browserify](http://browserify.org/).

`npm install screencalc`

Require the module and instantiate with any combination of properties:

```javascript
var ScreenCalc = require('screencalc');

var screen = new ScreenCalc({
    ratio:          16/10,
    pixelDensity:   300,
    physicalHeight: 4.5
});
```

Full property list:

1. ratio
2. pixelWidth
3. pixelHeight
4. pixelCount
5. pixelDensity
6. physicalWidth
7. physicalHeight
8. diagonalSize

Each of these properties has a corresponding getPropertyName() method (e.g. getPixelHeight()). In addition, there is a getStringRatio() method which returns the ratio in a more readable form (e.g. "16:9" instead of 1.778 (16 divided by 9)).

Individual getter methods will return `null` if there is not enough data to perform the calculation:

```javascript
var noPixels = new ScreenCalc({
	physicalWidth:  30,
    physicalHeight: 18
}).getPixelCount(); // null
```

Note: ScreenCalc intentionally avoids rounding any calculated values, so if imprecise data is provided the result could also be inexact. When working with imprecise data, be sure to round results as necessary.

## What's missing?

1. Dependent properties are not yet updated when calling setData() on instantiated screens.
2. Constructor does not check for conflicts between specified properties.

## Development

ScreenCalc is written in TypeScript. After editing files, run `grunt` to compile everything, then `npm test` to ensure all the tests pass. Use `test/browser/index.html` to run the tests in a browser. Bug reports and pull requests are welcome!

## Author

Theodore Brown  
[@theodorejb](https://twitter.com/theodorejb)  
<http://designedbytheo.com>

## License

MIT
