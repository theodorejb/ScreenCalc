/// <reference path="ScreenProperties.d.ts" />

import ScreenMath = require('./ScreenMath');

/**
 * Allows screen information to be easily stored and calculated
 */
class ScreenCalc {
    /** Holds the provided display data */
    private d: ScreenProperties;

    /** Magic number that results in "expected" ratio for common screen resolutions */
    private static DEFAULT_RATIO_PRECISION = 5.0e-3;

    constructor(properties: ScreenProperties = {}) {
        // properties should be initialized to null
        this.d = {
            pixelWidth:     null,
            pixelHeight:    null,
            pixelCount:     null,
            pixelDensity:   null,
            ratio:          null,
            physicalWidth:  null,
            physicalHeight: null,
            diagonalSize:   null,
        };

        this.setData(properties);
    }

    /**
     * Set data for one or more properties.
     * If 'replace' param is set to true, properties that aren't passed will be set to null.
     */
    public setData(properties: ScreenProperties, replace: boolean = false) {
        if (replace) {
            for (var prop in this.d) {
                this.d[prop] = null;
            }
        }

        for (var property in properties) {
            if (typeof this.d[property] !== "undefined") {
                // The property is valid. If the property is pixelWidth, pixelHeight, or pixelCount,
                // make sure it's a positive int. Otherwise just make sure it's a positive number.

                if (["pixelWidth", "pixelHeight", "pixelCount"].indexOf(property) !== -1 && !ScreenMath.isPositiveInt(properties[property])) {
                    throw new Error(property + " must be a positive integer");
                } else if (!ScreenMath.isPositiveNum(properties[property])) {
                    throw new Error(property + " must be a positive number");
                }

                this.d[property] = properties[property];
            } else {
                throw new Error("Invalid property '" + property + "'");
            }
        }
    }

    /**
     * Attempts to calculate/return the pixel height of the screen.
     * Returns null if there is insufficient data.
     */
    public getPixelHeight(): number {
        var ratio = this.getRatio();

        if (ratio !== null) {
            if (this.d.pixelWidth !== null) {
                return this.d.pixelWidth / ratio;
            } else if (this.d.pixelCount !== null) {
                return ScreenMath.pixelHeightFromRatioAndPixelCount(ratio, this.d.pixelCount);
            } else if (this.d.diagonalSize !== null && this.d.pixelDensity !== null) {
                var physicalHeight = ScreenMath.physicalHeightFromRatioAndDiagonalSize(ratio, this.d.diagonalSize);
                return physicalHeight * this.d.pixelDensity;
            }
        }

        if (this.d.physicalHeight !== null && this.d.pixelDensity !== null) {
            return this.d.physicalHeight * this.d.pixelDensity;
        }

        return this.d.pixelHeight;
    }

    /**
     * Attempts to calculate/return the pixel width of the screen.
     * Returns null if there is insufficient data.
     */
    public getPixelWidth(): number {
        if (this.getPixelHeight() !== null && this.getRatio() !== null) {
            return this.getPixelHeight() * this.getRatio();
        } else if (this.d.physicalWidth !== null && this.d.pixelDensity !== null) {
            return this.d.physicalWidth * this.d.pixelDensity;
        }

        return this.d.pixelWidth;
    }

    /**
     * Attempts to calculate/return the screen's physical height.
     * Returns null if there is insufficient data.
     */
    public getPhysicalHeight(): number {
        if (this.getRatio() !== null && this.d.physicalWidth !== null) {
            return this.d.physicalWidth / this.getRatio();
        } else if (this.d.pixelDensity !== null && this.d.pixelHeight !== null) {
            return this.d.pixelHeight / this.d.pixelDensity;
        } else if (this.getRatio() !== null && this.d.diagonalSize !== null) {
            return ScreenMath.physicalHeightFromRatioAndDiagonalSize(this.getRatio(), this.d.diagonalSize);
        }

        return this.d.physicalHeight;
    }

    /**
     * Attempts to calculate/return the screen's physical width.
     * Returns null if there is insufficient data.
     */
    public getPhysicalWidth(): number {
        if (this.d.pixelDensity !== null && this.d.pixelWidth !== null) {
            return this.d.pixelWidth / this.d.pixelDensity;
        } else if (this.getPhysicalHeight() !== null && this.getRatio() !== null) {
            return this.getPhysicalHeight() * this.getRatio();
        }

        return this.d.physicalWidth;
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

        return this.d.diagonalSize;
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

        return this.d.pixelDensity;
    }

    /**
     * Returns the area of the display in square units, or null if there
     * is insufficient data to calculate the physical width and height.
     */
    public getArea(): number {
        var w = this.getPhysicalWidth();
        var h = this.getPhysicalHeight();

        if (w === null || h === null) {
            return null;
        } else {
            return w * h;
        }
    }

    /** Returns the total number of pixels in the screen */
    public getPixelCount(): number {
        if (this.getPixelWidth() !== null && this.getPixelHeight() !== null) {
            return this.getPixelWidth() * this.getPixelHeight();
        }

        return this.d.pixelCount;
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

        return this.d.ratio;
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
        if (this.d.pixelWidth !== null && this.d.pixelHeight !== null) {
            return { width: this.d.pixelWidth, height: this.d.pixelHeight };
        } else if (this.d.physicalWidth !== null && this.d.physicalHeight !== null) {
            return { width: this.d.physicalWidth, height: this.d.physicalHeight };
        }

        if (this.d.pixelDensity !== null) {
            if (this.d.pixelWidth !== null && this.d.physicalHeight !== null) {
                var physicalWidth = this.d.pixelWidth / this.d.pixelDensity;
                return { width: physicalWidth, height: this.d.physicalHeight };
            } else if (this.d.pixelHeight !== null && this.d.physicalWidth !== null) {
                var physicalHeight = this.d.pixelHeight / this.d.pixelDensity;
                return { width: this.d.physicalWidth, height: physicalHeight };
            }
        }

        if (this.d.pixelCount !== null) {
            if (this.d.pixelHeight !== null) {
                var ratio = ScreenMath.ratioFromPixelHeightAndPixelCount(this.d.pixelHeight, this.d.pixelCount);
                return { height: this.d.pixelHeight, width: this.d.pixelHeight * ratio };
            } else if (this.d.pixelWidth !== null) {
                var pixelHeight = this.d.pixelCount / this.d.pixelWidth;
                return { height: pixelHeight, width: this.d.pixelWidth };
            }
        }

        if (this.d.diagonalSize !== null) {
            // Pythagorean theorem: width squared + height squared = diagaonl squared
            var diagonalSq = Math.pow(this.d.diagonalSize, 2);

            if (this.d.physicalWidth !== null) {
                var widthSq = Math.pow(this.d.physicalWidth, 2);
                var heightSq = diagonalSq - widthSq;
                return { width: this.d.physicalWidth, height: Math.sqrt(heightSq) };
            } else if (this.d.physicalHeight !== null) {
                var heightSq = Math.pow(this.d.physicalHeight, 2);
                var widthSq = diagonalSq - heightSq;
                return { width: Math.sqrt(widthSq), height: this.d.physicalHeight };
            }
        }

        return null;
    }

}

export = ScreenCalc;
