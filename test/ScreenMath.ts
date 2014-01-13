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
    it('should work with an iPad screen', function () {
        var ratio = 2048 / 1536;
        var diagonalSize = 9.7;
        var height = ScreenMath.physicalHeightFromRatioAndDiagonalSize(ratio, diagonalSize);

        assert.strictEqual(Math.round(height * 100) / 100, 5.82);
    });

    it('should work with an Asus VivoTab display', function () {
        var ratio = 1366 / 768;
        var diagonalSize = 10.1;
        var height = ScreenMath.physicalHeightFromRatioAndDiagonalSize(ratio, diagonalSize);

        assert.strictEqual(Math.round(height * 100) / 100, 4.95);
    });
});
