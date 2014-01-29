/// <reference path="../ts_definitions/ScreenCalcTypes.d.ts" />

import ScreenMath = require('./ScreenMath');

/**
 * Allows screen information to be easily stored and calculated
 */
class ScreenCalc {
    private pixelWidth: number = null;
    private pixelHeight: number = null;
    private pixelCount: number = null;
    private pixelDensity: number = null;
    private ratio: number = null;
    private physicalWidth: number = null;
    private physicalHeight: number = null;
    private diagonalSize: number = null;

    /** Magic number that results in "expected" ratio for common screen resolutions */
    private static DEFAULT_RATIO_PRECISION = 5.0e-3;

    constructor(properties?: ScreenConstructor) {
        if (typeof properties !== "undefined") {
            this.setData(properties);
        }
    }

    /**
     * Set data for one or more properties.
     * If 'replace' param is set to true, properties that aren't passed will be set to null.
     */
    public setData(properties: ScreenConstructor, replace: boolean = false) {
        if (replace) {
            this.pixelWidth = null;
            this.pixelHeight = null;
            this.pixelCount = null;
            this.pixelDensity = null;
            this.ratio = null;
            this.physicalWidth = null;
            this.physicalHeight = null;
            this.diagonalSize = null;
        }

        if (typeof properties.pixelWidth !== "undefined") {
            this.setPixelWidth(properties.pixelWidth);
        }

        if (typeof properties.pixelHeight !== "undefined") {
            this.setPixelHeight(properties.pixelHeight);
        }

        if (typeof properties.pixelCount !== "undefined") {
            this.setPixelCount(properties.pixelCount);
        }

        if (typeof properties.pixelDensity !== "undefined") {
            this.setPixelDensity(properties.pixelDensity);
        }

        if (typeof properties.ratio !== "undefined") {
            this.setRatio(properties.ratio);
        }

        if (typeof properties.physicalWidth !== "undefined") {
            this.setPhysicalWidth(properties.physicalWidth);
        }

        if (typeof properties.physicalHeight !== "undefined") {
            this.setPhysicalHeight(properties.physicalHeight);
        }

        if (typeof properties.diagonalSize !== "undefined") {
            this.setDiagonalSize(properties.diagonalSize);
        }

    }

    /**
     * Attempts to calculate/return the pixel height of the screen.
     * Returns null if there is insufficient data.
     */
    public getPixelHeight(): number {
        var ratio = this.getRatio();

        if (ratio !== null) {
            if (this.pixelWidth !== null) {
                return this.pixelWidth / ratio;
            } else if (this.pixelCount !== null) {
                return ScreenMath.pixelHeightFromRatioAndPixelCount(ratio, this.pixelCount);
            } else if (this.diagonalSize !== null && this.pixelDensity !== null) {
                var physicalHeight = ScreenMath.physicalHeightFromRatioAndDiagonalSize(ratio, this.diagonalSize);
                return physicalHeight * this.pixelDensity;
            }
        }

        if (this.physicalHeight !== null && this.pixelDensity !== null) {
            return this.physicalHeight * this.pixelDensity;
        }

        return this.pixelHeight;
    }

    /**
     * Attempts to calculate/return the pixel width of the screen.
     * Returns null if there is insufficient data.
     */
    public getPixelWidth(): number {
        if (this.getPixelHeight() !== null && this.getRatio() !== null) {
            return this.getPixelHeight() * this.getRatio();
        } else if (this.physicalWidth !== null && this.pixelDensity !== null) {
            return this.physicalWidth * this.pixelDensity;
        }

        return this.pixelWidth;
    }

    /**
     * Attempts to calculate/return the screen's physical height.
     * Returns null if there is insufficient data.
     */
    public getPhysicalHeight(): number {
        if (this.getRatio() !== null && this.physicalWidth !== null) {
            return this.physicalWidth / this.getRatio();
        } else if (this.pixelDensity !== null && this.pixelHeight !== null) {
            return this.pixelHeight / this.pixelDensity;
        } else if (this.getRatio() !== null && this.diagonalSize !== null) {
            return ScreenMath.physicalHeightFromRatioAndDiagonalSize(this.getRatio(), this.diagonalSize);
        }

        return this.physicalHeight;
    }

