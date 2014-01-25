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
     * Formula:  pixelHeight * ratio * pixelHeight = pixelCount
     * Simplify: ratio * (pixelHeight)^2 = pixelCount
     * Solve:    pixelHeight = sqrt( pixelCount / ratio )
     */

    return Math.sqrt(pixelCount / ratio);
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

/**
 * Calculates the simplest fraction for a floating point number using continued fractions 
 * (based on http://en.wikipedia.org/wiki/Continued_fraction#Infinite_continued_fractions)
 * Returns an array containing the numerator and denominator of the simplified fraction.
 * @param f The number to calculate the simplest fraction for
 * @param epsilon (optional) a number between -1 and 0 which determines precision (closer to zero = greater precision)
 */
export function calculateSimplestFraction(f: number, epsilon = 5.0e-3): number[] {

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
