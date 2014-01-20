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
        if (this.pixelWidth !== null && this.ratio !== null) {
            return this.pixelWidth / this.ratio;
        } else if (this.pixelCount !== null && this.ratio !== null) {
            return ScreenMath.pixelHeightFromRatioAndPixelCount(this.ratio, this.pixelCount);
        } else if (this.physicalHeight !== null && this.pixelDensity !== null) {
            return this.physicalHeight * this.pixelDensity;
        } else if (this.diagonalSize !== null && this.ratio !== null && this.pixelDensity !== null) {
            var physicalHeight = ScreenMath.physicalHeightFromRatioAndDiagonalSize(this.ratio, this.diagonalSize);
            return physicalHeight * this.pixelDensity;
        }

        return this.pixelHeight;
    }

    /**
     * Attempts to calculate/return the pixel width of the screen.
     * Returns null if there is insufficient data.
     */
    public getPixelWidth(): number {
        if (this.getPixelHeight() !== null && this.ratio !== null) {
            return this.getPixelHeight() * this.ratio;
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
     * Attempts to calculate/return the screen's ratio as a simplified string
     * (e.g. a 1920x1080 display would return "16:9").
     * Returns null if insufficient data.
     */
    public getStringRatio(): string {
        var wAndH = this.calculateWidthAndHeight();

        if (wAndH !== null) {
            return ScreenMath.calculateStringRatio(wAndH.width, wAndH.height)
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
        } else if (this.pixelDensity !== null) {
            if (this.pixelWidth !== null && this.physicalHeight !== null) {
                var physicalWidth = this.pixelWidth / this.pixelDensity;
                return { width: physicalWidth, height: this.physicalHeight };
            } else if (this.pixelHeight !== null && this.physicalWidth !== null) {
                var physicalHeight = this.pixelHeight / this.pixelDensity;
                return { width: this.physicalWidth, height: physicalHeight };
            }
        } else if (this.pixelCount !== null) {
            if (this.pixelHeight !== null) {
                var ratio = ScreenMath.ratioFromPixelHeightAndPixelCount(this.pixelHeight, this.pixelCount);
                return { height: this.pixelHeight, width: this.pixelHeight * ratio };
            } else if (this.pixelWidth !== null) {
                var pixelHeight = this.pixelCount / this.pixelWidth;
                return { height: pixelHeight, width: this.pixelWidth };
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