    /**
     * Attempts to calculate/return the screen's physical width.
     * Returns null if there is insufficient data.
     */
    public getPhysicalWidth(): number {
        if (this.pixelDensity !== null && this.pixelWidth !== null) {
            return this.pixelWidth / this.pixelDensity;
        } else if (this.getPhysicalHeight() !== null && this.getRatio() !== null) {
            return this.getPhysicalHeight() * this.getRatio();
        }

        return this.physicalWidth;
    }

    /**
     * Attempts to calculate/return the screen's diagonal size.
     * Returns null if there is insufficient data.
     */
    public getDiagonalSize(): number {

        if (this.getPhysicalHeight() !== null && this.getPhysicalWidth() !== null) {
            var diagonalSq = Math.pow(this.getPhysicalHeight(), 2) + Math.pow(this.getPhysicalWidth(), 2);
            return Math.sqrt(diagonalSq);
        }

        return this.diagonalSize;
    }

    /**
     * Returns the number of pixels per unit in the display
     * (will be ppi if units are in, or ppcm if units are cm)
     */
    public getPixelDensity(): number {
        if (this.getPixelHeight() !== null && this.getPhysicalHeight() !== null) {
            return this.getPixelHeight() / this.getPhysicalHeight();
        } else if (this.getPixelWidth() !== null && this.getPhysicalWidth() !== null) {
            return this.getPixelWidth() / this.getPhysicalWidth();
        }

        return this.pixelDensity;
    }

    /** Returns the area of the display in square units */
    public getArea(): number {
        return this.getPhysicalHeight() * this.getPhysicalWidth();
    }

    /** Returns the total number of pixels in the screen */
    public getPixelCount(): number {
        if (this.getPixelWidth() !== null && this.getPixelHeight() !== null) {
            return this.getPixelWidth() * this.getPixelHeight();
        }

        return this.pixelCount;
    }

    /**
     * Returns the screen's width divided by its height.
     * For example, the ratio of a 1920x1080 display would 
     * be 1.78 when rounded to two decimal places.
     */
    public getRatio(): number {

        // try to calculate the ratio from width and height if possible
        var wAndH = this.calculateWidthAndHeight();

        if (wAndH !== null) {
            return wAndH.width / wAndH.height;
        }

        return this.ratio;
    }

    /**
     * Returns an object with 'width' and 'height' properties containing a simplified ratio for the display.
     * Additionally, a 'difference' property is included which contains the difference between the simplified 
     * and original ratio (0 if the simplified ratio is exact). For example, a 1366x768 display would (by default) 
     * return { width: 16, height: 9, difference: -0.0008680555555555802 }.
     * Returns null if there is not enough data to calculate the ratio.
     * @param precision (optional) pass a number between 0 and 1 for precision (defaults to 5.0e-3). 
     * The closer the number is to zero the greater the precision. For example, if 1.0e-6 is passed,
     * the return value for a 1366x768 display would be { width: 683, height: 384, difference: 0 }.
     */
    public getSimpleRatio(precision: number = ScreenCalc.DEFAULT_RATIO_PRECISION) {
        var ratio = this.getRatio();

        if (ratio !== null) {
            var fractionArr = ScreenMath.calculateSimplestFraction(ratio, precision);
            var simpleWidth = fractionArr[0];
            var simpleHeight = fractionArr[1];

            // 8:5 ratios should be converted to 16:10
            if (simpleWidth / simpleHeight === 16 / 10) {
                simpleWidth = 16;
                simpleHeight = 10;
            } else if (simpleWidth / simpleHeight === 10 / 16) {
                simpleWidth = 10;
                simpleHeight = 16;
            }

            var difference = (simpleWidth / simpleHeight) - ratio;
            return { width: simpleWidth, height: simpleHeight, difference: difference };
        }

        return null;
    }

    /**
     * Returns the same simplified ratio as getSimpleRatio(), but as a string in the format width:height.
     * For example, a 1920x1080 display would return "16:9". If the ratio is imprecise, a tilde (~) character 
     * is prepended to the string (i.e. "~16x9").
     * Returns null if there is not enough data to calculate the ratio.
     * @param precision (optional) pass a number between 0 and 1 for precision (defaults to 5.0e-3). 
     * The closer the number is to zero the greater the precision. For example, if 1.0e-6 is passed,
     * the return value for a 1366x768 display would be the precise ratio "683:384".
     */
    public getStringRatio(precision: number = ScreenCalc.DEFAULT_RATIO_PRECISION): string {
        var ratio = this.getSimpleRatio(precision);

        if (ratio !== null) {
            var strRatio = ratio.width.toString() + ':' + ratio.height.toString();
            
            if (ratio.difference !== 0) {
                strRatio = "~" + strRatio;
            }

            return strRatio;
        }

        return null;
    }

