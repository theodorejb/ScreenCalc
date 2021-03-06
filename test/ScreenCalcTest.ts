import {ScreenProperties} from '../lib/ScreenProperties';
import ScreenCalc from '../lib/ScreenCalc';
import * as assert from 'assert';

describe('constructor', function () {
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

    it('should work with ratio, area, and density', function () {
        var monitor = new ScreenCalc({
            area: 16 * 12,
            ratio: 16 / 12,
            pixelDensity: 100
        });

        assert.strictEqual(monitor.getPixelHeight(), 1200);
    });

    it('should work with ratio, diagonal size, and density', function () {
        var ipadAir = new ScreenCalc({
            pixelDensity: 264,
            ratio: 4 / 3,
            diagonalSize: 9.7
        });

        assert.strictEqual(Math.round(ipadAir.getPixelHeight()), 1536);
    });

    it('should work with physical width, density, and diagonal size', function () {
        var netbook = new ScreenCalc({
            // 1024x600
            physicalWidth: 7.678914306769556,
            pixelDensity: 133.3521848391074,
            diagonalSize: 8.9
        });

        assert.strictEqual(netbook.getPixelHeight(), 600);
    });
});

describe('getPhysicalWidth()', function () {
    it('should work when pixel height, density, and diagonal size are known', function () {
        var screen = new ScreenCalc({
            diagonalSize: 22.946949688357275,
            pixelHeight: 1080,
            pixelDensity: 96
        });

        assert.strictEqual(screen.getPhysicalWidth(), 20);
    });

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

    it('should work when the area and and ratio are known', function () {
        var screen = new ScreenCalc({
            area: 40 * 30,
            ratio: 4 / 3
        });

        assert.strictEqual(screen.getPhysicalWidth(), 40);
    });

    it('should work when the height, density, and total number of pixels are known', function () {
        var screen = new ScreenCalc({
            physicalHeight: 12,
            pixelDensity: 100,
            pixelCount: 1600 * 1200
        });

        assert.strictEqual(screen.getPhysicalWidth(), 16);
    });
});

