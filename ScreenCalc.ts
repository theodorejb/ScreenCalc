/**
 * Contains properties and methods for storing and
 * performing calculations on electronic displays.
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
        if (!ScreenCalc.isPositiveInt(pixelWidth)) {
            throw new Error("pixelWidth must be a positive integer");
        } else {
            this.pixelWidth = pixelWidth;
        }
    }

    public getPixelHeight(): number {
        return this.pixelHeight;
    }

    public setPixelHeight(pixelHeight: number): void {
        if (!ScreenCalc.isPositiveInt(pixelHeight)) {
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
        if (!ScreenCalc.isPositiveNum(diagonalSize)) {
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
        /*
         * Pythagorean theorem: base squared + height squared = diagonal size squared.
         * The physical width and height aren't yet known, but the ratio is. The ratio
         * can be used to define the base in terms of height, and solve for height using 
         * the diagonal size.
         * 
         * height squared + (ratio * height) squared = diagonal squared
         * Expanded: height squared + ratio squared * height squared = diagonal squared
         *
         * Since ratio squared is multiplied by height squared, adding height squared 
         * simply increases this multiple by 1. Therefore:
         * (ratio squared + 1) * height squared = diagonal squared
         */

        var ratioSquared = Math.pow(this.getRatio(), 2);
        var diagonalSquared = Math.pow(this.diagonalSize, 2);
        var baseSquared = ratioSquared + 1;
        var heightSquared = diagonalSquared / baseSquared;
        var height = Math.sqrt(heightSquared);
        return height;
    }

    /** Returns the area of the display in square units */
    public getArea(): number {
        return this.getPhysicalHeight() * this.getPhysicalWidth();
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
        // start by finding the greatest common divisor of the pixel width and pixel height
        var gcd = gcdRecursive(this.pixelWidth, this.pixelHeight);

        // then divide the width and height by the gcd to find the simplest width to height ratio
        var simpleWidth = this.pixelWidth / gcd;
        var simpleHeight = this.pixelHeight / gcd;

        // if the simplified width goes evenly into 16, 
        // and the simplified height is not 3, multiply 
        // both sides by the quotient so that the ratio is 16:n
        if (simpleHeight !== 3 && (16 % simpleWidth === 0)) {
            var quotient = 16 / simpleWidth;
            simpleWidth = 16;
            simpleHeight = simpleHeight * quotient;
        }

        // return as string
        return simpleWidth.toString() + ':' + simpleHeight.toString();

        /** Returns the greatest common divisor of a and b */
        function gcdRecursive (a: number, b: number): number {
            if (!b) {
                return a;
            }

            return gcdRecursive(b, a % b);
        }
    }

    /** Returns true if the specified value is a positive integer */
    public static isPositiveInt(val: any): boolean {
        var y = parseInt(val);
        if (isNaN(y)) {
            return false;
        }
        
        return val === y && val.toString() === y.toString() && val > 0;
    }

    /** Returns true if the value is a positive number */
    public static isPositiveNum(val: any): boolean {
        return typeof val === "number" && val > 0;
    }

}

export = ScreenCalc;