    /**
     * Tries to calculate width and height in the same units (used for ratio calculation).
     * Returns an object with height and width properties, or null if insufficient data.
     */
    private calculateWidthAndHeight() {

        if (this.pixelWidth !== null && this.pixelHeight !== null) {
            return { width: this.pixelWidth, height: this.pixelHeight };
        } else if (this.physicalWidth !== null && this.physicalHeight !== null) {
            return { width: this.physicalWidth, height: this.physicalHeight };
        }

        if (this.pixelDensity !== null) {
            if (this.pixelWidth !== null && this.physicalHeight !== null) {
                var physicalWidth = this.pixelWidth / this.pixelDensity;
                return { width: physicalWidth, height: this.physicalHeight };
            } else if (this.pixelHeight !== null && this.physicalWidth !== null) {
                var physicalHeight = this.pixelHeight / this.pixelDensity;
                return { width: this.physicalWidth, height: physicalHeight };
            }
        }

        if (this.pixelCount !== null) {
            if (this.pixelHeight !== null) {
                var ratio = ScreenMath.ratioFromPixelHeightAndPixelCount(this.pixelHeight, this.pixelCount);
                return { height: this.pixelHeight, width: this.pixelHeight * ratio };
            } else if (this.pixelWidth !== null) {
                var pixelHeight = this.pixelCount / this.pixelWidth;
                return { height: pixelHeight, width: this.pixelWidth };
            }
        }

        if (this.diagonalSize !== null) {
            // Pythagorean theorem: width squared + height squared = diagaonl squared
            var diagonalSq = Math.pow(this.diagonalSize, 2);

            if (this.physicalWidth !== null) {
                var widthSq = Math.pow(this.physicalWidth, 2);
                var heightSq = diagonalSq - widthSq;
                return { width: this.physicalWidth, height: Math.sqrt(heightSq) };
            } else if (this.physicalHeight !== null) {
                var heightSq = Math.pow(this.physicalHeight, 2);
                var widthSq = diagonalSq - heightSq;
                return { width: Math.sqrt(widthSq), height: this.physicalHeight };
            }
        }

        return null;
    }

    private setPixelWidth(pixelWidth: number): void {
        if (!ScreenMath.isPositiveInt(pixelWidth)) {
            throw new Error("pixelWidth must be a positive integer");
        } else {
            this.pixelWidth = pixelWidth;
        }
    }

    private setPixelHeight(pixelHeight: number): void {
        if (!ScreenMath.isPositiveInt(pixelHeight)) {
            throw new Error("pixelHeight must be a positive integer");
        } else {
            this.pixelHeight = pixelHeight;
        }
    }

    private setPixelCount(pixels: number): void {
        if (!ScreenMath.isPositiveInt(pixels)) {
            throw new Error('pixelCount must be a positive integer');
        } else {
            this.pixelCount = pixels;
        }
    }

    private setPixelDensity(density: number): void {
        if (!ScreenMath.isPositiveNum(density)) {
            throw new Error('pixelDensity must be a positive number');
        } else {
            this.pixelDensity = density;
        }
    }

    private setRatio(ratio: number): void {
        if (!ScreenMath.isPositiveNum(ratio)) {
            throw new Error('ratio must be a positive number');
        } else {
            this.ratio = ratio;
        }
    }

    private setPhysicalWidth(width: number): void {
        if (!ScreenMath.isPositiveNum(width)) {
            throw new Error('physicalWidth must be a positive number');
        } else {
            this.physicalWidth = width;
        }
    }

    private setPhysicalHeight(height: number): void {
        if (!ScreenMath.isPositiveNum(height)) {
            throw new Error('physicalHeight must be a positive number');
        } else {
            this.physicalHeight = height;
        }
    }

    private setDiagonalSize(diagonalSize: number): void {
        if (!ScreenMath.isPositiveNum(diagonalSize)) {
            diagonalSize = 0;
        }

        this.diagonalSize = diagonalSize;
    }

}

export = ScreenCalc;
