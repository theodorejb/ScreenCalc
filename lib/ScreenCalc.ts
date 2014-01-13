import ScreenMath = require('./ScreenMath');

/**
 * Allows screen information to be easily stored and calculated
 */
class ScreenCalc {
    private pixelWidth: number;
    private pixelHeight: number;
    private diagonalSize: number;

    constructor(pixelWidth: number, pixelHeight: number, diagonalSize?: number) {
        this.setPixelWidth(pixelWidth);
        this.setPixelHeight(pixelHeight);
        this.setDiagonalSize(diagonalSize);
    }

    public getPixelWidth(): number {
        return this.pixelWidth;
    }

    public setPixelWidth(pixelWidth: number): void {
        if (!ScreenMath.isPositiveInt(pixelWidth)) {
            throw new Error("pixelWidth must be a positive integer");
        } else {
            this.pixelWidth = pixelWidth;
        }
    }

    public getPixelHeight(): number {
        return this.pixelHeight;
    }

    public setPixelHeight(pixelHeight: number): void {
        if (!ScreenMath.isPositiveInt(pixelHeight)) {
            throw new Error("pixelHeight must be a positive integer");
        } else {
            this.pixelHeight = pixelHeight;
        }
    }

    /** Returns the diagonal size of the display */
    public getDiagonalSize(): number {
        return this.diagonalSize;
    }

    public setDiagonalSize(diagonalSize: number): void {
        if (!ScreenMath.isPositiveNum(diagonalSize)) {
            diagonalSize = 0;
        }

        this.diagonalSize = diagonalSize;
    }

    /**
     * Returns the number of pixels per unit in the display
     * (will be ppi if units are in, or ppcm if units are cm)
     */
    public getPixelDensity(): number {
        var density = this.pixelWidth / this.getPhysicalWidth();
        return Math.round(density); // round to nearest integer
    }

    /**
     * Set the display's diagonal size from its pixel density (pixels per unit)
     */
    public setPixelDensity(ppu: number): void {
        var physicalHeight = this.pixelHeight / ppu;
        var physicalWidth = physicalHeight * this.getRatio();

        // base squared + height squared = diagonal squared
        var diagonalSquared = Math.pow(physicalHeight, 2) + Math.pow(physicalWidth, 2);
        this.diagonalSize = Math.sqrt(diagonalSquared);
    }

    /** Returns the physical width of the display */
    public getPhysicalWidth(): number {
        return this.getPhysicalHeight() * this.getRatio();
    }

    /** Returns the physical height of the display */
    public getPhysicalHeight(): number {
        return ScreenMath.physicalHeightFromRatioAndDiagonalSize(this.getRatio(), this.getDiagonalSize());
    }

    /** Returns the area of the display in square units */
    public getArea(): number {
        return this.getPhysicalHeight() * this.getPhysicalWidth();
    }

    /** Returns the total number of pixels in the screen */
    public getPixelCount(): number {
        return this.getPixelWidth() * this.getPixelHeight();
    }

    /**
     * Returns the screen's width divided by its height.
     * For example, the ratio of a 1920x1080 display would 
     * be 1.78 when rounded to two decimal places.
     */
    public getRatio(): number {
        return this.pixelWidth / this.pixelHeight;
    }

    /**
     * Returns a screen's ratio as a simplified string.
     * For example, a 1920x1080 display would return 16:9
     */
    public getStringRatio(): string {
        return ScreenMath.calculateStringRatio(this.getPixelWidth(), this.getPixelHeight());
    }

}

export = ScreenCalc;
