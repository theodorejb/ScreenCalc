# ScreenCalc

ScreenCalc allows data about any display to be easily calculated. For example, from resolution and diagonal size the physical width and height, pixel density, aspect ratio, area, and other properties can be retrieved.

## Usage

Install using npm.

`npm install screencalc`

For client-side usage, check out [browserify](http://browserify.org/).

```javascript
var ScreenCalc = require('screencalc');
var screen = new ScreenCalc(1920, 1080, 10.6);

var strRatio      = screen.getStringRatio();   // "16:9"
var pixelDensity  = screen.getPixelDensity();  // 208
var physicalWidth = screen.getPhysicalWidth(); // 9.2387
var area          = screen.getArea();          // 48.01
```

## Development

ScreenCalc is written in TypeScript. After editing files, run `grunt` to compile everything, then `npm test` to ensure all the tests pass. Use `test/browser/index.html` to run the tests in a browser.

## License

MIT
