/*
 * Contains functions for calculating screen properties
 */

/**
 * Calculate the physical height of a rectangle from its ratio and diagonal size
 */
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