describe('getPhysicalHeight()', function () {
    it('should work when pixel width, density, and diagonal size are known', function () {
        var screen = new ScreenCalc({
            diagonalSize: 22.946949688357275,
            pixelWidth: 1920,
            pixelDensity: 96
        });

        assert.strictEqual(screen.getPhysicalHeight(), 11.25);
    });

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

    it('should work when the area and and resolution are known', function () {
        var screen = new ScreenCalc({
            area: 40 * 30,
            pixelWidth: 1024,
            pixelHeight: 768
        });

        assert.strictEqual(screen.getPhysicalHeight(), 30);
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

    it('should work with diagonal size and physical width or height', function () {
        var screen = new ScreenCalc({
            diagonalSize: 20,
            physicalWidth: 16
            // (physical height: 12)
        });

        var portraitScreen = new ScreenCalc({
            diagonalSize: 30,
            physicalHeight: 24
            // (physical width: 18)
        });

        assert.strictEqual(screen.getRatio(), 4 / 3);
        assert.strictEqual(portraitScreen.getRatio(), 3 / 4);
    });

    it('should work with area and physical width or height', function () {
        var screen = new ScreenCalc({
            area: 600,
            physicalWidth: 30
            // (physical height: 20)
        });

        var portraitScreen = new ScreenCalc({
            area: 750,
            physicalHeight: 30
            // (physical width: 25)
        });

        assert.strictEqual(screen.getRatio(), 3 / 2);
        assert.strictEqual(portraitScreen.getRatio(), 25 / 30);
    });
});

describe('getSimpleRatio()', function () {
    it('should work whenever ratio is available', function () {
        var display = new ScreenCalc({
            ratio: 5 / 9
        });
        assert.deepEqual(display.getSimpleRatio(), { width: 5, height: 9, difference: 0 });

        var monitor = new ScreenCalc({ pixelWidth: 1920, pixelHeight: 1080 });
        assert.deepEqual(monitor.getSimpleRatio(), { width: 16, height: 9, difference: 0 });
    });

    it('should throw error if ratio is not available', function () {
        var screen = new ScreenCalc({ pixelWidth: 1024, physicalHeight: 15 });

        assert.throws(function () {
            screen.getSimpleRatio();
        }, /^Error: Insufficient data to calculate ratio$/);
    });

    it('should convert 8:5 ratios to 16:10', function () {
        var screen = new ScreenCalc({
            ratio: 16 / 10
        });

        var portraitScreen = new ScreenCalc({
            ratio: 10 / 16
        });

        assert.deepEqual(screen.getSimpleRatio(), { width: 16, height: 10, difference: 0 });
        assert.deepEqual(portraitScreen.getSimpleRatio(), { width: 10, height: 16, difference: 0 });
    });

    it('should allow precision to be changed', function () {
        var screen = new ScreenCalc({ pixelWidth: 1136, pixelHeight: 640 });
        assert.deepEqual(screen.getSimpleRatio(1.0e-3), { width: 71, height: 40, difference: 0 });
    });

    it('should include non-zero difference for imprecise ratios', function () {
        var screen = new ScreenCalc({ pixelWidth: 1136, pixelHeight: 640 });
        assert.strictEqual(screen.getSimpleRatio().difference, 0.002777777777777768);
    });
});

describe('getStringRatio()', function () {
    it('should return ratio in width:height format', function () {
        var screen = new ScreenCalc({ physicalWidth: 20, physicalHeight: 10 });
        assert.strictEqual(screen.getStringRatio(), "2:1");
    });

    it('should include a tilde if ratio is not exact', function () {
        var impreciseScreen = new ScreenCalc({ pixelWidth: 1366, pixelHeight: 768 });
        assert.strictEqual(impreciseScreen.getStringRatio(), "~16:9");
    });

    it('should allow precision to be changed', function () {
        var screen = new ScreenCalc({ ratio: 1366 / 768 });
        assert.strictEqual(screen.getStringRatio(1.0e-5), "683:384");
    });

    it('should return throw error if insufficient data', function () {
        var screen = new ScreenCalc({});

        assert.throws(function () {
            screen.getStringRatio();
        }, /^Error: Insufficient data to calculate ratio$/);
    });
});

describe('getArea()', function () {
    it('should work with area', function () {
        var screen = new ScreenCalc({ area: 12345 });
        assert.strictEqual(screen.getArea(), 12345);
    });

    // expected iPad and Asus VivoTab numbers taken from
    // http://www.curi.us/1571-lying-microsoft-advertising

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

    it('should work with pixel width, density, and ratio', function () {
        var ipadAir = new ScreenCalc({
            pixelWidth: 2048,
            pixelDensity: 263.92,
            ratio: 2048 / 1536,
        });

        assert.strictEqual(Math.round(ipadAir.getArea() * 100) / 100, 45.16);
    });

    it('should throw error if there is insufficient data', function () {
        var limitedData = new ScreenCalc({
            pixelWidth: 1024,
            pixelHeight: 768
        });

        assert.throws(function () {
            limitedData.getArea();
        }, /^Error: Insufficient data to calculate area$/);
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

    it('should work with area, ratio, and pixel width', function () {
        var lumia920 = new ScreenCalc({
            area: 3.8587 * 2.3152,
            ratio: 1280 / 768,
            pixelWidth: 1280
        });

        assert.strictEqual(Math.round(lumia920.getPixelDensity() * 10) / 10, 331.7);
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

    it('should throw error if insufficient data', function () {
        var screen = new ScreenCalc({ pixelWidth: 1024 });

        assert.throws(function () {
            screen.getPixelCount();
        }, /^Error: Insufficient data to calculate pixel count$/);
    });
});

describe('getDiagonalSize()', function () {
    var ipadMiniRetinaProps: ScreenProperties = { pixelWidth: 2048, pixelHeight: 1536 };

    it("should throw error if diagonal size and density aren't specified", function () {
        var ipadMiniRetina = new ScreenCalc(ipadMiniRetinaProps);

        assert.throws(function () {
            ipadMiniRetina.getDiagonalSize();
        }, /^Error: Insufficient data to calculate diagonal size$/);
    });

    it('should correctly calculate the diagonal size when pixel density is set', function () {
        ipadMiniRetinaProps.pixelDensity = 326;
        var ipadMiniRetina = new ScreenCalc(ipadMiniRetinaProps);
        assert.strictEqual(Math.round(ipadMiniRetina.getDiagonalSize() * 10) / 10, 7.9);
    });
});
