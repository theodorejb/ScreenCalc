/// <reference path="../ts_definitions/node.d.ts" />
/// <reference path="../ts_definitions/mocha.d.ts" />

import ScreenCalc = require('../ScreenCalc');
import assert = require('assert');

// make some devices
var hdtv = new ScreenCalc(1920, 1080, 50);
var surfacePro = new ScreenCalc(1920, 1080, 10.6);
var ipadAir = new ScreenCalc(2048, 1536, 9.7);
var iphone5 = new ScreenCalc(1136, 640, 4.0);
var nexus7 = new ScreenCalc(1920, 1200, 7);
var asusVivotab = new ScreenCalc(1366, 768, 10.1);
var lumia920 = new ScreenCalc(1280, 768, 4.5);

describe('isPositiveInt()', function () {
    it('should return false for 0', function () {
        assert.strictEqual(ScreenCalc.isPositiveInt(0), false);
    });

    it('should return false for negative numbers', function () {
        assert.strictEqual(ScreenCalc.isPositiveInt(-0), false);
        assert.strictEqual(ScreenCalc.isPositiveInt(-1), false);
        assert.strictEqual(ScreenCalc.isPositiveInt(-25), false);
    });

    it('should return false for strings', function () {
        assert.strictEqual(ScreenCalc.isPositiveInt("string"), false);
        assert.strictEqual(ScreenCalc.isPositiveInt("1"), false);
    });

    it('should return false for floats', function () {
        assert.strictEqual(ScreenCalc.isPositiveInt(1.5), false);
    });

    it('should return true for positive integers', function () {
        assert.strictEqual(ScreenCalc.isPositiveInt(1), true);
        assert.strictEqual(ScreenCalc.isPositiveInt(2.00), true);
        assert.strictEqual(ScreenCalc.isPositiveInt(77), true);
        assert.strictEqual(ScreenCalc.isPositiveInt(100000000000), true);
    });
});

describe('isPositiveNum()', function () {
    it('should return false for 0', function () {
        assert.strictEqual(ScreenCalc.isPositiveNum(0), false);
    });

    it('should return false for negative numbers', function () {
        assert.strictEqual(ScreenCalc.isPositiveNum(-0), false);
        assert.strictEqual(ScreenCalc.isPositiveNum(-1), false);
        assert.strictEqual(ScreenCalc.isPositiveNum(-25), false);
    });

    it('should return false for strings', function () {
        assert.strictEqual(ScreenCalc.isPositiveNum("string"), false);
        assert.strictEqual(ScreenCalc.isPositiveNum("1"), false);
        assert.strictEqual(ScreenCalc.isPositiveNum("2.0"), false);
    });

    it('should return true for positive floats', function () {
        assert.strictEqual(ScreenCalc.isPositiveNum(1.5), true);
        assert.strictEqual(ScreenCalc.isPositiveNum(0.1593792), true);
    });

    it('should return true for positive integers', function () {
        assert.strictEqual(ScreenCalc.isPositiveNum(1), true);
        assert.strictEqual(ScreenCalc.isPositiveNum(77), true);
        assert.strictEqual(ScreenCalc.isPositiveNum(100000000000), true);
    });
});

describe('Constructor', function () {
    it('should throw error if pixel width or pixel height are zero', function () {
        assert.throws(function () {
            var badDisplay = new ScreenCalc(0, 1080);
        }, Error);
        assert.throws(function () {
            var badDisplay = new ScreenCalc(1920, 0);
        }, Error);
    });
});

describe('Ratio calculation', function () {
    it('should work with a widescreen TV', function () {
        assert.strictEqual(Math.round(hdtv.getRatio() * 100) / 100, 1.78);
    });

    it('should work with an iPad', function () {
        assert.strictEqual(Math.round(ipadAir.getRatio() * 100) / 100, 1.33);
    });
});

describe('String ratio calculation', function () {
    it('should work with a widescreen TV', function () {
        assert.strictEqual(hdtv.getStringRatio(), "16:9");
    });

    it('should work with tablets and phones', function () {
        assert.strictEqual(nexus7.getStringRatio(), "16:10");
        assert.strictEqual(ipadAir.getStringRatio(), "4:3");
        assert.strictEqual(lumia920.getStringRatio(), "5:3");
    });
});

describe('Area calculation', function () {
    // expected iPad and Asus VivoTab numbers taken from http://www.curi.us/1571-lying-microsoft-advertising
    
    it('should work with tablets', function () {
        assert.strictEqual(Math.round(ipadAir.getArea() * 100) / 100, 45.16);
        assert.strictEqual(Math.round(asusVivotab.getArea() * 10) / 10, 43.6);
        assert.strictEqual(Math.round(surfacePro.getArea() * 100) / 100, 48.01);
    });

});

describe('Pixel density calculation', function () {
    it('should correctly calculate the density of high dpi phones and tablets', function () {
        assert.strictEqual(ipadAir.getPixelDensity(), 264);
        assert.strictEqual(iphone5.getPixelDensity(), 326);
        assert.strictEqual(surfacePro.getPixelDensity(), 208);
    });

    it('should correctly calcualte the density of large screens', function () {
        assert.strictEqual(hdtv.getPixelDensity(), 44);
    });
});

describe('Pixel count calculation', function () {
    it('should correctly calculate the total number of pixels in a screen', function () {
        assert.strictEqual(iphone5.getPixelCount(), 1136 * 640);
        assert.strictEqual(lumia920.getPixelCount(), 1280 * 768);
    });
});

describe('Diagonal size calculation', function () {
    var ipadMiniRetina = new ScreenCalc(2048, 1536);

    it("should return zero if diagonal size and density aren't specified", function () {
        assert.strictEqual(ipadMiniRetina.getDiagonalSize(), 0);
    });

    it('should correctly calculate the diagonal size when pixel density is set', function () {
        ipadMiniRetina.setPixelDensity(326);
        assert.strictEqual(Math.round(ipadMiniRetina.getDiagonalSize() * 10) / 10, 7.9);
    });

    it('should change diagonal size to zero if set to NaN', function () {
        var impossibleDisplay = new ScreenCalc(1000, 1000, NaN);
        assert.strictEqual(impossibleDisplay.getDiagonalSize(), 0);
    });
});

describe('Physical width and height calculation', function () {
    it('should correctly calculate physical width', function () {
        assert.strictEqual(Math.round(ipadAir.getPhysicalWidth() * 100) / 100, 7.76);
        assert.strictEqual(Math.round(asusVivotab.getPhysicalWidth() * 100) / 100, 8.8);
    });

    it('should correctly calculate physical height', function () {
        assert.strictEqual(Math.round(ipadAir.getPhysicalHeight() * 100) / 100, 5.82);
        assert.strictEqual(Math.round(asusVivotab.getPhysicalHeight() * 100) / 100, 4.95);
    });
});
