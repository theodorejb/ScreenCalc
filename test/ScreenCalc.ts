/// <reference path="../ts_definitions/node.d.ts" />
/// <reference path="../ts_definitions/mocha.d.ts" />

import ScreenCalc = require('../lib/ScreenCalc');
import assert = require('assert');

describe('constructor', function () {
    it('should allow displays to be constructed without any properties', function () {
        assert.doesNotThrow(function () {
            var screen = new ScreenCalc();
        });
    });

    it('should allow screens to be created with multiple properties', function () {
        assert.doesNotThrow(function () {
            var screen = new ScreenCalc({
                pixelWidth: 1920,
                pixelHeight: 1080,
                diagonalSize: 10.6
            });
        });
    });
});

describe('setData()', function () {
    it('should reset unpassed properties if "reset" is set to true', function () {
        var screen = new ScreenCalc({
            pixelCount: 1000
        });

        screen.setData({
            pixelWidth: 1024
        }, true);

        assert.strictEqual(screen.getPixelCount(), null);
        assert.strictEqual(screen.getPixelWidth(), 1024);
    });

    it('should update dependent properties if they are already set');
    it('should throw an error if conflicting data is provided');
});

describe('getPixelWidth()', function () {
    it('should work with pixel count and ratio', function () {
        var screen = new ScreenCalc({
            ratio: 1920 / 1080,
            pixelCount: 1920 * 1080
        });

        assert.strictEqual(screen.getPixelWidth(), 1920);
    });

    it('should work with physical width and density', function () {
        var ipadAir = new ScreenCalc({
            physicalWidth: 7.76,
            pixelDensity: 264
        });

        assert.strictEqual(Math.floor(ipadAir.getPixelWidth()), 2048); // 2048.64
    });
});

describe('getPixelHeight()', function () {
    it('should work with pixel count and ratio', function () {
        var screen = new ScreenCalc({
            ratio: 1920 / 1080,
            pixelCount: 1920 * 1080
        });

        assert.strictEqual(screen.getPixelHeight(), 1080);
    });

    it('should work with physical height and density', function () {
        var ipadAir = new ScreenCalc({
            physicalHeight: 5.82,
            pixelDensity: 264
        });

        assert.strictEqual(Math.round(ipadAir.getPixelHeight()), 1536);
    });

    it('should work with ratio, diagonal size, and density', function () {
        var ipadAir = new ScreenCalc({
            pixelDensity: 264,
            ratio: 4 / 3,
            diagonalSize: 9.7
        });

        assert.strictEqual(Math.round(ipadAir.getPixelHeight()), 1536);
    });
});

describe('getPhysicalWidth()', function () {
    it('should work with resolution and diagonal size', function () {
        var ipadAir = new ScreenCalc({
            pixelWidth: 2048,
            pixelHeight: 1536,
            diagonalSize: 9.7
        });

        assert.strictEqual(ipadAir.getPhysicalWidth(), 7.76);
    });

    it('should work with diagonal size and ratio', function () {
        var asusVivotab = new ScreenCalc({
            ratio: 16 / 9,
            diagonalSize: 10.1
        });

        assert.strictEqual(Math.round(asusVivotab.getPhysicalWidth() * 100) / 100, 8.8);
    });
});

describe('getPhysicalHeight()', function () {
    it('should work when the resolution and diagonal size are known', function () {
        var ipadAir = new ScreenCalc({
            pixelWidth: 2048,
            pixelHeight: 1536,
            diagonalSize: 9.7
        });

        assert.strictEqual(ipadAir.getPhysicalHeight(), 5.82);
    });

    it('should work when the ratio and physical width are known', function () {
        var asusVivotab = new ScreenCalc({
            ratio: 16 / 9,
            physicalWidth: 8.8
        });

        assert.strictEqual(Math.round(asusVivotab.getPhysicalHeight() * 100) / 100, 4.95);
    });
});

describe('getRatio()', function () {
    it('should work with ratio', function () {
        var screen = new ScreenCalc({ ratio: 16 / 10 });
        assert.strictEqual(screen.getRatio(), 16 / 10);
    });

    it('should work with physical width and physical height', function () {
        var screen = new ScreenCalc({ physicalWidth: 16, physicalHeight: 10 });
        assert.strictEqual(screen.getRatio(), 16 / 10);
    });

    it('should work with pixel width and pixel height', function () {
        var screen = new ScreenCalc({ pixelWidth: 1600, pixelHeight: 1200 });
        assert.strictEqual(screen.getRatio(), 4 / 3);
    });

    it('should work with pixel width, physical height, and pixel density', function () {
        var ipadAir = new ScreenCalc({
            pixelWidth: 2048,
            physicalHeight: 5.82,
            pixelDensity: 1536 / 5.82
        });

        assert.strictEqual(Math.round(ipadAir.getRatio() * 100) / 100, Math.round(4 / 3 * 100) / 100);
    });

    it('should work with pixel height and total number of pixels', function () {
        var screen = new ScreenCalc({
            pixelHeight: 1200,
            pixelCount: 1600 * 1200
        });

        assert.strictEqual(screen.getRatio(), 4 / 3);
    });
});

