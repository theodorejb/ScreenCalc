/// <reference path="../ts_definitions/node.d.ts" />
/// <reference path="../ts_definitions/mocha.d.ts" />

import ScreenMath = require('../lib/ScreenMath');
import assert = require('assert');

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

describe('Calculate string ratio', function () {
    it('should work correctly for 16:n displays', function () {
        assert.strictEqual(ScreenMath.calculateStringRatio(1920, 1080), "16:9");
        assert.strictEqual(ScreenMath.calculateStringRatio(1920, 1200), "16:10");
    });

    it('should work with 4:3 and 5:3 screens', function () {
        assert.strictEqual(ScreenMath.calculateStringRatio(2048, 1536), "4:3");
        assert.strictEqual(ScreenMath.calculateStringRatio(1280, 768), "5:3");
    });

    it('should work for the iPhone 5', function () {
        assert.strictEqual(ScreenMath.calculateStringRatio(1136, 640), "71:40"); // 15.975:9
    });
});
