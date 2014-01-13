/*
 * Contains functions for calculating screen properties
 */

/** Calculate the physical height of a rectangle from its ratio and diagonal size */
export function physicalHeightFromRatioAndDiagonalSize(ratio: number, diagonalSize: number): number {
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

    var ratioSquared = Math.pow(ratio, 2);
    var diagonalSquared = Math.pow(diagonalSize, 2);
    var baseSquared = ratioSquared + 1;
    var heightSquared = diagonalSquared / baseSquared;
    return Math.sqrt(heightSquared);
}

/** Get the pixel height of a screen given its ratio and total number of pixels */
export function pixelHeightFromRatioAndPixelCount(ratio: number, pixelCount: number): number {
    /*
     * Formula:    pixelHeight * (ratio * pixelHeight) = pixelCount
     * Distribute: ratio * (pixelHeight)^3 = pixelCount
     * Simplify:   pixelHeight = sqrt( pixelCount / ratio )
     */

    return Math.sqrt(pixelCount / ratio);
}

/**
 * Get the ratio of two numbers as a simplified string.
 * For example, 1920 and 1080 should return 16:9.
 */
export function calculateStringRatio(width: number, height: number): string {
    // start by finding the greatest common divisor of the pixel width and pixel height
    var gcd = gcdRecursive(width, height);

    // then divide the width and height by the gcd to find the simplest width to height ratio
    var simpleWidth = width / gcd;
    var simpleHeight = height / gcd;

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
    function gcdRecursive(a: number, b: number): number {
        if (!b) {
            return a;
        }

        return gcdRecursive(b, a % b);
    }
}

/** Returns true if the specified value is a positive integer */
export function isPositiveInt(val: any): boolean {
    var y = parseInt(val);
    if (isNaN(y)) {
        return false;
    }

    return val === y && val.toString() === y.toString() && val > 0;
}

/** Returns true if the value is a positive number */
export function isPositiveNum(val: any): boolean {
    return typeof val === "number" && val > 0;
}