describe('getStringRatio()', function () {
    it('should work with pixel width and pixel height', function () {
        var hdtv = new ScreenCalc({ pixelWidth: 1920, pixelHeight: 1080 });
        assert.strictEqual(hdtv.getStringRatio(), "16:9");
    });
});

describe('getArea()', function () {
    // expected iPad and Asus VivoTab numbers taken from http://www.curi.us/1571-lying-microsoft-advertising

    it('should work with resolution and diagonal size', function () {
        var ipadAir = new ScreenCalc({
            pixelWidth: 2048,
            pixelHeight: 1536,
            diagonalSize: 9.7
        });

        assert.strictEqual(Math.round(ipadAir.getArea() * 100) / 100, 45.16);
    });

    it('should work with ratio, pixel width, and diagonal size', function () {
        var asusVivotab = new ScreenCalc({
            pixelWidth: 1366,
            ratio: 16 / 9,
            diagonalSize: 10.1
        });

        assert.strictEqual(Math.round(asusVivotab.getArea() * 10) / 10, 43.6);
    });

    it('should work with physical width, pixel height, and density', function () {
        var surfacePro = new ScreenCalc({
            pixelHeight: 1080,
            pixelDensity: 208,
            physicalWidth: 9.2387
        });

        assert.strictEqual(Math.round(surfacePro.getArea()), 48);
    });
});

describe('getPixelDensity()', function () {
    it('should work with pixel width and physical width', function () {
        var lumia920 = new ScreenCalc({
            pixelWidth: 1280,
            physicalWidth: 3.8587,
        });

        assert.strictEqual(Math.round(lumia920.getPixelDensity() * 10) / 10, 331.7);
    });

    it('should work with pixel height and physical height', function () {
        var lumia920 = new ScreenCalc({
            pixelHeight: 768,
            physicalHeight: 2.3152
        });

        assert.strictEqual(Math.round(lumia920.getPixelDensity() * 10) / 10, 331.7);
    });

    it('should work with resolution and diagonal size', function () {
        var iphone5 = new ScreenCalc({
            pixelWidth: 1136,
            pixelHeight: 640,
            diagonalSize: 4.0
        });

        assert.strictEqual(Math.round(iphone5.getPixelDensity()), 326);
    });

    it('should work with pixel width, physical height, and ratio', function () {
        var nexus7 = new ScreenCalc({
            pixelWidth: 1920,
            physicalHeight: 3.71,
            ratio: 1920 / 1200
        });

        assert.strictEqual(Math.round(nexus7.getPixelDensity() * 100) / 100, 323.45);
    });
});

describe('getPixelCount()', function () {
    it('should work with pixel width and pixel height', function () {
        var screen = new ScreenCalc({
            pixelWidth: 640,
            pixelHeight: 480
        });

        assert.strictEqual(screen.getPixelCount(), 640 * 480);
    });

    it('should work with pixel width and ratio', function () {
        var screen = new ScreenCalc({
            pixelWidth: 640,
            ratio: 4 / 3
        });

        assert.strictEqual(screen.getPixelCount(), 640 * 480);
    });

    it('should work with pixel count', function () {
        var screen = new ScreenCalc({ pixelCount: 1000000 });
        assert.strictEqual(screen.getPixelCount(), 1000000);
    });

    it('should return null if insufficient data', function () {
        var screen = new ScreenCalc({ pixelWidth: 1024 });
        assert.strictEqual(screen.getPixelCount(), null);
    });
});

describe('getDiagonalSize()', function () {
    var ipadMiniRetina = new ScreenCalc({ pixelWidth: 2048, pixelHeight: 1536 });

    it("should return null if diagonal size and density aren't specified", function () {
        assert.strictEqual(ipadMiniRetina.getDiagonalSize(), null);
    });

    it('should correctly calculate the diagonal size when pixel density is set', function () {
        ipadMiniRetina.setData({ pixelDensity: 326 });
        assert.strictEqual(Math.round(ipadMiniRetina.getDiagonalSize() * 10) / 10, 7.9);
    });

    it('should change diagonal size to zero if set to NaN', function () {
        var impossibleDisplay = new ScreenCalc({ pixelWidth: 1000, pixelHeight: 1000, diagonalSize: NaN });
        assert.strictEqual(impossibleDisplay.getDiagonalSize(), 0);
    });
});
