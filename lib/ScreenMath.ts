/*
 * Contains functions for calculating screen properties
 */

/** Calculate the height of a rectangle from its ratio and area */
export function heightFromRatioAndArea(ratio: number, area: number): number {
    /* 
     * width = ratio * height
     * area = ratio * height * height
     * height^2 = area / ratio
     */

    return Math.sqrt(area / ratio);
}

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

/** Get the ratio of a screen given its height in pixels and total number of pixels */
export function ratioFromPixelHeightAndPixelCount(pixelHeight: number, pixelCount: number) {
    /*
     * Formula:  pixelHeight * ratio * pixelHeight = pixelCount
     * Simplify: ratio * (pixelHeight)^2 = pixelCount
     * Solve:    ratio = pixelCount / (pixelHeight)^2
     */

    return pixelCount / Math.pow(pixelHeight, 2);
}

/**
 * Calculates the simplest fraction for a floating point number using continued fractions 
 * (based on http://en.wikipedia.org/wiki/Continued_fraction#Infinite_continued_fractions)
 * Returns an array containing the numerator and denominator of the simplified fraction.
 * @param f The number to calculate the simplest fraction for
 * @param epsilon A number between 0 and 1 which determines precision. Values closer to
 *                zero increase precision. Defaults to a magic number which returns the
 *                "expected" ratio for common screen resolutions.
 */
export function calculateSimplestFraction(f: number, epsilon = 5.0e-3): [number, number] {
    if (!(epsilon > 0 && epsilon < 1)) {
        throw new Error('Epsilon set to ' + epsilon.toString() + '. Must be between 0 and 1.');
    }

    var a = Math.floor(f); // integer part of number

    // convergents
    var h: number; // numerator
    var k: number; // denominator

    // the two previous convergents are necessary to 
    // incorporate new terms into a rational approximation
    var h1: number, h2: number, k1: number, k2: number;

    // convergents for first 2 terms are 0/1 and 1/0
    h2 = 0; k2 = 1;
    h1 = 1; k1 = 0;

    h = a;
    k = 1;

    while (f - a > epsilon * k * k) {
        f = 1 / (f - a);
        a = Math.floor(f);

        h2 = h1;
        h1 = h;
        k2 = k1;
        k1 = k;

        // successive convergents are given by the formula:
        // h(n) = a(n)h(n-1) + h(n-2)
        // k(n)   a(n)k(n-1) + k(n-2)

        h = a * h1 + h2;
        k = a * k1 + k2;
    }

    return [h, k];
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
