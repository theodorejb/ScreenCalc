/**
 * Defines the properties available to a screen
 */
export interface ScreenProperties {
    /** The screen's width in pixels */
    pixelWidth?: number;

    /** The screen's height in pixels */
    pixelHeight?: number;

    /** 
     * The total number of pixels in the display
     * (product of pixelWidth and pixelHeight)
     */
    pixelCount?: number;

    /** The number of pixels per physical unit of width or height */
    pixelDensity?: number;

    /** The ratio of width to height */
    ratio?: number;

    /** The physical width of the screen */
    physicalWidth?: number;

    /** The physical height of the screen */
    physicalHeight?: number;

    /** The physical area of the screen in square units */
    area?: number;

    /** The diagonal size of the screen */
    diagonalSize?: number;
}
