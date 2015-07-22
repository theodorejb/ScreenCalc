import * as ScreenMath from '../lib/ScreenMath';
import * as assert from 'assert';

describe('isPositiveInt()', function () {
    it('should return false for 0', function () {
        assert.strictEqual(ScreenMath.isPositiveInt(0), false);
    });

    it('should return false for negative numbers', function () {
        assert.strictEqual(ScreenMath.isPositiveInt(-0), false);
        assert.strictEqual(ScreenMath.isPositiveInt(-1), false);
        assert.strictEqual(ScreenMath.isPositiveInt(-25), false);
    });

    it('should return false for strings', function () {
        assert.strictEqual(ScreenMath.isPositiveInt("string"), false);
        assert.strictEqual(ScreenMath.isPositiveInt("1"), false);
    });

    it('should return false for floats', function () {
        assert.strictEqual(ScreenMath.isPositiveInt(1.5), false);
    });

    it('should return true for positive integers', function () {
        assert.strictEqual(ScreenMath.isPositiveInt(1), true);
        assert.strictEqual(ScreenMath.isPositiveInt(2.00), true);
        assert.strictEqual(ScreenMath.isPositiveInt(77), true);
        assert.strictEqual(ScreenMath.isPositiveInt(100000000000), true);
    });
});

describe('isPositiveNum()', function () {
    it('should return false for 0', function () {
        assert.strictEqual(ScreenMath.isPositiveNum(0), false);
    });

    it('should return false for negative numbers', function () {
        assert.strictEqual(ScreenMath.isPositiveNum(-0), false);
        assert.strictEqual(ScreenMath.isPositiveNum(-1), false);
        assert.strictEqual(ScreenMath.isPositiveNum(-25), false);
    });

    it('should return false for strings', function () {
        assert.strictEqual(ScreenMath.isPositiveNum("string"), false);
        assert.strictEqual(ScreenMath.isPositiveNum("1"), false);
        assert.strictEqual(ScreenMath.isPositiveNum("2.0"), false);
    });

    it('should return true for positive floats', function () {
        assert.strictEqual(ScreenMath.isPositiveNum(1.5), true);
        assert.strictEqual(ScreenMath.isPositiveNum(0.1593792), true);
    });

    it('should return true for positive integers', function () {
        assert.strictEqual(ScreenMath.isPositiveNum(1), true);
        assert.strictEqual(ScreenMath.isPositiveNum(77), true);
        assert.strictEqual(ScreenMath.isPositiveNum(100000000000), true);
    });
});

describe('Calculate physical height', function () {
    it('should work with ratio and diagonal size', function () {
        var ipad = {
            ratio: 2048 / 1536,
            diagonalSize: 9.7
        };

        var ipadHeight = ScreenMath.physicalHeightFromRatioAndDiagonalSize(ipad.ratio, ipad.diagonalSize);
        assert.strictEqual(ipadHeight, 5.82);

        var vivotab = {
            ratio: 1366 / 768,
            diagonalSize: 10.1
        };

        var vivotabHeight = ScreenMath.physicalHeightFromRatioAndDiagonalSize(vivotab.ratio, vivotab.diagonalSize);
        assert.strictEqual(Math.round(vivotabHeight * 100) / 100, 4.95);
    });
});

describe('Calculate pixel height', function () {
    it('should work with ratio and pixel count', function () {
        var ratio = 16 / 9;
        var pixelCount = 1920 * 1080;

        var ratio2 = 3 / 4;
        var pixelCount2 = 1536 * 2048;

        assert.strictEqual(ScreenMath.pixelHeightFromRatioAndPixelCount(ratio, pixelCount), 1080);
        assert.strictEqual(ScreenMath.pixelHeightFromRatioAndPixelCount(ratio2, pixelCount2), 2048);
    });
});

describe('Calculate ratio', function () {
    it('should work with pixel height and pixel count', function () {
        assert.strictEqual(ScreenMath.ratioFromPixelHeightAndPixelCount(1536, 2048 * 1536), 4 / 3);
    });
});

describe('Calculate simplest fraction', function () {
    it('should work with common screens with exact ratios', function () {
        assert.deepEqual(ScreenMath.calculateSimplestFraction(1920 / 1080), [16, 9]);
        assert.deepEqual(ScreenMath.calculateSimplestFraction(1920 / 1200), [8, 5]);
        assert.deepEqual(ScreenMath.calculateSimplestFraction(2048 / 1536), [4, 3]);
        assert.deepEqual(ScreenMath.calculateSimplestFraction(1280 / 768), [5, 3]);
        assert.deepEqual(ScreenMath.calculateSimplestFraction(2880 / 900), [16, 5]);
    });

    it('should work with reciprocals of common screen ratios', function () {
        assert.deepEqual(ScreenMath.calculateSimplestFraction(1080 / 1920), [9, 16]);
        assert.deepEqual(ScreenMath.calculateSimplestFraction(1200 / 1920), [5, 8]);
        assert.deepEqual(ScreenMath.calculateSimplestFraction(1536 / 2048), [3, 4]);
        assert.deepEqual(ScreenMath.calculateSimplestFraction(768 / 1280), [3, 5]);
        assert.deepEqual(ScreenMath.calculateSimplestFraction(900 / 2880), [5, 16]);
        assert.deepEqual(ScreenMath.calculateSimplestFraction(768 / 1366), [9, 16]);
        assert.deepEqual(ScreenMath.calculateSimplestFraction(640 / 1136), [9, 16]);
    });

    it('should round to simple ratios by default', function () {
        assert.deepEqual(ScreenMath.calculateSimplestFraction(1366 / 768), [16, 9]);
        assert.deepEqual(ScreenMath.calculateSimplestFraction(1136 / 640), [16, 9]);
    });

    it('should allow default precision to be overridden', function () {
        assert.deepEqual(ScreenMath.calculateSimplestFraction(1366 / 768, 1.0e-5), [683, 384]);
        assert.deepEqual(ScreenMath.calculateSimplestFraction(1136 / 640, 1.0e-3), [71, 40]);
    });

    it('should throw error if epsilon is invalid', function () {
        // epsilon must be between 0 and 1 (exclusive)
        assert.throws(function () {
            ScreenMath.calculateSimplestFraction(16 / 9, 0);
        }, Error);

        assert.throws(function () {
            ScreenMath.calculateSimplestFraction(16 / 9, 1);
        }, Error);

        assert.throws(function () {
            ScreenMath.calculateSimplestFraction(16 / 9, -0.1);
        }, Error);
    });
});
